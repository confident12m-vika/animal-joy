# Animal Joy — Urban Soul Vibe

موقع محتوى (Content / Media Website) مبني بـ React + Vite حسب طلب العميلة يانا كوتيك: بوابة
معلوماتية متعددة الصفحات عن الحيوانات، بأسلوب مجلة، مع لوحة تحكم كاملة بدون الحاجة لبرمجي.

---

## 🚀 التشغيل السريع (بدون لوحة تحكم)

```bash
npm install
npm run dev       # http://localhost:5173
```

الموقع هيشتغل فورًا بمحتوى تجريبي جاهز (من `src/data/`) حتى لو معملتش خطوات Supabase تحت —
لكن لغاية ما تعمل الخطوات دي، زر "لوحة التحكم" مش هيشتغل لأنه محتاج قاعدة بيانات حقيقية.

---

## 🔧 المرحلة 2 — تفعيل لوحة التحكم (خطوة بخطوة)

اللوحة جاهزة بالكامل في الكود، وناقصها بس توصيلها بحساب Supabase مجاني بتاعك. اتبع الخطوات
دي بالترتيب:

### 1. اعمل مشروع Supabase

- روح على [supabase.com](https://supabase.com) واعمل حساب (لو معملتيش قبل كده).
- اضغط **New Project**، اختار اسم زي `animal-joy`، وحط باسورد لقاعدة البيانات (احفظه).
- استنى دقيقة لحد ما المشروع يخلص إعداد.

### 2. شغّل ملفات SQL

- من القائمة الجانبية في Supabase، افتح **SQL Editor** → **New query**.
- افتح ملف `supabase/schema.sql` من المشروع، انسخ كل محتواه، الصقه، واضغط **Run**.
- كرر نفس الخطوة لملف `supabase/storage.sql` (بعد ما schema.sql يخلص بنجاح).
- كرر نفس الخطوة لملف `supabase/content-tables.sql` (بعد ما الاتنين اللي فوق يخلصوا) — ده
  بيضيف جداول صفحة Home وصفحة Urban Soul Vibe ومعرض الصور، وحقل الرابط لقسم Best Finds.
- كرر نفس الخطوة لملف `supabase/users-notifications.sql` (بعد كل اللي فوق) — حسابات
  المستخدمين وصلاحيات الأدمن والإشعارات.
- كرر نفس الخطوة لملف `supabase/lost-and-found.sql` (آخر ملف) — قسم "حيوانات مفقودة" الجديد.

هذا هينشئلك جدولين (`articles`, `jokes`) و Storage bucket اسمه `media` لتخزين الصور، مع كل
صلاحيات الحماية (RLS) الصحيحة.

### 3. اعمل حساب أدمن (تسجيل الدخول)

- من القائمة الجانبية: **Authentication** → **Users** → **Add user** → **Create new user**.
- حط الإيميل والباسورد اللي هتستخدمهم إنتي (يانا) لتسجيل الدخول للوحة التحكم.
- تأكد إن **Auto Confirm User** مفعّل عشان تقدري تسجلي دخول على طول.

### 4. وصّلي المشروع بالمفاتيح

- من **Settings** (⚙️) → **API**، انسخي:
  - **Project URL**
  - **anon public key**
- في مجلد المشروع، اعملي نسخة من ملف `.env.example` باسم `.env`:
  ```bash
  cp .env.example .env
  ```
- افتحي `.env` وحطي القيمتين مكان الأمثلة.

### 5. شغّلي المشروع من جديد

```bash
npm run dev
```

دلوقتي روحي على `http://localhost:5173/admin/login` وسجّلي دخول بالإيميل والباسورد اللي
عملتيهم في خطوة 3. 🎉

---

## 🖥️ استخدام لوحة التحكم

بعد تسجيل الدخول هتلاقي 5 أقسام في القائمة العلوية:

- **Home**: تعديل صورة وعنوان ونص الصفحة الرئيسية بس (شكل الصفحة وباقي الأقسام ثابتة زي ما هي).
- **Content**: كل الأقسام (Happy Stories, Laugh & Smile, Amazing Animals, Pet Life, Best
  Finds, Urban Soul Vibe) مقسّمة قسم بمفردة، وكل قسم فيه زرار **+ Add New** خاص بيه. جنب كل
  عنصر: Publish/Unpublish, Edit, Delete.
  - قسم **Best Finds** بس فيه حقل إضافي "Shop link" — رابط المنتج اللي هيظهر كزرار "Shop now"
    على البطاقة في الموقع.
- **Jokes**: زرار **+ Add New** لإضافة نكتة (سؤال + رد)، وEdit/Delete لكل نكتة. النكت دي هي
  نفسها اللي بتظهر في صفحة Moment Joke وبيسحب منها زر Surprise Me عشوائيًا.
- **Gallery**: ارفعي أي عدد من الصور (تقدري تختاري أكتر من صورة مرة واحدة)، أو احذفي أي صورة
  بزرار الـ X اللي فوقها.
- **Urban Soul Vibe**: تعديل صورة ونص القصة في نص الصفحة (منفصل عن بطاقات المقالات اللي في
  آخر الصفحة، واللي بتتحكمي فيها من Content).

**ملاحظة على اللغات:** في المرحلة دي، لوحة التحكم بتدير المحتوى **الإنجليزي بس**. لو حد فتح
الموقع بلغة تانية (عربي/روسي/إسباني)، هيشوف بيانات المحتوى (العناوين والنصوص اللي بتضيفيها)
بالإنجليزي لحد ما نضيف لوحة تحكم متعددة اللغات في مرحلة لاحقة — أما قوائم الموقع والأزرار
الثابتة فهي مترجمة بالفعل للأربع لغات.

زرار **Published** لازم يكون مفعّل عشان أي عنصر يظهر للزوار على الموقع فورًا. أي تعديل أو نشر
بيظهر على الموقع الحقيقي على طول من غير ما تحتاجي build جديد أو تتواصلي مع مبرمج.

---

## 🔐 المرحلة 3 — حسابات المستخدمين والإشعارات الجماعية (خطوة بخطوة)

### 1. شغّلي ملف SQL الجديد
زي المعتاد: **SQL Editor** → **New query** → افتحي `supabase/users-notifications.sql` من
المشروع، انسخي كل المحتوى، الصقيه.

⚠️ **قبل ما تضغطي Run**، دوّري داخل الملف على السطر ده:
```sql
update profiles set is_admin = true where email = 'YOUR-ADMIN-EMAIL@example.com';
```
واستبدلي `YOUR-ADMIN-EMAIL@example.com` بالإيميل اللي بتسجلي بيه دخول `/admin/login` بالظبط.
بعدين اضغطي **Run**.

### 2. فعّلي تسجيل الدخول بجوجل (اختياري، بس لو عايزاه)
- روحي على [console.cloud.google.com](https://console.cloud.google.com) واعملي مشروع جديد
  (أو استخدمي واحد موجود).
- من القائمة: **APIs & Services** → **Credentials** → **Create Credentials** →
  **OAuth client ID**.
- نوع التطبيق: **Web application**.
- في **Authorized redirect URIs** ضيفي الرابط ده (هتلاقيه في Supabase: **Authentication** →
  **Providers** → **Google** → فيه رابط جاهز تنسخيه):
  ```
  https://your-project-ref.supabase.co/auth/v1/callback
  ```
- خدي الـ **Client ID** والـ **Client Secret** اللي هيديهولك جوجل.
- ارجعي لـ Supabase: **Authentication** → **Providers** → **Google** → فعّليه والصقي
  القيمتين → **Save**.

### 3. فعّلي الإيميل الجماعي (Resend + Edge Function)
- اعملي حساب مجاني على [resend.com](https://resend.com) (100 إيميل/يوم مجانًا، كافيين جدًا
  في البداية).
- من **API Keys** جوه Resend، اعملي مفتاح جديد وانسخيه.
- في Supabase: **Edge Functions** (من القائمة الجانبية) → **Deploy a new function** →
  **Via Editor**.
- سمّي الفانكشن بالظبط: `send-notification`
- امسحي الكود التجريبي، وافتحي ملف `supabase/functions/send-notification/index.ts` من
  المشروع، انسخي كل المحتوى، والصقيه بدل الكود التجريبي.
- اضغطي **Deploy**.
- بعد النشر، روحي لإعدادات الفانكشن (Secrets) وضيفي:
  ```
  RESEND_API_KEY = المفتاح اللي نسختيه من Resend
  SENDER_EMAIL   = onboarding@resend.dev
  ```
  (`onboarding@resend.dev` ده إيميل تجريبي جاهز من Resend يشتغل فورًا من غير أي إعداد إضافي؛
  لو عندك دومين خاص بيك ومربوط بـ Resend، استخدمي إيميل منه بدل كده لاحقًا).

بعد الخطوات التلاتة دي، زرار "Send to everyone" في صفحة Notifications هيبعت إيميل حقيقي
لكل المسجلين + يظهر في جرس الإشعارات على طول.

---

## 🐾 قسم "حيوانات مفقودة" (Lost & Found)

قسم جديد في الموقع (`/lost-and-found`) للمستخدمين المسجلين بس، فيه 3 أنواع بلاغات:
- 🚨 حيوان مفقود
- ❓ يُحتمل أنه مفقود
- 🆘 يحتاج مساعدة فورية

كل بلاغ فيه: صورة، عنوان، نوع الحيوان (قطة/كلب/أخرى) للفلترة، تاريخ، رابط خرائط جوجل، ووصف
تفصيلي. **رقم واتساب صاحب البلاغ سري تمامًا** — الأدمن وصاحب البلاغ بس اللي يشوفوه (محفوظ في
جدول منفصل بحماية خاصة، مش ظاهر في أي مكان عام). لما حد يدوس "لقيت الحيوان ده"، بيبعتله رسالة
عن طريق فورم، وصاحب البلاغ بيوصله إشعار خاص (جرس فقط، مش إيميل حاليًا) فيه رسالة اللي لقاه
ورقمه، وهو اللي يتواصل معاه.

صاحب البلاغ يقدر من صفحة البلاغ نفسها إنه يعلّمه "تم العثور عليه" أو يحذفه. البلاغات بتظهر
فورًا من غير مراجعة، والأدمن عنده صفحة **Lost & Found** في اللوحة لمراجعة كل البلاغات
وأرقام التواصل لو احتاج الأمر يتدخل (بلاغ مسيء مثلاً).

⚠️ **ملاحظة:** نصوص واجهة القسم ده (العناوين، الأزرار) بالإنجليزي بس حاليًا، زي باقي أجزاء
المرحلة الأولى — الترجمة ممكن تتضاف لاحقًا.

---

## ✉️ المرحلة 4 — رسائل المستخدمين، كود التحقق، والتفاعلات (خطوة بخطوة)

### 1. شغّلي ملف SQL الجديد
زي المعتاد: **SQL Editor** → **New query** → افتحي `supabase/messaging-and-reactions.sql`،
انسخي كل المحتوى، الصقيه.

⚠️ **قبل ما تضغطي Run**، دوّري على السطرين دول جوه الملف وغيّريهم:
```sql
url := 'https://YOUR-PROJECT-REF.supabase.co/functions/v1/send-single-email',
```
غيّري `YOUR-PROJECT-REF` بمعرّف مشروعك الحقيقي في Supabase (هتلاقيه في رابط الداشبورد بتاعك).
```sql
'X-Internal-Secret', 'YOUR-INTERNAL-SECRET'
```
غيّري `YOUR-INTERNAL-SECRET` بكلمة سر طويلة تخترعيها إنتِ بنفسك (أي نص عشوائي طويل)،
واحتفظي بنفس القيمة عشان هتحتاجيها في خطوة الفانكشن تحت.

### 2. انشري فانكشن `send-single-email`
- **Edge Functions** → **Deploy a new function** → **Via Editor** → اسمها بالظبط:
  `send-single-email`.
- افتحي `supabase/functions/send-single-email/index.ts`، انسخي المحتوى، الصقيه، **Deploy**.
- من **Secrets** بتاعتها ضيفي:
  ```
  RESEND_API_KEY  = نفس مفتاح Resend اللي عندك
  SENDER_EMAIL    = hello@animaljoystories.com (أو أي إيميل من دومينك)
  INTERNAL_SECRET = نفس القيمة اللي اخترعتيها فوق بالظبط
  ```

### 3. انشري فانكشن `inbound-email` (لو عايزة صندوق بريد حقيقي)
- نفس الخطوات، اسمها بالظبط: `inbound-email`.
- افتحي `supabase/functions/inbound-email/index.ts`، انسخي المحتوى، الصقيه، **Deploy**.
- من **Secrets** ضيفي: `RESEND_API_KEY` (نفس المفتاح).
- في Resend: **Webhooks** → **Add Webhook** → الرابط:
  `https://YOUR-PROJECT-REF.supabase.co/functions/v1/inbound-email`، والحدث: `email.received`.
  انسخي الـ Signing secret اللي هيديهولك (يبدأ بـ `whsec_`) وضيفيه كـ Secret تاني في
  فانكشن `inbound-email`: `RESEND_WEBHOOK_SECRET`.
- من Resend: دومينك → **Receiving** → حددي العنوان اللي هيستقبل الرسائل
  (`hello@animaljoystories.com`).

### 4. فعّلي كود التحقق بدل رابط التأكيد
- Supabase: **Authentication** → **Email Templates** → **Confirm signup**.
- في محتوى الإيميل، تأكدي إن فيه `{{ .Token }}` ظاهر (مش بس رابط) — ده اللي بيولّد الكود
  المكوّن من 6 أرقام اللي بيتبعت للمستخدم.

بعد الخطوات الأربعة دي: الإيميل الجماعي، الرسائل الواردة، كود التحقق، والتفاعلات كلهم
هيشتغلوا بالكامل.

---

## المرحلة 1 — تحسينات التصميم (تمت ✅)

- الشعار الحقيقي لـ Urban Soul Vibe (خلفية شفافة فعلية) — `src/assets/logo-icon.png`، وبقى
  أكبر حجمًا في أعلى يسار الهيدر.
- مبدّل اللغة (🌐) اتنقل لأعلى يمين الصفحة في صف منفصل، والقائمة الرئيسية في صف تاني تحته.
- اسم الموقع بقى أكبر وبلون أخضر زاهي (`--brand-green`) بدل الأسود.
- تحسينات على الـ spacing والـ typography.
- الصور المؤقتة (picsum.photos) اتسابت عمدًا — يانا هتستبدلها بنفسها من لوحة التحكم دلوقتي.

## دعم 4 لغات

إنجليزي، عربي، روسي، إسباني — زر التبديل في الهيدر (🌐)، مع دعم كامل لاتجاه RTL للعربي.
نصوص الواجهة في `src/i18n/index.js`، ومحتوى المقالات/النكت بقى يتغذى من قاعدة البيانات
(أو من `src/data/` كنسخة احتياطية قبل ما توصلي Supabase).

## زر Surprise Me ✨

يظهر في الرئيسية وأسفل كل صفحة، بيسحب عشوائيًا من المقالات والنكت المنشورة فعليًا في قاعدة
البيانات، بلغة الموقع الحالية.

---

## الخطوات الجاية (Next steps)

1. ~~لوحة التحكم~~ ✅ تمت.
2. صفحة تفاصيل المقال (Article detail page) — حاليًا زرار "Read more" مالوش رابط فعلي لصفحة
   منفصلة لكل مقال.
3. نظام تعليقات ومستخدمين (Users & Comments) — مرحلة مستقبلية حسب طلب يانا.
4. مرحلة التسييل (Monetization): أفلييت، إعلانات، ميرتشاندايز.
5. SEO: meta tags لكل صفحة، sitemap.xml، robots.txt، Open Graph tags.
6. رفع الموقع أونلاين (Vercel / Netlify) بدل التشغيل المحلي فقط.

## هيكل المشروع (Project structure)

```
src/
  components/   Header (فيه مبدّل اللغة + جرس الإشعارات), Footer, Logo, ArticleCard, SurpriseMe
  pages/        Home + 8 صفحات أقسام + CategoryPage + ArticlePage + Account (تسجيل الدخول) + NotFound
  admin/        لوحة التحكم كاملة: Login, Dashboards, Article/Joke forms, Users, Notifications
  context/      AuthContext.jsx — جلسة الدخول المشتركة (زوار + أدمن)
  hooks/        useArticles.js, useJokes.js, useArticle.js, useSiteBlock.js, useGalleryPhotos.js
  data/         jokes.js, articles.js — بيانات تجريبية احتياطية (تُستخدم فقط لو Supabase
                مش متوصل بعد)
  i18n/         index.js — كل نصوص واجهة الموقع لكل لغة
  lib/          supabaseClient.js, storageUtils.js (حذف الصور من التخزين)
  assets/       الشعار الحقيقي
supabase/
  schema.sql              جداول articles و jokes + صلاحيات الحماية
  storage.sql             إعداد تخزين الصور
  content-tables.sql      صفحة Home، صفحة Urban Soul Vibe، معرض الصور، رابط Best Finds
  users-notifications.sql حسابات المستخدمين، صلاحيات الأدمن، جدول الإشعارات
  functions/send-notification/index.ts   إرسال الإيميل الجماعي (يُنسخ للوحة Supabase)
```
