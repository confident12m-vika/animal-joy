-- ============================================================
-- Animal Joy — Contact messages, targeted email on responses, and reactions
-- شغّلي هذا الملف بعد كل الملفات اللي قبله، في نفس الـ SQL Editor
-- ============================================================

-- ============================================================
-- 1) رسائل "تواصل معنا" + الإيميلات الحقيقية الواردة على الدومين
-- ============================================================
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null,
  message text not null,
  source text not null default 'form' check (source in ('form', 'inbound_email')),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table contact_messages enable row level security;

-- أي حد (حتى زائر مش مسجل دخول) يقدر يبعت رسالة من فورم "تواصل معنا"
create policy "anyone can send a contact message"
  on contact_messages for insert
  to anon, authenticated
  with check (true);

-- الأدمن بس اللي يقدر يقرأ الرسائل
create policy "admin can read contact messages"
  on contact_messages for select
  to authenticated
  using (exists (select 1 from profiles where id = auth.uid() and is_admin = true));

create policy "admin can update contact messages"
  on contact_messages for update
  to authenticated
  using (exists (select 1 from profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from profiles where id = auth.uid() and is_admin = true));

create policy "admin can delete contact messages"
  on contact_messages for delete
  to authenticated
  using (exists (select 1 from profiles where id = auth.uid() and is_admin = true));

-- ============================================================
-- 2) تفعيل pg_net عشان قاعدة البيانات تقدر تنادي على Edge Function
-- (مطلوب عشان نبعت إيميل تلقائي لصاحب بلاغ حيوان مفقود لما حد يرد عليه)
-- ============================================================
create extension if not exists pg_net with schema extensions;

-- ⚠️ غيّري القيمتين دول باسم مشروعك الحقيقي في Supabase وبسر داخلي هتحطيه
-- كمان كـ Secret في Edge Function اسمها send-single-email (هنعملها بعد شوية)
create or replace function notify_poster_on_response()
returns trigger as $$
declare
  poster_id uuid;
  poster_email text;
  pet_title text;
begin
  select lp.user_id, lp.title, p.email
    into poster_id, pet_title, poster_email
  from lost_pets lp
  join profiles p on p.id = lp.user_id
  where lp.id = new.lost_pet_id;

  -- إشعار داخل الموقع (الجرس) — زي قبل كده بالظبط
  insert into notifications (user_id, title, body)
  values (
    poster_id,
    'New response on: ' || pet_title,
    new.responder_name || ' says: ' || new.message || ' — WhatsApp: ' || new.responder_whatsapp
  );

  -- إيميل تذكيري بسيط (من غير تفاصيل حساسة) — بينادي على Edge Function
  perform net.http_post(
    url := 'https://YOUR-PROJECT-REF.supabase.co/functions/v1/send-single-email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'X-Internal-Secret', 'YOUR-INTERNAL-SECRET'
    ),
    body := jsonb_build_object(
      'to', poster_email,
      'subject', 'You have an update on Animal Joy',
      'body', 'Someone responded to your post "' || pet_title || '". Sign in to Animal Joy to see the details.'
    )
  );

  return new;
end;
$$ language plpgsql security definer;

-- الـ trigger نفسه موجود بالفعل من ملف lost-and-found.sql، إعادة إنشائه هنا
-- بيربطه بالنسخة الجديدة من الدالة (اللي بقت كمان بتبعت إيميل)
drop trigger if exists on_lost_pet_response on lost_pet_responses;
create trigger on_lost_pet_response
  after insert on lost_pet_responses
  for each row execute function notify_poster_on_response();

-- ============================================================
-- 3) نظام التفاعلات (Reactions) على المقالات — 4 إيموجيز، عدد منفصل لكل نوع
-- ============================================================
create table if not exists article_reactions (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references articles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reaction text not null check (reaction in ('love', 'like', 'laugh', 'sad')),
  created_at timestamptz not null default now(),
  unique (article_id, user_id)  -- تفاعل واحد بس لكل مستخدم على كل مقال (ممكن يغيّره)
);

alter table article_reactions enable row level security;

-- أي حد يقدر يشوف التفاعلات (عشان الأرقام تظهر للجميع)
create policy "anyone can read reactions"
  on article_reactions for select
  to anon, authenticated
  using (true);

-- بس المستخدم المسجل دخول يقدر يتفاعل، وبس باسمه هو
create policy "users can add own reaction"
  on article_reactions for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users can change own reaction"
  on article_reactions for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users can remove own reaction"
  on article_reactions for delete
  to authenticated
  using (auth.uid() = user_id);

-- عرض (view) بيجمع عدد كل نوع تفاعل لكل مقال، عشان نجيبهم بسهولة من الموقع
create or replace view article_reaction_counts as
select article_id, reaction, count(*) as count
from article_reactions
group by article_id, reaction;
