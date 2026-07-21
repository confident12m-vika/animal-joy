-- ============================================================
-- Animal Joy — Supabase Storage setup
-- شغّل هذا الملف بعد schema.sql، في نفس الـ SQL Editor
-- ============================================================

-- إنشاء bucket عام لتخزين صور المقالات (اسمه "media")
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- أي حد يقدر يشوف الصور (لأنها عامة على الموقع)
create policy "public can view media"
  on storage.objects for select
  to anon
  using (bucket_id = 'media');

-- بس المستخدم المسجل دخول (الأدمن) يقدر يرفع صور جديدة
create policy "authenticated can upload media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

-- بس المستخدم المسجل دخول يقدر يعدّل الصور
create policy "authenticated can update media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media');

-- بس المستخدم المسجل دخول يقدر يحذف الصور
create policy "authenticated can delete media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');
