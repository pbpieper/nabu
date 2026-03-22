export interface Exercise {
  type: 'fill-blank' | 'reorder' | 'find-error'
  prompt: string
  options?: string[]
  answer: string
  explanation: string
}

export interface GrammarTopic {
  id: string
  name: string
  description: string
  level: 'root' | 'trunk' | 'branch' | 'leaf'
  parentId?: string
  examples: string[]
  exercises: Exercise[]
  language: string
}

// ---------- SPANISH GRAMMAR TREE ----------
const SPANISH_TREE: GrammarTopic[] = [
  // ROOTS
  {
    id: 'es-alphabet', name: 'Alphabet & Pronunciation', level: 'root', language: 'es',
    description: 'Spanish uses the Latin alphabet with one extra letter: n with tilde. Vowels are always pronounced the same way, making Spanish very phonetic.',
    examples: [
      'A E I O U - always the same sound',
      'LL sounds like "y" in "yes" (calle = ka-ye)',
      'H is always silent (hola = o-la)',
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'The letter H in Spanish is always ___', answer: 'silent', explanation: 'H is never pronounced in Spanish.' },
      { type: 'find-error', prompt: 'Which pronunciation is wrong? "hola" = "ho-la"', answer: 'ho-la', explanation: 'H is silent. It should be "o-la".' },
      { type: 'fill-blank', prompt: '"LL" in Spanish sounds like ___ in English', answer: 'y', explanation: 'LL is pronounced like the English "y" sound.' },
    ],
  },
  {
    id: 'es-sentence-structure', name: 'Basic Sentence Structure', level: 'root', language: 'es',
    description: 'Spanish follows Subject-Verb-Object order like English, but subjects can be dropped because verb conjugations show who is acting.',
    examples: [
      'Yo como manzanas. (I eat apples.)',
      'Como manzanas. (I eat apples - subject dropped)',
      'Maria lee un libro. (Maria reads a book.)',
    ],
    exercises: [
      { type: 'reorder', prompt: 'Arrange: libro / lee / Maria / un', answer: 'Maria lee un libro', explanation: 'Subject + Verb + Object: Maria reads a book.' },
      { type: 'fill-blank', prompt: '___ como pizza. (I eat pizza.)', options: ['Yo', 'Tu', 'El'], answer: 'Yo', explanation: '"Yo" means "I".' },
      { type: 'reorder', prompt: 'Arrange: agua / bebe / el gato', answer: 'El gato bebe agua', explanation: 'The cat drinks water. SVO order.' },
    ],
  },
  {
    id: 'es-articles-gender', name: 'Articles & Gender', level: 'root', language: 'es',
    description: 'Every Spanish noun is masculine or feminine. "El" and "la" are "the", "un" and "una" are "a/an". Most nouns ending in -o are masculine, -a are feminine.',
    examples: [
      'El libro (the book) - masculine',
      'La mesa (the table) - feminine',
      'Un gato (a cat) - masculine',
    ],
    exercises: [
      { type: 'fill-blank', prompt: '___ casa es grande. (The house is big.)', options: ['El', 'La', 'Un'], answer: 'La', explanation: '"Casa" ends in -a, so it is feminine: "la casa".' },
      { type: 'fill-blank', prompt: '___ perro es pequeno. (The dog is small.)', options: ['El', 'La', 'Una'], answer: 'El', explanation: '"Perro" ends in -o, so it is masculine: "el perro".' },
      { type: 'find-error', prompt: 'Find the error: "El mesa es roja."', answer: 'El mesa', explanation: '"Mesa" is feminine. It should be "La mesa es roja."' },
    ],
  },
  // TRUNK
  {
    id: 'es-present-tense', name: 'Present Tense', level: 'trunk', parentId: 'es-sentence-structure', language: 'es',
    description: 'Regular verbs follow patterns based on their ending: -ar, -er, or -ir. Each has six conjugation forms for the different persons.',
    examples: [
      'Hablar: hablo, hablas, habla, hablamos, hablais, hablan',
      'Comer: como, comes, come, comemos, comeis, comen',
      'Vivir: vivo, vives, vive, vivimos, vivis, viven',
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'Yo ___ espanol. (hablar)', options: ['hablo', 'hablas', 'habla'], answer: 'hablo', explanation: 'First person singular of -ar verbs ends in -o.' },
      { type: 'fill-blank', prompt: 'Tu ___ mucha agua. (beber)', options: ['bebo', 'bebes', 'bebe'], answer: 'bebes', explanation: 'Second person singular of -er verbs ends in -es.' },
      { type: 'find-error', prompt: 'Find the error: "Nosotros come pizza."', answer: 'come', explanation: 'Should be "comemos" for nosotros.' },
    ],
  },
  {
    id: 'es-past-tense', name: 'Past Tense (Preterite)', level: 'trunk', parentId: 'es-present-tense', language: 'es',
    description: 'The preterite is used for completed actions in the past. Regular -ar verbs get different endings than -er/-ir verbs.',
    examples: [
      'Yo hable con Maria ayer. (I spoke with Maria yesterday.)',
      'El comio una manzana. (He ate an apple.)',
      'Ellos vivieron en Madrid. (They lived in Madrid.)',
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'Ayer yo ___ mucho. (trabajar)', options: ['trabaje', 'trabajo', 'trabajare'], answer: 'trabaje', explanation: 'Preterite first person -ar: -e.' },
      { type: 'fill-blank', prompt: 'Tu ___ la comida. (comer)', options: ['comiste', 'comes', 'comias'], answer: 'comiste', explanation: 'Preterite second person -er: -iste.' },
      { type: 'reorder', prompt: 'Arrange: ayer / una carta / escribio / ella', answer: 'Ella escribio una carta ayer', explanation: 'She wrote a letter yesterday.' },
    ],
  },
  {
    id: 'es-future-tense', name: 'Future Tense', level: 'trunk', parentId: 'es-past-tense', language: 'es',
    description: 'The simple future is formed by adding endings to the full infinitive. All three verb types use the same endings.',
    examples: [
      'Yo hablare con el manana. (I will speak with him tomorrow.)',
      'Tu comeras a las ocho. (You will eat at eight.)',
      'Nosotros viviremos en Barcelona. (We will live in Barcelona.)',
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'Manana yo ___ al parque. (ir)', options: ['ire', 'iba', 'fui'], answer: 'ire', explanation: 'Future of "ir": ire, iras, ira...' },
      { type: 'fill-blank', prompt: 'Ellos ___ la verdad. (saber)', options: ['sabran', 'saben', 'supieron'], answer: 'sabran', explanation: 'Future of "saber" is irregular: sabr- + endings.' },
      { type: 'reorder', prompt: 'Arrange: estudiaremos / manana / juntos', answer: 'Manana estudiaremos juntos', explanation: 'Tomorrow we will study together.' },
    ],
  },
  {
    id: 'es-pronouns', name: 'Pronouns', level: 'trunk', parentId: 'es-sentence-structure', language: 'es',
    description: 'Spanish has subject, object, and reflexive pronouns. They often come before the verb.',
    examples: [
      'Yo te quiero. (I love you.)',
      'El me lo dio. (He gave it to me.)',
      'Ella se llama Maria. (She calls herself Maria.)',
    ],
    exercises: [
      { type: 'fill-blank', prompt: '___ llamo Carlos. (I call myself)', options: ['Me', 'Te', 'Se'], answer: 'Me', explanation: '"Me" is the first person reflexive pronoun.' },
      { type: 'fill-blank', prompt: 'Yo ___ veo. (I see you)', options: ['te', 'me', 'se'], answer: 'te', explanation: '"Te" is the second person object pronoun.' },
      { type: 'find-error', prompt: '"El se llamo Pedro." - what is wrong?', answer: 'se llamo', explanation: 'Should be "se llama" (present) or "se llamaba" (imperfect).' },
    ],
  },
  {
    id: 'es-prepositions', name: 'Basic Prepositions', level: 'trunk', parentId: 'es-pronouns', language: 'es',
    description: 'Key prepositions: a (to), de (of/from), en (in/on), con (with), por (for/by), para (for/in order to).',
    examples: [
      'Voy a la escuela. (I go to school.)',
      'El libro de Maria. (Maria\'s book.)',
      'Estoy en casa. (I am at home.)',
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'Voy ___ el supermercado.', options: ['a', 'al', 'en'], answer: 'al', explanation: '"a" + "el" contracts to "al".' },
      { type: 'fill-blank', prompt: 'El cafe es ___ mi madre. (for)', options: ['por', 'para', 'de'], answer: 'para', explanation: '"Para" indicates purpose/recipient.' },
      { type: 'fill-blank', prompt: 'Vengo ___ Mexico. (from)', options: ['de', 'en', 'a'], answer: 'de', explanation: '"De" means "from" when indicating origin.' },
    ],
  },
  // BRANCHES
  {
    id: 'es-conditional', name: 'Conditional Mood', level: 'branch', parentId: 'es-future-tense', language: 'es',
    description: 'The conditional expresses "would" actions. Used for polite requests and hypothetical situations.',
    examples: [
      'Me gustaria un cafe. (I would like a coffee.)',
      'Yo comeria mas si pudiera. (I would eat more if I could.)',
      'Ellos viajarian a Espana. (They would travel to Spain.)',
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'Me ___ viajar a Japon.', options: ['gustaria', 'gusta', 'gusto'], answer: 'gustaria', explanation: 'Conditional of "gustar": gustaria.' },
      { type: 'fill-blank', prompt: 'Yo ___ si tuviera dinero. (comprar)', options: ['compraria', 'compro', 'comprare'], answer: 'compraria', explanation: 'Conditional: infinitive + -ia ending.' },
      { type: 'reorder', prompt: 'Arrange: ella / a Paris / iria / con nosotros', answer: 'Ella iria a Paris con nosotros', explanation: 'She would go to Paris with us.' },
    ],
  },
  {
    id: 'es-subjunctive', name: 'Subjunctive Mood', level: 'branch', parentId: 'es-present-tense', language: 'es',
    description: 'Expresses wishes, doubts, and emotions. Triggered by phrases like "quiero que", "es posible que".',
    examples: [
      'Quiero que vengas. (I want you to come.)',
      'Es posible que llueva. (It is possible it will rain.)',
      'Espero que estes bien. (I hope you are well.)',
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'Quiero que tu ___ aqui. (estar)', options: ['estes', 'estas', 'estabas'], answer: 'estes', explanation: 'Subjunctive of "estar" after "quiero que".' },
      { type: 'fill-blank', prompt: 'Es importante que ___ la verdad. (decir)', options: ['digas', 'dices', 'diras'], answer: 'digas', explanation: '"Es importante que" triggers subjunctive.' },
      { type: 'find-error', prompt: '"Espero que tienes tiempo."', answer: 'tienes', explanation: 'After "espero que", use subjunctive: "tengas".' },
    ],
  },
  {
    id: 'es-passive', name: 'Passive Voice', level: 'branch', parentId: 'es-past-tense', language: 'es',
    description: 'Uses "ser + past participle" or the impersonal "se". The "se" passive is more common in speech.',
    examples: [
      'El libro fue escrito por Cervantes.',
      'Se habla espanol aqui.',
      'Se venden casas. (Houses are sold.)',
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'Aqui ___ habla ingles.', options: ['se', 'es', 'fue'], answer: 'se', explanation: '"Se" creates impersonal passive constructions.' },
      { type: 'fill-blank', prompt: 'La carta fue ___ por Maria. (escribir)', options: ['escrita', 'escribio', 'escribiendo'], answer: 'escrita', explanation: 'Passive: ser + past participle.' },
      { type: 'reorder', prompt: 'Arrange: se / en / tacos / Mexico / comen', answer: 'Se comen tacos en Mexico', explanation: 'Tacos are eaten in Mexico.' },
    ],
  },
  {
    id: 'es-relative-clauses', name: 'Relative Clauses', level: 'branch', parentId: 'es-pronouns', language: 'es',
    description: 'Connect clauses with: "que" (that/who), "donde" (where), "quien" (whom). "Que" is the most common.',
    examples: [
      'El chico que vive aqui es mi amigo.',
      'La ciudad donde naci es bella.',
      'La mujer con quien hable es doctora.',
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'El libro ___ lei es interesante.', options: ['que', 'donde', 'quien'], answer: 'que', explanation: '"Que" refers to things.' },
      { type: 'fill-blank', prompt: 'La casa ___ vivo es vieja.', options: ['donde', 'que', 'cual'], answer: 'donde', explanation: '"Donde" refers to places.' },
      { type: 'fill-blank', prompt: 'La persona con ___ trabajo es amable.', options: ['quien', 'que', 'donde'], answer: 'quien', explanation: 'After prepositions, "quien" for people.' },
    ],
  },
  {
    id: 'es-comparative', name: 'Comparatives & Superlatives', level: 'branch', parentId: 'es-prepositions', language: 'es',
    description: 'Use "mas...que" (more than), "menos...que" (less than), "tan...como" (as...as).',
    examples: [
      'Maria es mas alta que Pedro.',
      'Este libro es menos interesante.',
      'Es el edificio mas grande de la ciudad.',
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'Mi casa es ___ grande que la tuya.', options: ['mas', 'menos', 'tan'], answer: 'mas', explanation: '"Mas...que" = more/bigger than.' },
      { type: 'fill-blank', prompt: 'El es ___ inteligente como tu.', options: ['tan', 'mas', 'muy'], answer: 'tan', explanation: '"Tan...como" = as...as.' },
      { type: 'find-error', prompt: '"El es el mas bueno estudiante."', answer: 'mas bueno', explanation: '"Bueno" has irregular superlative: "el mejor".' },
    ],
  },
  // LEAVES
  {
    id: 'es-idioms', name: 'Idiomatic Expressions', level: 'leaf', parentId: 'es-conditional', language: 'es',
    description: 'Common idioms that cannot be translated word-for-word. Master these to sound natural.',
    examples: [
      'Tomar el pelo = to pull someone\'s leg',
      'Estar en las nubes = to be daydreaming',
      'No tener pelos en la lengua = to speak frankly',
    ],
    exercises: [
      { type: 'fill-blank', prompt: '"Estar en las ___" = to daydream', options: ['nubes', 'estrellas', 'montanas'], answer: 'nubes', explanation: 'In the clouds = daydreaming.' },
      { type: 'fill-blank', prompt: '"Tomar el ___" = to joke/tease', options: ['pelo', 'brazo', 'pie'], answer: 'pelo', explanation: 'Pull the hair = pull someone\'s leg.' },
      { type: 'fill-blank', prompt: '"Meter la ___" = to put your foot in it', options: ['pata', 'mano', 'cabeza'], answer: 'pata', explanation: 'Put the paw in it = make a blunder.' },
    ],
  },
  {
    id: 'es-register', name: 'Register & Formality', level: 'leaf', parentId: 'es-subjunctive', language: 'es',
    description: 'Spanish distinguishes formal "usted" from informal "tu". Essential for appropriate communication.',
    examples: [
      'Tu: Como estas? (informal)',
      'Usted: Como esta usted? (formal)',
      'Vosotros: Como estais? (Spain informal plural)',
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'To a professor: "Podria ___ ayudarme?"', options: ['usted', 'tu', 'vos'], answer: 'usted', explanation: 'Use "usted" in formal contexts.' },
      { type: 'find-error', prompt: 'To your boss: "Oye, tu tienes un minuto?"', answer: 'Oye, tu', explanation: 'Too informal. Use "Disculpe, usted..."' },
      { type: 'fill-blank', prompt: 'In Latin America, "vosotros" is replaced by ___', options: ['ustedes', 'ellos', 'tu'], answer: 'ustedes', explanation: 'Latin America uses "ustedes" for plural.' },
    ],
  },
  {
    id: 'es-rhetoric', name: 'Rhetorical Structures', level: 'leaf', parentId: 'es-relative-clauses', language: 'es',
    description: 'Advanced structures for essays and speeches: concession, emphasis, and logical connectors.',
    examples: [
      'Aunque llueva, ire. (Even if it rains, I will go.)',
      'No solo habla espanol, sino tambien frances.',
      'Por un lado...por otro lado...',
    ],
    exercises: [
      { type: 'fill-blank', prompt: '___ llueva, saldremos. (Even if)', options: ['Aunque', 'Porque', 'Cuando'], answer: 'Aunque', explanation: '"Aunque" = even though/even if.' },
      { type: 'fill-blank', prompt: 'No solo estudia, ___ tambien trabaja.', options: ['sino', 'pero', 'y'], answer: 'sino', explanation: '"No solo...sino tambien" = not only...but also.' },
      { type: 'reorder', prompt: 'Arrange: embargo / fue / sin / divertido', answer: 'Sin embargo fue divertido', explanation: '"Sin embargo" = however.' },
    ],
  },
]

// ---------- ARABIC GRAMMAR TREE ----------
const ARABIC_TREE: GrammarTopic[] = [
  // ROOTS
  {
    id: 'ar-alphabet', name: 'Arabic Script', level: 'root', language: 'ar',
    description: 'Arabic has 28 letters written right-to-left. Letters connect and have up to 4 forms based on position.',
    examples: [
      '\u0628 ba - has 4 positional forms',
      '\u0643\u062A\u0627\u0628 (kitaab) = book',
      'Short vowels are marks above/below letters',
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'Arabic is written from ___ to ___', answer: 'right to left', explanation: 'Arabic script runs right-to-left.' },
      { type: 'fill-blank', prompt: 'Arabic has ___ letters', options: ['28', '26', '32'], answer: '28', explanation: '28 consonant letters.' },
      { type: 'fill-blank', prompt: 'Short vowels are written as ___ on letters', answer: 'marks', explanation: 'Diacritical marks (harakat) indicate short vowels.' },
    ],
  },
  {
    id: 'ar-sentence-structure', name: 'Sentence Structure', level: 'root', language: 'ar',
    description: 'Arabic has nominal (noun-first) and verbal (verb-first) sentences. No "is/am/are" needed in present nominal sentences.',
    examples: [
      '\u0627\u0644\u0648\u0644\u062F \u0643\u0628\u064A\u0631 (al-walad kabiir) = The boy is big',
      '\u0643\u062A\u0628 \u0627\u0644\u0648\u0644\u062F \u0631\u0633\u0627\u0644\u0629 (kataba al-walad risaala) = The boy wrote a letter',
      'Nominal: Subject + Predicate. Verbal: Verb + Subject + Object.',
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'A nominal sentence starts with a ___', options: ['noun', 'verb', 'particle'], answer: 'noun', explanation: 'Nominal sentences begin with a noun.' },
      { type: 'fill-blank', prompt: '"The house is big" in Arabic uses ___ verb', options: ['no', 'one', 'two'], answer: 'no', explanation: 'Present nominal sentences omit "to be".' },
      { type: 'fill-blank', prompt: 'A verbal sentence starts with a ___', options: ['verb', 'noun', 'adjective'], answer: 'verb', explanation: 'Verbal sentences start with the verb.' },
    ],
  },
  {
    id: 'ar-definite-article', name: 'The Definite Article', level: 'root', language: 'ar',
    description: '\u0627\u0644 (al-) means "the". With "sun letters", the L assimilates. No indefinite article exists.',
    examples: [
      '\u0643\u062A\u0627\u0628 (kitaab) = a book \u2192 \u0627\u0644\u0643\u062A\u0627\u0628 (al-kitaab) = the book',
      '\u0634\u0645\u0633 (shams) \u2192 \u0627\u0644\u0634\u0645\u0633 (ash-shams) = the sun',
      'No indefinite article - just use the noun without al-',
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'The Arabic definite article is ___', answer: 'al-', explanation: '\u0627\u0644 (al-) means "the".' },
      { type: 'fill-blank', prompt: '"Sun letters" cause L in al- to ___', options: ['assimilate', 'disappear', 'double'], answer: 'assimilate', explanation: 'L sound changes to match the next letter.' },
      { type: 'fill-blank', prompt: 'To say "a book", you ___ the article', options: ['omit', 'add', 'change'], answer: 'omit', explanation: 'Just use the bare noun.' },
    ],
  },
  // TRUNK
  {
    id: 'ar-present-tense', name: 'Present Tense', level: 'trunk', parentId: 'ar-sentence-structure', language: 'ar',
    description: 'Formed by adding prefixes (and sometimes suffixes) to the verb root. The root is usually 3 consonants.',
    examples: [
      '\u064A\u0643\u062A\u0628 (yaktub) = he writes',
      '\u062A\u0643\u062A\u0628 (taktub) = she/you write',
      '\u0623\u0643\u062A\u0628 (aktub) = I write',
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'The "he" prefix in present tense is ___', options: ['\u064A (ya)', '\u062A (ta)', '\u0623 (a)'], answer: '\u064A (ya)', explanation: 'Third person masculine prefix is ya-.' },
      { type: 'fill-blank', prompt: 'Arabic verb roots typically have ___ consonants', options: ['3', '2', '4'], answer: '3', explanation: 'Most roots are trilateral.' },
      { type: 'fill-blank', prompt: 'The "I" prefix in present tense is ___', options: ['\u0623 (a)', '\u064A (ya)', '\u0646 (na)'], answer: '\u0623 (a)', explanation: 'First person singular prefix is a-.' },
    ],
  },
  {
    id: 'ar-past-tense', name: 'Past Tense', level: 'trunk', parentId: 'ar-present-tense', language: 'ar',
    description: 'The base form of Arabic verbs. Suffixes indicate person, number, and gender.',
    examples: [
      '\u0643\u062A\u0628 (kataba) = he wrote',
      '\u0643\u062A\u0628\u062A (katabat) = she wrote',
      '\u0643\u062A\u0628\u062A (katabtu) = I wrote',
    ],
    exercises: [
      { type: 'fill-blank', prompt: '\u0643\u062A\u0628 (kataba) means:', options: ['he wrote', 'he writes', 'write!'], answer: 'he wrote', explanation: 'Base form = 3rd person masculine past.' },
      { type: 'fill-blank', prompt: 'To say "she wrote", add suffix ___', options: ['-at', '-tu', '-na'], answer: '-at', explanation: 'Feminine suffix -at: katabat.' },
      { type: 'fill-blank', prompt: 'Past tense uses ___', options: ['suffixes', 'prefixes', 'both'], answer: 'suffixes', explanation: 'Past tense conjugates with suffixes only.' },
    ],
  },
  {
    id: 'ar-future-tense', name: 'Future Tense', level: 'trunk', parentId: 'ar-past-tense', language: 'ar',
    description: 'Add \u0633 (sa-) or \u0633\u0648\u0641 (sawfa) before the present tense verb. Sa- is near future, sawfa is distant.',
    examples: [
      '\u0633\u0623\u0643\u062A\u0628 (sa-aktub) = I will write',
      '\u0633\u0648\u0641 \u064A\u0643\u062A\u0628 (sawfa yaktub) = he will write',
      '\u0633\u0646\u0630\u0647\u0628 (sa-nadh-hab) = we will go',
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'Future tense: add ___ before present verb', options: ['\u0633 or \u0633\u0648\u0641', '\u0642\u062F', '\u0644\u0645'], answer: '\u0633 or \u0633\u0648\u0641', explanation: 'Sa- (near) or sawfa (distant) + present tense.' },
      { type: 'fill-blank', prompt: '\u0633\u0623\u0630\u0647\u0628 means:', options: ['I will go', 'I went', 'I go'], answer: 'I will go', explanation: 'Sa- + present = future.' },
      { type: 'fill-blank', prompt: '___ is for more distant future', options: ['\u0633\u0648\u0641', '\u0633', '\u0642\u062F'], answer: '\u0633\u0648\u0641', explanation: 'Sawfa implies remote/uncertain future.' },
    ],
  },
  {
    id: 'ar-pronouns', name: 'Pronouns', level: 'trunk', parentId: 'ar-sentence-structure', language: 'ar',
    description: 'Separate masculine/feminine pronouns, plus dual forms. Pronouns also attach as suffixes to verbs and nouns.',
    examples: [
      '\u0623\u0646\u0627 (ana) = I, \u0623\u0646\u062A (anta) = you (m), \u0623\u0646\u062A\u0650 (anti) = you (f)',
      '\u0647\u0648 (huwa) = he, \u0647\u064A (hiya) = she',
      '\u0643\u062A\u0627\u0628\u064A (kitaab-ii) = my book',
    ],
    exercises: [
      { type: 'fill-blank', prompt: '\u0623\u0646\u0627 means ___', options: ['I', 'you', 'he'], answer: 'I', explanation: '\u0623\u0646\u0627 (ana) = I.' },
      { type: 'fill-blank', prompt: 'Arabic distinguishes "you" by ___', options: ['gender', 'age', 'status'], answer: 'gender', explanation: '\u0623\u0646\u062A (anta/m) vs \u0623\u0646\u062A\u0650 (anti/f).' },
      { type: 'fill-blank', prompt: 'Arabic has a special form for exactly ___ people', options: ['two', 'three', 'four'], answer: 'two', explanation: 'The dual form for exactly two.' },
    ],
  },
  {
    id: 'ar-prepositions', name: 'Basic Prepositions', level: 'trunk', parentId: 'ar-pronouns', language: 'ar',
    description: 'Key: \u0641\u064A (fi/in), \u0645\u0646 (min/from), \u0625\u0644\u0649 (ila/to), \u0639\u0644\u0649 (ala/on), \u0628 (bi/with), \u0644 (li/for).',
    examples: [
      '\u0641\u064A \u0627\u0644\u0628\u064A\u062A (fi al-bayt) = in the house',
      '\u0645\u0646 \u0627\u0644\u0645\u062F\u0631\u0633\u0629 (min al-madrasa) = from the school',
      '\u0625\u0644\u0649 \u0627\u0644\u0633\u0648\u0642 (ila as-suuq) = to the market',
    ],
    exercises: [
      { type: 'fill-blank', prompt: '\u0641\u064A means ___', options: ['in', 'from', 'to'], answer: 'in', explanation: '\u0641\u064A (fi) = in/inside.' },
      { type: 'fill-blank', prompt: '\u0645\u0646 means ___', options: ['from', 'to', 'with'], answer: 'from', explanation: '\u0645\u0646 (min) = from.' },
      { type: 'fill-blank', prompt: '___ means "to the house"', options: ['\u0625\u0644\u0649 \u0627\u0644\u0628\u064A\u062A', '\u0641\u064A \u0627\u0644\u0628\u064A\u062A', '\u0639\u0644\u0649 \u0627\u0644\u0628\u064A\u062A'], answer: '\u0625\u0644\u0649 \u0627\u0644\u0628\u064A\u062A', explanation: '\u0625\u0644\u0649 = to.' },
    ],
  },
  // BRANCHES
  {
    id: 'ar-verb-forms', name: 'Verb Forms (Awzaan)', level: 'branch', parentId: 'ar-present-tense', language: 'ar',
    description: '10 verb patterns (forms I-X) that modify the root to create related meanings.',
    examples: [
      'Form I: \u0643\u062A\u0628 (kataba) = wrote',
      'Form II: \u0643\u064E\u062A\u0651\u0628 (kattaba) = dictated',
      'Form V: \u062A\u0643\u064E\u062A\u0651\u0628 (takattaba) = corresponded',
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'Form II typically adds a ___ meaning', options: ['causative', 'passive', 'reflexive'], answer: 'causative', explanation: 'Form II often = causing someone to do.' },
      { type: 'fill-blank', prompt: 'Arabic verb patterns are called ___', options: ['awzaan', 'huroof', 'kalimaat'], answer: 'awzaan', explanation: 'The 10 patterns are called awzaan.' },
      { type: 'fill-blank', prompt: 'There are ___ common verb forms', options: ['10', '5', '15'], answer: '10', explanation: 'Forms I through X.' },
    ],
  },
  {
    id: 'ar-case-endings', name: 'Case Endings', level: 'branch', parentId: 'ar-definite-article', language: 'ar',
    description: 'Three cases: nominative (-u), accusative (-a), genitive (-i). Often dropped in spoken Arabic.',
    examples: [
      '\u0627\u0644\u0643\u062A\u0627\u0628\u064F (al-kitaabu) = the book (subject)',
      '\u0627\u0644\u0643\u062A\u0627\u0628\u064E (al-kitaaba) = the book (object)',
      '\u0627\u0644\u0643\u062A\u0627\u0628\u0650 (al-kitaabi) = of the book',
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'Nominative case ending is ___', options: ['-u', '-a', '-i'], answer: '-u', explanation: 'Nominative (subject) = damma (-u).' },
      { type: 'fill-blank', prompt: 'Genitive case ending is ___', options: ['-i', '-u', '-a'], answer: '-i', explanation: 'Genitive (possession) = kasra (-i).' },
      { type: 'fill-blank', prompt: 'In spoken Arabic, case endings are often ___', options: ['dropped', 'emphasized', 'changed'], answer: 'dropped', explanation: 'Modern speech usually omits them.' },
    ],
  },
  {
    id: 'ar-idaafa', name: 'Possession (Idaafa)', level: 'branch', parentId: 'ar-prepositions', language: 'ar',
    description: 'Two nouns together: the second possesses the first. The first noun drops its article.',
    examples: [
      '\u0643\u062A\u0627\u0628 \u0627\u0644\u0637\u0627\u0644\u0628 (kitaab at-taalib) = the student\'s book',
      '\u0628\u0627\u0628 \u0627\u0644\u0628\u064A\u062A (baab al-bayt) = door of the house',
      '\u0645\u062F\u064A\u0631 \u0627\u0644\u0634\u0631\u0643\u0629 (mudiir ash-sharika) = company director',
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'In Idaafa, the first noun cannot have ___', options: ['al-', 'case endings', 'gender'], answer: 'al-', explanation: 'First noun drops its definite article.' },
      { type: 'fill-blank', prompt: '\u0643\u062A\u0627\u0628 \u0627\u0644\u0637\u0627\u0644\u0628 means ___', options: ['the student\'s book', 'a student book', 'the students'], answer: 'the student\'s book', explanation: 'Definiteness comes from the second noun.' },
      { type: 'reorder', prompt: '"the teacher\'s house": \u0628\u064A\u062A / \u0627\u0644\u0645\u062F\u0631\u0633', answer: '\u0628\u064A\u062A \u0627\u0644\u0645\u062F\u0631\u0633', explanation: 'Possessed + possessor.' },
    ],
  },
  {
    id: 'ar-broken-plural', name: 'Broken Plurals', level: 'branch', parentId: 'ar-past-tense', language: 'ar',
    description: 'Arabic changes internal vowels to form plurals. These patterns must be memorized per noun.',
    examples: [
      '\u0643\u062A\u0627\u0628 (kitaab) \u2192 \u0643\u062A\u0628 (kutub) = books',
      '\u0631\u062C\u0644 (rajul) \u2192 \u0631\u062C\u0627\u0644 (rijaal) = men',
      '\u0628\u064A\u062A (bayt) \u2192 \u0628\u064A\u0648\u062A (buyuut) = houses',
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'Plural of \u0643\u062A\u0627\u0628 (book) is ___', options: ['\u0643\u062A\u0628', '\u0643\u062A\u0627\u0628\u0627\u062A', '\u0643\u0627\u062A\u0628'], answer: '\u0643\u062A\u0628', explanation: 'kitaab \u2192 kutub (broken plural).' },
      { type: 'fill-blank', prompt: 'Broken plurals change the ___ pattern', options: ['vowel', 'consonant', 'suffix'], answer: 'vowel', explanation: 'Internal vowels change; root consonants stay.' },
      { type: 'fill-blank', prompt: 'Broken plurals must be ___', options: ['memorized', 'calculated', 'guessed'], answer: 'memorized', explanation: 'No single rule; learn each pattern.' },
    ],
  },
  // LEAVES
  {
    id: 'ar-idioms', name: 'Arabic Idioms', level: 'leaf', parentId: 'ar-verb-forms', language: 'ar',
    description: 'Expressions rooted in Arabic culture, referencing nature, hospitality, and honor.',
    examples: [
      '\u0639\u0644\u0649 \u0631\u0627\u0633\u064A = on my head = gladly',
      '\u0627\u0644\u0644\u0647 \u064A\u0639\u0637\u064A\u0643 \u0627\u0644\u0639\u0627\u0641\u064A\u0629 = God give you strength',
      '\u064A\u0627 \u0633\u0644\u0627\u0645 = oh peace = wow/amazement',
    ],
    exercises: [
      { type: 'fill-blank', prompt: '"\u0639\u0644\u0649 \u0631\u0627\u0633\u064A" literally means "on my ___"', options: ['head', 'heart', 'hand'], answer: 'head', explanation: 'On my head = gladly/at your service.' },
      { type: 'fill-blank', prompt: '"\u0627\u0644\u0644\u0647 \u064A\u0639\u0637\u064A\u0643 \u0627\u0644\u0639\u0627\u0641\u064A\u0629" is said to someone ___', options: ['working', 'eating', 'sleeping'], answer: 'working', explanation: 'A blessing for someone working hard.' },
      { type: 'fill-blank', prompt: '"\u064A\u0627 \u0633\u0644\u0627\u0645" expresses ___', options: ['amazement', 'anger', 'sadness'], answer: 'amazement', explanation: '"Ya salaam" = wow!' },
    ],
  },
  {
    id: 'ar-formal-informal', name: 'Formal vs Colloquial', level: 'leaf', parentId: 'ar-idaafa', language: 'ar',
    description: 'Modern Standard Arabic (fusha) for writing/media; regional dialects (ammiyya) for daily conversation.',
    examples: [
      'MSA: \u0645\u0627\u0630\u0627 \u062A\u0631\u064A\u062F\u061F (maadha turiid?) = What do you want?',
      'Egyptian: \u0639\u0627\u064A\u0632 \u0627\u064A\u0647\u061F (aayiz eih?)',
      'Levantine: \u0634\u0648 \u0628\u062F\u0643\u061F (shu baddak?)',
    ],
    exercises: [
      { type: 'fill-blank', prompt: 'Formal standard Arabic is called ___', options: ['fusha', 'ammiyya', 'darija'], answer: 'fusha', explanation: 'Fusha = Modern Standard Arabic.' },
      { type: 'fill-blank', prompt: 'Everyday spoken Arabic is called ___', options: ['ammiyya', 'fusha', 'nahw'], answer: 'ammiyya', explanation: 'Ammiyya = colloquial/dialectal Arabic.' },
      { type: 'fill-blank', prompt: 'News broadcasts use ___', options: ['fusha', 'ammiyya', 'slang'], answer: 'fusha', explanation: 'Media uses Modern Standard Arabic.' },
    ],
  },
]

export function getTreeForLanguage(langCode: string): GrammarTopic[] {
  if (langCode === 'es') return SPANISH_TREE
  if (langCode === 'ar') return ARABIC_TREE
  return SPANISH_TREE
}
