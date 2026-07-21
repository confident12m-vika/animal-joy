-- ============================================================
-- Animal Joy — Content management additions
-- شغّلي هذا الملف بعد schema.sql و storage.sql، في نفس الـ SQL Editor
-- ============================================================

-- جدول لصفحات ذات هيكل ثابت (Home و Urban Soul Vibe): صورة رئيسية + عنوان + نص
-- كل صف بمفتاح ثابت ('home' أو 'urban-soul-vibe') يمثل محتوى صفحة كاملة
create table if not exists site_blocks (
  key text primary key,             -- 'home' | 'urban-soul-vibe'
  image text,
  title text,
  body text,                        -- فقرة أو أكتر مفصولين بسطر فاضي
  updated_at timestamptz not null default now()
);

alter table site_blocks enable row level security;

create policy "public can read site blocks"
  on site_blocks for select
  to anon
  using (true);

create policy "authenticated full access site blocks"
  on site_blocks for all
  to authenticated
  using (true)
  with check (true);

create trigger site_blocks_updated_at
  before update on site_blocks
  for each row execute function set_updated_at();

-- جدول صور المعرض (Gallery) — عدد غير محدود من الصور
create table if not exists gallery_photos (
  id uuid primary key default gen_random_uuid(),
  image text not null,
  created_at timestamptz not null default now()
);

alter table gallery_photos enable row level security;

create policy "public can read gallery photos"
  on gallery_photos for select
  to anon
  using (true);

create policy "authenticated full access gallery photos"
  on gallery_photos for all
  to authenticated
  using (true)
  with check (true);

-- رابط اختياري للمقالات (يُستخدم في قسم Best Finds كرابط "تسوق الآن")
alter table articles add column if not exists link text;
