-- ============================================================
-- Animal Joy — Supabase schema
-- شغّل هذا الملف كامل في: Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

-- جدول المقالات (Articles)
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  category text not null,               -- happy-stories | laugh-smile | amazing-animals | pet-life | gallery | best-finds | urban-soul-vibe
  image text,                           -- رابط الصورة من Storage
  read_minutes int not null default 5,
  reactions int not null default 0,
  published boolean not null default true,
  translations jsonb not null default '{}'::jsonb,
  -- شكل translations: { "en": {"title": "...", "excerpt": "..."}, "ar": {...}, "ru": {...}, "es": {...} }
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- جدول النكت (Jokes)
create table if not exists jokes (
  id uuid primary key default gen_random_uuid(),
  published boolean not null default true,
  translations jsonb not null default '{}'::jsonb,
  -- شكل translations: { "en": {"setup": "...", "punchline": "..."}, "ar": {...}, "ru": {...}, "es": {...} }
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- تفعيل حماية الصفوف (Row Level Security)
alter table articles enable row level security;
alter table jokes enable row level security;

-- أي زائر عادي (anon) يقدر يقرأ بس المنشور (published = true)
create policy "public can read published articles"
  on articles for select
  to anon
  using (published = true);

create policy "public can read published jokes"
  on jokes for select
  to anon
  using (published = true);

-- بس المستخدم المسجل دخول (الأدمن) يقدر يضيف/يعدّل/يحذف/يشوف كل حاجة (منشورة أو لأ)
create policy "authenticated full access articles"
  on articles for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated full access jokes"
  on jokes for all
  to authenticated
  using (true)
  with check (true);

-- تحديث updated_at تلقائيًا مع كل تعديل
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger articles_updated_at
  before update on articles
  for each row execute function set_updated_at();

create trigger jokes_updated_at
  before update on jokes
  for each row execute function set_updated_at();
