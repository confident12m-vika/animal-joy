// Sample articles. Replace `image` with real photography before launch —
// picsum.photos placeholders are used here only so the layout has something to show.
// `tag` is derived from `category` via the i18n categories.* keys, so it's
// automatically translated — no need to repeat it per language here.
const articles = [
  {
    id: 'a-001',
    category: 'happy-stories',
    image: 'https://picsum.photos/seed/animaljoy-rescue/900/650',
    readMinutes: 7,
    reactions: 128,
    translations: {
      en: {
        title: '10 Rescue Stories That End in Pure Happiness',
        excerpt: 'Sometimes one kind person can change an entire life. These rescue stories are proof that hope always finds a way.',
      },
      ar: {
        title: '10 قصص إنقاذ نهايتها سعادة خالصة',
        excerpt: 'أحيانًا شخص واحد طيب يقدر يغيّر حياة كاملة. هذه القصص دليل إن الأمل بيلاقي طريقه دايمًا.',
      },
      ru: {
        title: '10 историй спасения с абсолютно счастливым концом',
        excerpt: 'Иногда один добрый человек может изменить целую жизнь. Эти истории — доказательство того, что надежда всегда находит путь.',
      },
      es: {
        title: '10 historias de rescate que terminan en pura felicidad',
        excerpt: 'A veces una persona buena puede cambiar toda una vida. Estas historias demuestran que la esperanza siempre encuentra un camino.',
      },
    },
  },
  {
    id: 'a-002',
    category: 'happy-stories',
    image: 'https://picsum.photos/seed/animaljoy-biscuit/900/650',
    readMinutes: 5,
    reactions: 96,
    translations: {
      en: {
        title: 'The Shelter Dog Nobody Wanted \u2014 Until Somebody Did',
        excerpt: 'Three years on the adoption list. Then one Tuesday afternoon changed everything for Biscuit.',
      },
      ar: {
        title: 'الكلب اللي محدش كان عايزه... لحد ما حد عايزه',
        excerpt: 'ثلاث سنين على قائمة التبني. وبعدين يوم واحد غيّر كل حاجة في حياة "بيسكت".',
      },
      ru: {
        title: 'Пёс из приюта, которого никто не хотел \u2014 пока не появился тот самый человек',
        excerpt: 'Три года в списке на усыновление. А потом один вторник изменил всё для Бисквита.',
      },
      es: {
        title: 'El perro de refugio que nadie quería... hasta que alguien lo quiso',
        excerpt: 'Tres años en la lista de adopción. Luego, una tarde de martes lo cambió todo para Biscuit.',
      },
    },
  },
  {
    id: 'a-003',
    category: 'pet-life',
    image: 'https://picsum.photos/seed/animaljoy-dog-tips/900/650',
    readMinutes: 6,
    reactions: 95,
    translations: {
      en: {
        title: '7 Simple Ways to Make Your Dog\u2019s Life Happier',
        excerpt: 'A happy dog isn\u2019t about expensive toys. It\u2019s about attention, movement, and a little daily magic.',
      },
      ar: {
        title: '7 طرق بسيطة تخلي حياة كلبك أسعد',
        excerpt: 'الكلب السعيد مش محتاج ألعاب غالية. محتاج اهتمام وحركة وشوية سحر يومي.',
      },
      ru: {
        title: '7 простых способов сделать жизнь вашей собаки счастливее',
        excerpt: 'Счастливая собака — это не про дорогие игрушки. Это про внимание, движение и немного ежедневной магии.',
      },
      es: {
        title: '7 formas sencillas de hacer más feliz a tu perro',
        excerpt: 'Un perro feliz no depende de juguetes caros. Depende de atención, movimiento y un poco de magia diaria.',
      },
    },
  },
  {
    id: 'a-004',
    category: 'pet-life',
    image: 'https://picsum.photos/seed/animaljoy-kitten-vet/900/650',
    readMinutes: 4,
    reactions: 61,
    translations: {
      en: {
        title: 'Kitten\u2019s First Vet Visit: A Calm-Down Guide for Nervous Owners',
        excerpt: 'Carriers, treats, and timing \u2014 the small choices that make the first checkup easy on everyone.',
      },
      ar: {
        title: 'أول زيارة للقطة عند البيطري: دليل للتهدئة لأصحاب القطط القلقانين',
        excerpt: 'شنطة النقل، المكافآت، والتوقيت — تفاصيل صغيرة بتخلي أول كشف سهل على الجميع.',
      },
      ru: {
        title: 'Первый визит котёнка к ветеринару: гид для нервных хозяев',
        excerpt: 'Переноска, лакомства и время визита — мелочи, которые делают первый осмотр лёгким для всех.',
      },
      es: {
        title: 'La primera visita del gatito al veterinario: guía para dueños nerviosos',
        excerpt: 'Transportadora, premios y el momento adecuado: pequeñas decisiones que facilitan la primera consulta para todos.',
      },
    },
  },
  {
    id: 'a-005',
    category: 'amazing-animals',
    image: 'https://picsum.photos/seed/animaljoy-facts/900/650',
    readMinutes: 6,
    reactions: 87,
    translations: {
      en: {
        title: '10 Astonishing Animal Facts You Probably Never Knew',
        excerpt: 'The animal kingdom is full of surprises. These facts will make you look at your pet a little differently.',
      },
      ar: {
        title: '10 حقائق مذهلة عن الحيوانات مكنتش تعرفها',
        excerpt: 'عالم الحيوان مليان مفاجآت. هذه الحقائق هتخليك تبص لأليفك بطريقة مختلفة شوية.',
      },
      ru: {
        title: '10 удивительных фактов о животных, о которых вы, вероятно, не знали',
        excerpt: 'Мир животных полон сюрпризов. Эти факты заставят вас взглянуть на своего питомца по-новому.',
      },
      es: {
        title: '10 datos asombrosos sobre animales que probablemente no conocías',
        excerpt: 'El reino animal está lleno de sorpresas. Estos datos harán que veas a tu mascota de otra manera.',
      },
    },
  },
  {
    id: 'a-006',
    category: 'amazing-animals',
    image: 'https://picsum.photos/seed/animaljoy-elephant/900/650',
    readMinutes: 5,
    reactions: 73,
    translations: {
      en: {
        title: 'Why Elephants Never Forget a Friendly Face',
        excerpt: 'Elephant memory is legendary for a reason. Here\u2019s the science behind the myth.',
      },
      ar: {
        title: 'ليه الفيل مينساش وش صاحبه',
        excerpt: 'ذاكرة الفيل أسطورية مش من فراغ. إليك العلم اللي وراء الأسطورة.',
      },
      ru: {
        title: 'Почему слоны никогда не забывают дружелюбное лицо',
        excerpt: 'Легендарная память слонов не миф. Вот наука, которая стоит за этой легендой.',
      },
      es: {
        title: 'Por qué los elefantes nunca olvidan una cara amistosa',
        excerpt: 'La memoria de los elefantes es legendaria por una razón. Aquí está la ciencia detrás del mito.',
      },
    },
  },
  {
    id: 'a-007',
    category: 'laugh-smile',
    image: 'https://picsum.photos/seed/animaljoy-chaos-cats/900/650',
    readMinutes: 3,
    reactions: 142,
    translations: {
      en: {
        title: '20 Photos of Cats Caught Mid-Chaos',
        excerpt: 'Sofas were scratched. Plants were knocked over. None of it was regretted.',
      },
      ar: {
        title: '20 صورة لقطط اتمسكت وهي بتعمل فوضى',
        excerpt: 'كنبات اتخربشت، وأصص اتقلبت، وولا حاجة اتندموا عليها.',
      },
      ru: {
        title: '20 фото котов, застигнутых в разгар хаоса',
        excerpt: 'Диваны исцарапаны. Растения опрокинуты. Никто ни о чём не жалеет.',
      },
      es: {
        title: '20 fotos de gatos atrapados en pleno caos',
        excerpt: 'Sofás rasguñados. Plantas volcadas. Nada de eso se arrepintió.',
      },
    },
  },
  {
    id: 'a-008',
    category: 'laugh-smile',
    image: 'https://picsum.photos/seed/animaljoy-notme/900/650',
    readMinutes: 3,
    reactions: 118,
    translations: {
      en: {
        title: 'Dogs Who Absolutely Did Not Do It',
        excerpt: 'The evidence says otherwise, but the face says innocent.',
      },
      ar: {
        title: 'كلاب أكيد ملهاش دعوة بالموضوع',
        excerpt: 'الأدلة بتقول عكس كده، لكن شكل وشهم بريء تمامًا.',
      },
      ru: {
        title: 'Собаки, которые точно этого не делали',
        excerpt: 'Улики говорят обратное, но морда говорит "я невиновен".',
      },
      es: {
        title: 'Perros que definitivamente no lo hicieron',
        excerpt: 'La evidencia dice lo contrario, pero la cara dice inocente.',
      },
    },
  },
  {
    id: 'a-009',
    category: 'best-finds',
    image: 'https://picsum.photos/seed/animaljoy-dogtoys/900/650',
    readMinutes: 5,
    reactions: 54,
    translations: {
      en: {
        title: 'The 8 Best Toys for Bored, Zoomy Dogs',
        excerpt: 'Tested picks for dogs who need their energy pointed somewhere productive.',
      },
      ar: {
        title: '8 من أفضل الألعاب للكلاب النشيطة اللي بتزهق بسرعة',
        excerpt: 'اختيارات مجربة للكلاب اللي محتاجة تصرف طاقتها في حاجة مفيدة.',
      },
      ru: {
        title: '8 лучших игрушек для скучающих активных собак',
        excerpt: 'Проверенная подборка для собак, которым нужно направить энергию в полезное русло.',
      },
      es: {
        title: 'Los 8 mejores juguetes para perros aburridos y llenos de energía',
        excerpt: 'Selección probada para perros que necesitan canalizar su energía de forma productiva.',
      },
    },
  },
  {
    id: 'a-010',
    category: 'best-finds',
    image: 'https://picsum.photos/seed/animaljoy-catbeds/900/650',
    readMinutes: 4,
    reactions: 48,
    translations: {
      en: {
        title: 'Cozy Cat Beds Your Cat Might Actually Use',
        excerpt: 'A realistic roundup, because we all know the box usually wins anyway.',
      },
      ar: {
        title: 'أسرّة مريحة للقطط ممكن قطتك فعلًا تستخدمها',
        excerpt: 'مراجعة واقعية، لأننا كلنا عارفين إن الكرتونة غالبًا هي اللي بتكسب في الآخر.',
      },
      ru: {
        title: 'Уютные лежанки для кошек, которыми ваша кошка действительно может пользоваться',
        excerpt: 'Реалистичная подборка, ведь мы все знаем, что обычная коробка обычно всё равно побеждает.',
      },
      es: {
        title: 'Camas acogedoras para gatos que tu gato podría realmente usar',
        excerpt: 'Una selección realista, porque todos sabemos que la caja de cartón suele ganar de todas formas.',
      },
    },
  },
  {
    id: 'a-011',
    category: 'urban-soul-vibe',
    image: 'https://picsum.photos/seed/animaljoy-usv/900/650',
    readMinutes: 4,
    reactions: 65,
    translations: {
      en: {
        title: 'Meet Urban Soul Vibe: Our Mission Behind Animal Joy',
        excerpt: 'Why we started this project, who we help, and how every reader plays a part.',
      },
      ar: {
        title: 'تعرف على Urban Soul Vibe: رسالتنا خلف Animal Joy',
        excerpt: 'ليه بدأنا هذا المشروع، ومين بنساعد، وإزاي كل قارئ بيبقى له دور.',
      },
      ru: {
        title: 'Знакомьтесь с Urban Soul Vibe: наша миссия за Animal Joy',
        excerpt: 'Почему мы начали этот проект, кому помогаем и какую роль играет каждый читатель.',
      },
      es: {
        title: 'Conoce Urban Soul Vibe: nuestra misión detrás de Animal Joy',
        excerpt: 'Por qué empezamos este proyecto, a quién ayudamos y cómo cada lector forma parte de esto.',
      },
    },
  },
  {
    id: 'a-012',
    category: 'urban-soul-vibe',
    image: 'https://picsum.photos/seed/animaljoy-support/900/650',
    readMinutes: 5,
    reactions: 40,
    translations: {
      en: {
        title: 'How to Support Local Rescues Without Adopting Right Now',
        excerpt: 'Fostering, donating, sharing, volunteering \u2014 small acts that add up to real impact.',
      },
      ar: {
        title: 'إزاي تدعم جمعيات الإنقاذ المحلية من غير ما تتبنى دلوقتي',
        excerpt: 'التبني المؤقت، التبرع، المشاركة، التطوع — أفعال بسيطة بتجمع في تأثير حقيقي.',
      },
      ru: {
        title: 'Как поддержать местные приюты, не усыновляя питомца прямо сейчас',
        excerpt: 'Временная передержка, пожертвования, репосты, волонтёрство — маленькие шаги, которые складываются в реальный результат.',
      },
      es: {
        title: 'Cómo apoyar a los refugios locales sin adoptar en este momento',
        excerpt: 'Acogida temporal, donaciones, difusión, voluntariado: pequeñas acciones que suman un impacto real.',
      },
    },
  },
]

export default articles
