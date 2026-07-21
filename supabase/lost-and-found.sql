-- ============================================================
-- Animal Joy — Lost & Found (حيوانات مفقودة)
-- شغّلي هذا الملف بعد كل الملفات اللي قبله، في نفس الـ SQL Editor
-- ============================================================

-- جدول البلاغات (المنشورات)
create table if not exists lost_pets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  post_type text not null check (post_type in ('lost', 'possibly-lost', 'urgent-help')),
  animal_type text not null check (animal_type in ('cat', 'dog', 'other')),
  title text not null,
  description text not null,
  image text,
  location_url text,
  event_date date,
  status text not null default 'active' check (status in ('active', 'resolved')),
  created_at timestamptz not null default now()
);

alter table lost_pets enable row level security;

-- أي حد (حتى لو مش مسجل دخول) يقدر يشوف البلاغات — عشان أكبر عدد ممكن من
-- الناس يشوفوا ويساعدوا
create policy "anyone can read lost pets"
  on lost_pets for select
  to anon, authenticated
  using (true);

-- بس المستخدم المسجل دخول يقدر ينشر بلاغ، وبس باسمه هو
create policy "users can create own lost pets"
  on lost_pets for insert
  to authenticated
  with check (auth.uid() = user_id);

-- صاحب البلاغ أو الأدمن يقدروا يعدّلوا (مثلاً "تم العثور عليه")
create policy "owner or admin can update lost pets"
  on lost_pets for update
  to authenticated
  using (auth.uid() = user_id or exists (select 1 from profiles where id = auth.uid() and is_admin = true))
  with check (auth.uid() = user_id or exists (select 1 from profiles where id = auth.uid() and is_admin = true));

-- صاحب البلاغ أو الأدمن يقدروا يحذفوا
create policy "owner or admin can delete lost pets"
  on lost_pets for delete
  to authenticated
  using (auth.uid() = user_id or exists (select 1 from profiles where id = auth.uid() and is_admin = true));

-- ============================================================
-- جدول رقم واتساب صاحب البلاغ — منفصل تمامًا وسري، الأدمن وصاحب البلاغ بس
-- اللي يقدروا يشوفوه، مش ظاهر لأي زائر أو مستخدم تاني خالص
-- ============================================================
create table if not exists lost_pets_contact (
  lost_pet_id uuid primary key references lost_pets(id) on delete cascade,
  whatsapp text not null
);

alter table lost_pets_contact enable row level security;

create policy "owner or admin can read contact"
  on lost_pets_contact for select
  to authenticated
  using (
    exists (select 1 from lost_pets lp where lp.id = lost_pet_id and lp.user_id = auth.uid())
    or exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

create policy "owner can insert contact"
  on lost_pets_contact for insert
  to authenticated
  with check (exists (select 1 from lost_pets lp where lp.id = lost_pet_id and lp.user_id = auth.uid()));

create policy "owner or admin can update contact"
  on lost_pets_contact for update
  to authenticated
  using (
    exists (select 1 from lost_pets lp where lp.id = lost_pet_id and lp.user_id = auth.uid())
    or exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

-- ============================================================
-- جدول ردود "لقيت الحيوان ده / عندي معلومة"
-- ============================================================
create table if not exists lost_pet_responses (
  id uuid primary key default gen_random_uuid(),
  lost_pet_id uuid not null references lost_pets(id) on delete cascade,
  responder_id uuid not null references auth.users(id),
  responder_name text not null,
  responder_whatsapp text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table lost_pet_responses enable row level security;

-- أي مستخدم مسجل دخول يقدر يبعت رد باسمه هو بس
create policy "users can send responses"
  on lost_pet_responses for insert
  to authenticated
  with check (auth.uid() = responder_id);

-- اللي بعت الرد، أو صاحب البلاغ الأصلي، أو الأدمن — همّ بس اللي يشوفوا الردود
create policy "responder poster or admin can read responses"
  on lost_pet_responses for select
  to authenticated
  using (
    responder_id = auth.uid()
    or exists (select 1 from lost_pets lp where lp.id = lost_pet_id and lp.user_id = auth.uid())
    or exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

-- ============================================================
-- إشعارات خاصة (لشخص واحد بس) — امتداد لجدول notifications الموجود.
-- notifications.user_id فاضي (null) = إشعار عام لكل الناس (زي قبل كده).
-- notifications.user_id متعبي = إشعار خاص بشخص واحد بس.
-- ============================================================
alter table notifications add column if not exists user_id uuid references auth.users(id);

drop policy if exists "authenticated can read notifications" on notifications;
create policy "users read own or public notifications"
  on notifications for select
  to authenticated
  using (user_id is null or user_id = auth.uid());

-- لما حد يبعت رد على بلاغ، يتبعت إشعار خاص تلقائيًا لصاحب البلاغ بس
create or replace function notify_poster_on_response()
returns trigger as $$
declare
  poster_id uuid;
  pet_title text;
begin
  select user_id, title into poster_id, pet_title from lost_pets where id = new.lost_pet_id;

  insert into notifications (user_id, title, body)
  values (
    poster_id,
    'New response on: ' || pet_title,
    new.responder_name || ' says: ' || new.message || ' — WhatsApp: ' || new.responder_whatsapp
  );

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_lost_pet_response on lost_pet_responses;
create trigger on_lost_pet_response
  after insert on lost_pet_responses
  for each row execute function notify_poster_on_response();

-- ============================================================
-- صلاحيات رفع وحذف صور "حيوانات مفقودة" في التخزين — أي مستخدم مسجل دخول
-- يقدر يرفع صورة تحت مجلد lost-pets/ بس (مش أي مكان تاني في التخزين)
-- ============================================================
create policy "users can upload lost pet photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media' and name like 'lost-pets/%');

create policy "users can delete own lost pet photos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media' and name like 'lost-pets/%' and owner = auth.uid());
