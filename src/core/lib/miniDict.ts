/**
 * Mini offline dictionaries — top ~100 most common words per language.
 * Used by TextReader and Library for instant lookups without network.
 * Key: lowercase word in target language. Value: English translation.
 */

const SPANISH: Record<string, string> = {
  // Articles & determiners
  el: 'the (m) / he', la: 'the (f)', los: 'the (m.pl)', las: 'the (f.pl)',
  un: 'a/one (m)', una: 'a/one (f)', unos: 'some (m)', unas: 'some (f)',
  // Pronouns
  yo: 'I', tu: 'you', ella: 'she', nosotros: 'we', ellos: 'they (m)',
  ellas: 'they (f)', usted: 'you (formal)', ustedes: 'you all',
  me: 'me/myself', te: 'you/yourself', se: 'self/themselves',
  lo: 'it/him', le: 'him/her (indirect)',
  // Verbs
  ser: 'to be (permanent)', estar: 'to be (state)', es: 'is (permanent)',
  esta: 'is (state)', soy: 'I am', estoy: 'I am (state)',
  tiene: 'has', tener: 'to have', tengo: 'I have',
  hacer: 'to do/make', hago: 'I do', hace: 'does/makes',
  ir: 'to go', voy: 'I go', va: 'goes',
  poder: 'to be able', puede: 'can', puedo: 'I can',
  querer: 'to want', quiero: 'I want', quiere: 'wants',
  saber: 'to know (fact)', conocer: 'to know (person)',
  decir: 'to say', dice: 'says', digo: 'I say',
  ver: 'to see', veo: 'I see',
  dar: 'to give', doy: 'I give',
  hablar: 'to speak', hablo: 'I speak',
  comer: 'to eat',
  vivir: 'to live', vivo: 'I live',
  hay: 'there is/are', fue: 'was/went',
  // Prepositions & conjunctions
  de: 'of/from', en: 'in/on', a: 'to/at', con: 'with', por: 'for/by',
  para: 'for/in order to', sin: 'without', sobre: 'about/on', entre: 'between',
  y: 'and', o: 'or', pero: 'but', que: 'that/which', como: 'like/as/I eat',
  si: 'if/yes', no: 'no/not', mas: 'more', muy: 'very',
  // Nouns
  hombre: 'man', mujer: 'woman', nino: 'boy/child', casa: 'house',
  tiempo: 'time/weather', dia: 'day', noche: 'night', ano: 'year',
  vida: 'life', mundo: 'world', agua: 'water', mano: 'hand',
  cosa: 'thing', parte: 'part', ciudad: 'city', pais: 'country',
  trabajo: 'work', nombre: 'name', libro: 'book', amigo: 'friend',
  familia: 'family', comida: 'food', escuela: 'school',
  // Adjectives
  bueno: 'good', malo: 'bad', grande: 'big', pequeno: 'small',
  nuevo: 'new', viejo: 'old', mismo: 'same', otro: 'other',
  todo: 'all/every', mucho: 'much/many', poco: 'little/few',
  primero: 'first', ultimo: 'last', mejor: 'better/best',
  // Question words & adverbs
  donde: 'where', cuando: 'when', porque: 'because/why',
  quien: 'who', cual: 'which', aqui: 'here', alli: 'there',
  ahora: 'now', hoy: 'today', ayer: 'yesterday', manana: 'tomorrow',
  siempre: 'always', nunca: 'never', tambien: 'also', solo: 'only/alone',
  bien: 'well', mal: 'badly',
}

const FRENCH: Record<string, string> = {
  le: 'the (m)', la: 'the (f) / there', les: 'the (pl)', un: 'a (m)', une: 'a (f)',
  des: 'some', du: 'of the (m)',
  je: 'I', tu: 'you', il: 'he', elle: 'she', nous: 'we', vous: 'you (pl/formal)',
  ils: 'they (m)', elles: 'they (f)', on: 'one/we',
  me: 'me', te: 'you', se: 'self',
  'c\'est': 'it is', ce: 'this/that',
  // Verbs
  'etre': 'to be', avoir: 'to have', faire: 'to do/make',
  suis: 'am', est: 'is', sont: 'are', ai: 'have',
  va: 'goes', aller: 'to go', vais: 'I go',
  pouvoir: 'to be able', peut: 'can', peux: 'I can',
  vouloir: 'to want', veux: 'I want', veut: 'wants',
  savoir: 'to know', sais: 'I know', sait: 'knows',
  dire: 'to say', dit: 'says', voir: 'to see', vois: 'I see',
  donner: 'to give', parler: 'to speak', manger: 'to eat',
  aimer: 'to like/love', prendre: 'to take',
  // Prepositions
  de: 'of/from', dans: 'in', avec: 'with', pour: 'for',
  sur: 'on', par: 'by', en: 'in/some', sans: 'without',
  entre: 'between',
  // Conjunctions
  et: 'and', ou: 'or/where', mais: 'but', que: 'that', si: 'if',
  ne: 'not', pas: 'not', plus: 'more/no more', tres: 'very',
  // Nouns
  homme: 'man', femme: 'woman', enfant: 'child', maison: 'house',
  temps: 'time/weather', jour: 'day', nuit: 'night', an: 'year',
  vie: 'life', monde: 'world', eau: 'water', main: 'hand',
  chose: 'thing', pays: 'country', ville: 'city', nom: 'name',
  travail: 'work', livre: 'book', ami: 'friend', famille: 'family',
  // Adjectives
  bon: 'good', mauvais: 'bad', grand: 'big/tall', petit: 'small',
  nouveau: 'new', vieux: 'old', meme: 'same', autre: 'other',
  tout: 'all', beaucoup: 'much/many', peu: 'little/few',
  premier: 'first', dernier: 'last', meilleur: 'better/best',
  // Adverbs
  quand: 'when', comment: 'how', pourquoi: 'why',
  qui: 'who', ici: 'here', maintenant: 'now',
  'aujourd\'hui': 'today', hier: 'yesterday', demain: 'tomorrow',
  toujours: 'always', jamais: 'never', aussi: 'also',
  bien: 'well', mal: 'badly', oui: 'yes', non: 'no',
}

const GERMAN: Record<string, string> = {
  der: 'the (m)', die: 'the (f/pl)', das: 'the (n)', ein: 'a (m/n)', eine: 'a (f)',
  ich: 'I', du: 'you', er: 'he', sie: 'she/they/you(formal)', es: 'it',
  wir: 'we', ihr: 'you (pl)',
  mich: 'me', dich: 'you (acc)', sich: 'self',
  // Verbs
  sein: 'to be', haben: 'to have', werden: 'to become/will',
  bin: 'am', ist: 'is', sind: 'are', hat: 'has', habe: 'have',
  machen: 'to do/make', gehen: 'to go', gehe: 'I go', geht: 'goes',
  kommen: 'to come', komme: 'I come',
  wollen: 'to want', will: 'want', kann: 'can',
  wissen: 'to know (fact)', kennen: 'to know (person)',
  sagen: 'to say', sagt: 'says', sehen: 'to see',
  geben: 'to give', gibt: 'gives', nehmen: 'to take',
  sprechen: 'to speak', essen: 'to eat',
  // Prepositions
  in: 'in', von: 'from/of', mit: 'with', an: 'at/on',
  auf: 'on', fur: 'for', aus: 'out of/from', nach: 'after/to',
  zu: 'to', bei: 'at/near', uber: 'over/about', ohne: 'without',
  // Conjunctions
  und: 'and', oder: 'or', aber: 'but', dass: 'that', wenn: 'if/when',
  nicht: 'not', kein: 'no/none', sehr: 'very', auch: 'also',
  // Nouns
  Mann: 'man', Frau: 'woman', Kind: 'child', Haus: 'house',
  Zeit: 'time', Tag: 'day', Nacht: 'night', Jahr: 'year',
  Leben: 'life', Welt: 'world', Wasser: 'water', Hand: 'hand',
  Land: 'country/land', Stadt: 'city', Name: 'name',
  Arbeit: 'work', Buch: 'book', Freund: 'friend', Familie: 'family',
  // Adjectives
  gut: 'good', schlecht: 'bad', gross: 'big', klein: 'small',
  neu: 'new', alt: 'old', gleich: 'same', ander: 'other',
  viel: 'much/many', wenig: 'little/few', erst: 'first', letzt: 'last',
  // Adverbs
  wo: 'where', wann: 'when', wie: 'how', warum: 'why', wer: 'who',
  hier: 'here', da: 'there', jetzt: 'now', heute: 'today',
  gestern: 'yesterday', morgen: 'tomorrow',
  immer: 'always', nie: 'never', ja: 'yes', nein: 'no',
  schon: 'already/beautiful', noch: 'still/yet', nur: 'only',
}

const ARABIC: Record<string, string> = {
  '\u0623\u0646\u0627': 'I', '\u0623\u0646\u062A': 'you (m)', '\u0623\u0646\u062A\u0650': 'you (f)',
  '\u0647\u0648': 'he', '\u0647\u064A': 'she', '\u0646\u062D\u0646': 'we',
  '\u0647\u0645': 'they (m)', '\u0647\u0646': 'they (f)',
  // Particles
  '\u0641\u064A': 'in', '\u0645\u0646': 'from/who', '\u0625\u0644\u0649': 'to', '\u0639\u0644\u0649': 'on',
  '\u0645\u0639': 'with', '\u0639\u0646': 'about', '\u0628\u064A\u0646': 'between',
  '\u0648': 'and', '\u0623\u0648': 'or', '\u0644\u0643\u0646': 'but', '\u0623\u0646': 'that',
  '\u0625\u0630\u0627': 'if', '\u0644\u0627': 'no/not', '\u0646\u0639\u0645': 'yes',
  '\u0647\u0630\u0627': 'this (m)', '\u0647\u0630\u0647': 'this (f)', '\u0630\u0644\u0643': 'that (m)',
  // Common nouns
  '\u0631\u062C\u0644': 'man', '\u0627\u0645\u0631\u0623\u0629': 'woman', '\u0637\u0641\u0644': 'child',
  '\u0628\u064A\u062A': 'house', '\u0648\u0642\u062A': 'time', '\u064A\u0648\u0645': 'day',
  '\u0644\u064A\u0644\u0629': 'night', '\u0633\u0646\u0629': 'year', '\u062D\u064A\u0627\u0629': 'life',
  '\u0639\u0627\u0644\u0645': 'world', '\u0645\u0627\u0621': 'water', '\u064A\u062F': 'hand',
  '\u0623\u0631\u0636': 'earth/land', '\u0645\u062F\u064A\u0646\u0629': 'city',
  '\u0627\u0633\u0645': 'name', '\u0639\u0645\u0644': 'work', '\u0643\u062A\u0627\u0628': 'book',
  '\u0635\u062F\u064A\u0642': 'friend', '\u0639\u0627\u0626\u0644\u0629': 'family',
  '\u0637\u0639\u0627\u0645': 'food', '\u0645\u062F\u0631\u0633\u0629': 'school',
  '\u0628\u0627\u0628': 'door', '\u0634\u0627\u0631\u0639': 'street',
  // Common verbs
  '\u0643\u0627\u0646': 'was/to be', '\u0643\u062A\u0628': 'wrote', '\u0642\u0627\u0644': 'said',
  '\u0630\u0647\u0628': 'went', '\u0623\u0643\u0644': 'ate', '\u0634\u0631\u0628': 'drank',
  '\u0639\u0631\u0641': 'knew', '\u0623\u062E\u0630': 'took', '\u0631\u0623\u0649': 'saw',
  '\u0623\u0639\u0637\u0649': 'gave', '\u062A\u0643\u0644\u0645': 'spoke',
  '\u064A\u0643\u062A\u0628': 'writes', '\u064A\u0642\u0648\u0644': 'says',
  '\u064A\u0630\u0647\u0628': 'goes', '\u064A\u0623\u0643\u0644': 'eats',
  '\u064A\u0639\u0631\u0641': 'knows', '\u064A\u0631\u064A\u062F': 'wants',
  // Adjectives
  '\u0643\u0628\u064A\u0631': 'big', '\u0635\u063A\u064A\u0631': 'small',
  '\u062C\u062F\u064A\u062F': 'new', '\u0642\u062F\u064A\u0645': 'old',
  '\u062C\u0645\u064A\u0644': 'beautiful', '\u062C\u064A\u062F': 'good',
  '\u0633\u064A\u0626': 'bad', '\u0643\u062B\u064A\u0631': 'much/many',
  '\u0642\u0644\u064A\u0644': 'little/few',
  // Question words
  '\u0623\u064A\u0646': 'where', '\u0645\u062A\u0649': 'when', '\u0643\u064A\u0641': 'how',
  '\u0644\u0645\u0627\u0630\u0627': 'why', '\u0645\u0627\u0630\u0627': 'what',
  // Adverbs
  '\u0647\u0646\u0627': 'here', '\u0647\u0646\u0627\u0643': 'there', '\u0627\u0644\u0622\u0646': 'now',
  '\u0627\u0644\u064A\u0648\u0645': 'today', '\u0623\u0645\u0633': 'yesterday', '\u063A\u062F\u0627': 'tomorrow',
  '\u062F\u0627\u0626\u0645\u0627': 'always', '\u0623\u0628\u062F\u0627': 'never',
  '\u0623\u064A\u0636\u0627': 'also', '\u0641\u0642\u0637': 'only',
  '\u062C\u062F\u0627': 'very', '\u0634\u0643\u0631\u0627': 'thank you',
  '\u0645\u0631\u062D\u0628\u0627': 'hello', '\u0645\u0639 \u0627\u0644\u0633\u0644\u0627\u0645\u0629': 'goodbye',
}

const DICTIONARIES: Record<string, Record<string, string>> = {
  es: SPANISH,
  fr: FRENCH,
  de: GERMAN,
  ar: ARABIC,
}

/**
 * Look up a word in the mini dictionary.
 * Returns the English translation or undefined.
 */
export function lookupWord(word: string, targetLang: string): string | undefined {
  const dict = DICTIONARIES[targetLang]
  if (!dict) return undefined
  // Try exact, then lowercase
  return dict[word] ?? dict[word.toLowerCase()] ?? undefined
}

/**
 * Check if we have a dictionary for the given language.
 */
export function hasDictionary(langCode: string): boolean {
  return langCode in DICTIONARIES
}

/**
 * Get all entries for a language (for debugging / admin).
 */
export function getDictEntries(langCode: string): [string, string][] {
  const dict = DICTIONARIES[langCode]
  if (!dict) return []
  return Object.entries(dict)
}
