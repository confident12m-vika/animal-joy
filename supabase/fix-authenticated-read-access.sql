-- ============================================================
-- Animal Joy — إصلاح عاجل: المستخدم العادي المسجل دخول مش شايف المحتوى
-- شغّلي هذا الملف بعد كل الملفات اللي قبله، في نفس الـ SQL Editor
--
-- السبب: صلاحيات القراءة الأصلية كانت مسموحة لـ "anon" بس (الزائر مش
-- المسجل دخول). لما ضفنا حسابات المستخدمين بعد كده، أي حد يعمل حساب
-- عادي (مش أدمن) بقى مالوش أي صلاحية قراءة على المحتوى خالص.
-- الملف ده بيضيف صلاحية قراءة للمستخدمين المسجلين دخول (authenticated)
-- كمان، بجانب الزوار (anon)، من غير ما يمس صلاحيات الأدمن.
-- ============================================================

drop policy if exists "public can read published articles" on articles;
create policy "public can read published articles"
  on articles for select
  to anon, authenticated
  using (published = true);

drop policy if exists "public can read published jokes" on jokes;
create policy "public can read published jokes"
  on jokes for select
  to anon, authenticated
  using (published = true);

drop policy if exists "public can read site blocks" on site_blocks;
create policy "public can read site blocks"
  on site_blocks for select
  to anon, authenticated
  using (true);

drop policy if exists "public can read gallery photos" on gallery_photos;
create policy "public can read gallery photos"
  on gallery_photos for select
  to anon, authenticated
  using (true);

-- نفس المشكلة ممكن تكون موجودة في صلاحية عرض الصور في التخزين
drop policy if exists "public can view media" on storage.objects;
create policy "public can view media"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');
