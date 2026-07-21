// Jokes for the "Moment Joke" section and the Surprise Me feature.
// Add a new joke by adding one object with all 4 language translations —
// it automatically joins the random rotation everywhere.
const jokes = [
  {
    id: 'joke-001',
    translations: {
      en: {
        setup: "Why don't cats play poker in the jungle?",
        punchline: 'Because there are too many cheetahs.',
      },
      ar: {
        setup: 'ليه القطط ما بتلعبش بوكر في الغابة؟',
        punchline: 'عشان في نمور غشاشة كتير (cheetahs).',
      },
      ru: {
        setup: 'Почему кошки не играют в покер в джунглях?',
        punchline: 'Потому что там слишком много гепардов-шулеров.',
      },
      es: {
        setup: '¿Por qué los gatos no juegan póker en la selva?',
        punchline: 'Porque hay demasiados guepardos tramposos.',
      },
    },
  },
  {
    id: 'joke-002',
    translations: {
      en: {
        setup: 'A dog walks into a library and says, "Woof."',
        punchline: 'The librarian whispers, "Please be quiet." The dog whispers back, "...woof."',
      },
      ar: {
        setup: 'كلب دخل مكتبة وقال "هاو".',
        punchline: 'أمينة المكتبة همست: "من فضلك اهدأ". فهمس الكلب: "...هاو".',
      },
      ru: {
        setup: 'Собака заходит в библиотеку и говорит: "Гав."',
        punchline: 'Библиотекарь шепчет: "Тише, пожалуйста." Собака шепчет в ответ: "...гав."',
      },
      es: {
        setup: 'Un perro entra a una biblioteca y dice: "Guau."',
        punchline: 'La bibliotecaria susurra: "Silencio, por favor." El perro susurra de vuelta: "...guau."',
      },
    },
  },
  {
    id: 'joke-003',
    translations: {
      en: {
        setup: 'Why did the rabbit bring a suitcase?',
        punchline: 'Because he was going on a hare-plane!',
      },
      ar: {
        setup: 'ليه الأرنب جاب شنطة سفر؟',
        punchline: 'عشان كان مسافر على "أرنب-لاين"!',
      },
      ru: {
        setup: 'Зачем кролик взял с собой чемодан?',
        punchline: 'Потому что он летел зайцем... то есть рейсом!',
      },
      es: {
        setup: '¿Por qué el conejo llevaba una maleta?',
        punchline: '¡Porque se iba de viaje en "conejo-avión"!',
      },
    },
  },
  {
    id: 'joke-004',
    translations: {
      en: {
        setup: 'What do birds do when they get promoted?',
        punchline: 'They get a higher tweet.',
      },
      ar: {
        setup: 'الطيور بتعمل إيه لما بتترقى في الشغل؟',
        punchline: 'بتاخد "تغريدة" أعلى.',
      },
      ru: {
        setup: 'Что происходит с птицами, когда их повышают?',
        punchline: 'Их твит становится громче.',
      },
      es: {
        setup: '¿Qué hacen los pájaros cuando los ascienden?',
        punchline: 'Consiguen un tweet más alto.',
      },
    },
  },
  {
    id: 'joke-005',
    translations: {
      en: {
        setup: 'A cat looks at a very expensive sofa, then looks at you, then scratches it anyway.',
        punchline: "Because... it's art.",
      },
      ar: {
        setup: 'قطة بتبص لكنبة غالية جدًا، وبعدين بتبص لك، وبعدين بتخربشها برضه.',
        punchline: 'عشان... ده فن.',
      },
      ru: {
        setup: 'Кошка смотрит на очень дорогой диван, потом на вас, а потом всё равно его царапает.',
        punchline: 'Потому что... это искусство.',
      },
      es: {
        setup: 'Un gato mira un sofá muy caro, luego te mira a ti, y lo araña de todos modos.',
        punchline: 'Porque... es arte.',
      },
    },
  },
]

export default jokes
