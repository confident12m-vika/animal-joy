-- ============================================================
-- Animal Joy — User accounts, notifications, and admin security fix
-- شغّلي هذا الملف بعد كل الملفات اللي قبله، في نفس الـ SQL Editor
--
-- مهم جدًا: من دلوقتي أي حد يعمل حساب زائر عادي على الموقع (تسجيل دخول
-- بالإيميل أو جوجل) هيبقى "authenticated" برضو — عشان كده الملف ده بيصلح
-- كل صلاحيات الحماية (RLS) القديمة اللي كانت بتدي أي مستخدم مسجل دخول صلاحية
-- التعديل الكاملة على المحتوى. من دلوقتي الصلاحيات دي هتتحقق من عمود
-- is_admin بدل ما تتحقق بس إن الشخص مسجل دخول.
-- ============================================================

-- جدول ملفات المستخدمين (يتزامن تلقائيًا مع auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  is_admin boolean not null default false,
  last_seen_notification_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

-- كل حد يقدر يشوف بيانات البروفايلات الأساسية (مش فيها حاجة حساسة)
create policy "public can read profiles"
  on profiles for select
  to authenticated
  using (true);

-- كل مستخدم يقدر يعدّل بروفايله هو بس (مثلاً وقت ما يفتح جرس الإشعارات)
create policy "users can update own profile"
  on profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- إنشاء بروفايل تلقائيًا لأي حساب جديد (تسجيل عادي أو جوجل)
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- إنشاء بروفايل لأي حساب Admin اتعمل قبل كده (يدويًا من Authentication → Users)،
-- لأن الـ trigger اللي فوق بيشتغل بس على الحسابات الجديدة من دلوقتي.
-- ============================================================
insert into public.profiles (id, email, display_name)
select id, email, email
from auth.users
on conflict (id) do nothing;

-- ⚠️ غيّري الإيميل ده لإيميل الأدمن بتاعك (اللي بتسجلي بيه دخول /admin/login)
-- ده اللي بيديكي صلاحيات الأدمن الكاملة. شغّلي السطر ده بعد ما تغيّري الإيميل:
update profiles set is_admin = true where email = 'YOUR-ADMIN-EMAIL@example.com';

-- ============================================================
-- جدول الإشعارات الجماعية
-- ============================================================
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

alter table notifications enable row level security;

create policy "authenticated can read notifications"
  on notifications for select
  to authenticated
  using (true);

create policy "admin can insert notifications"
  on notifications for insert
  to authenticated
  with check (exists (select 1 from profiles where id = auth.uid() and is_admin = true));

create policy "admin can delete notifications"
  on notifications for delete
  to authenticated
  using (exists (select 1 from profiles where id = auth.uid() and is_admin = true));

-- ============================================================
-- تصحيح صلاحيات الجداول القديمة: التعديل بقى للأدمن بس، مش لأي مستخدم مسجل دخول
-- ============================================================
drop policy if exists "authenticated full access articles" on articles;
create policy "admin full access articles"
  on articles for all
  to authenticated
  using (exists (select 1 from profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from profiles where id = auth.uid() and is_admin = true));

drop policy if exists "authenticated full access jokes" on jokes;
create policy "admin full access jokes"
  on jokes for all
  to authenticated
  using (exists (select 1 from profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from profiles where id = auth.uid() and is_admin = true));

drop policy if exists "authenticated full access site blocks" on site_blocks;
create policy "admin full access site blocks"
  on site_blocks for all
  to authenticated
  using (exists (select 1 from profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from profiles where id = auth.uid() and is_admin = true));

drop policy if exists "authenticated full access gallery photos" on gallery_photos;
create policy "admin full access gallery photos"
  on gallery_photos for all
  to authenticated
  using (exists (select 1 from profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from profiles where id = auth.uid() and is_admin = true));

drop policy if exists "authenticated can upload media" on storage.objects;
create policy "admin can upload media"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'media'
    and exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

drop policy if exists "authenticated can update media" on storage.objects;
create policy "admin can update media"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'media'
    and exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

drop policy if exists "authenticated can delete media" on storage.objects;
create policy "admin can delete media"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'media'
    and exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );
