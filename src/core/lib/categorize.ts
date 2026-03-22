/**
 * Word-to-planet categorizer.
 * Uses keyword matching to assign a planet/category to newly added words.
 */

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  food: [
    'eat', 'drink', 'food', 'water', 'bread', 'meat', 'fish', 'fruit', 'vegetable',
    'rice', 'milk', 'coffee', 'tea', 'beer', 'wine', 'sugar', 'salt', 'cook',
    'restaurant', 'breakfast', 'lunch', 'dinner', 'hungry', 'thirsty', 'meal',
    'apple', 'chicken', 'egg', 'cheese', 'soup', 'cake', 'pizza', 'mango',
    // Spanish
    'comer', 'beber', 'comida', 'agua', 'pan', 'carne', 'pescado', 'fruta',
    'arroz', 'leche', 'cafe', 'cerveza', 'vino', 'cocinar', 'hambre',
    // French
    'manger', 'boire', 'nourriture', 'pain', 'viande', 'poisson',
    'lait', 'vin', 'beurre', 'fromage',
    // German
    'essen', 'trinken', 'Brot', 'Fleisch', 'Fisch', 'Milch', 'Kaffee', 'Wasser',
  ],
  travel: [
    'go', 'come', 'travel', 'road', 'car', 'bus', 'train', 'plane', 'airport',
    'hotel', 'city', 'country', 'map', 'ticket', 'passport', 'station', 'drive',
    'fly', 'arrive', 'leave', 'north', 'south', 'east', 'west', 'street',
    // Spanish
    'ir', 'venir', 'viajar', 'coche', 'tren', 'avion', 'ciudad', 'pais',
    'calle', 'camino', 'llegar', 'salir',
    // French
    'aller', 'venir', 'voyager', 'voiture', 'avion', 'ville', 'pays', 'rue',
    // German
    'gehen', 'kommen', 'reisen', 'Auto', 'Zug', 'Flugzeug', 'Stadt', 'Land',
  ],
  family: [
    'mother', 'father', 'sister', 'brother', 'son', 'daughter', 'baby', 'child',
    'family', 'parent', 'husband', 'wife', 'friend', 'love', 'marry', 'wedding',
    'grandmother', 'grandfather', 'aunt', 'uncle', 'cousin',
    // Spanish
    'madre', 'padre', 'hermano', 'hermana', 'hijo', 'hija', 'familia', 'amigo',
    'esposo', 'esposa', 'abuelo', 'abuela', 'bebe', 'nino',
    // French
    'mere', 'pere', 'frere', 'soeur', 'fils', 'fille', 'famille', 'ami',
    'mari', 'femme', 'enfant',
    // German
    'Mutter', 'Vater', 'Bruder', 'Schwester', 'Sohn', 'Tochter', 'Familie',
    'Freund', 'Kind',
  ],
  nature: [
    'tree', 'flower', 'mountain', 'river', 'sea', 'ocean', 'sky', 'sun', 'moon',
    'star', 'rain', 'snow', 'wind', 'cloud', 'forest', 'garden', 'animal', 'bird',
    'dog', 'cat', 'fish', 'earth', 'weather', 'hot', 'cold', 'warm',
    // Spanish
    'arbol', 'flor', 'montana', 'rio', 'mar', 'cielo', 'sol', 'luna',
    'lluvia', 'nieve', 'viento', 'bosque', 'perro', 'gato', 'tierra',
    // French
    'arbre', 'fleur', 'montagne', 'riviere', 'mer', 'ciel', 'soleil', 'lune',
    'pluie', 'neige', 'vent', 'chien', 'chat',
    // German
    'Baum', 'Blume', 'Berg', 'Fluss', 'Meer', 'Himmel', 'Sonne', 'Mond',
    'Regen', 'Schnee', 'Wind', 'Hund', 'Katze',
  ],
  work: [
    'work', 'office', 'job', 'money', 'business', 'company', 'boss', 'meeting',
    'email', 'phone', 'computer', 'buy', 'sell', 'pay', 'price', 'bank',
    'market', 'shop', 'store',
    // Spanish
    'trabajo', 'oficina', 'dinero', 'empresa', 'comprar', 'vender', 'pagar',
    'precio', 'tienda', 'mercado',
    // French
    'travail', 'bureau', 'argent', 'entreprise', 'acheter', 'vendre', 'payer',
    // German
    'Arbeit', 'Buro', 'Geld', 'kaufen', 'verkaufen', 'bezahlen', 'Laden',
  ],
  body: [
    'head', 'hand', 'eye', 'mouth', 'heart', 'body', 'leg', 'arm', 'foot',
    'face', 'nose', 'ear', 'hair', 'tooth', 'finger', 'blood', 'sick', 'pain',
    'doctor', 'hospital', 'medicine', 'health', 'sleep', 'tired',
    // Spanish
    'cabeza', 'mano', 'ojo', 'boca', 'corazon', 'cuerpo', 'pierna', 'brazo',
    'pie', 'cara', 'nariz', 'diente', 'sangre', 'enfermo', 'dormir',
    // French
    'tete', 'main', 'oeil', 'bouche', 'coeur', 'corps', 'jambe', 'bras',
    'pied', 'visage', 'nez', 'dent', 'malade', 'dormir',
    // German
    'Kopf', 'Hand', 'Auge', 'Mund', 'Herz', 'Korper', 'Bein', 'Arm',
    'Fuss', 'Nase', 'Ohr', 'Zahn', 'krank', 'schlafen',
  ],
  emotions: [
    'happy', 'sad', 'angry', 'afraid', 'love', 'hate', 'hope', 'fear',
    'laugh', 'cry', 'smile', 'feel', 'think', 'believe', 'dream', 'want',
    'need', 'like', 'sorry', 'please', 'thank', 'joy', 'peace',
    // Spanish
    'feliz', 'triste', 'enojado', 'miedo', 'amor', 'odio', 'esperanza',
    'reir', 'llorar', 'sentir', 'pensar', 'creer', 'sonar', 'querer',
    // French
    'heureux', 'triste', 'peur', 'amour', 'rire', 'pleurer', 'sentir',
    'penser', 'croire', 'rever', 'aimer',
    // German
    'glucklich', 'traurig', 'Angst', 'Liebe', 'lachen', 'weinen',
    'fuhlen', 'denken', 'glauben', 'traumen', 'wollen',
  ],
  home: [
    'house', 'room', 'door', 'window', 'bed', 'table', 'chair', 'kitchen',
    'bathroom', 'garden', 'floor', 'wall', 'roof', 'key', 'light', 'clean',
    // Spanish
    'casa', 'habitacion', 'puerta', 'ventana', 'cama', 'mesa', 'silla',
    'cocina', 'bano', 'jardin', 'piso', 'pared', 'techo', 'llave', 'luz',
    // French
    'maison', 'chambre', 'porte', 'fenetre', 'lit', 'table', 'chaise',
    'cuisine', 'salle', 'jardin', 'mur', 'cle', 'lumiere',
    // German
    'Haus', 'Zimmer', 'Tur', 'Fenster', 'Bett', 'Tisch', 'Stuhl',
    'Kuche', 'Bad', 'Garten', 'Wand', 'Dach', 'Schlussel', 'Licht',
  ],
  education: [
    'book', 'read', 'write', 'learn', 'teach', 'school', 'student', 'teacher',
    'class', 'study', 'number', 'word', 'language', 'speak', 'listen',
    'understand', 'know', 'question', 'answer', 'test', 'one', 'two', 'three',
    // Spanish
    'libro', 'leer', 'escribir', 'aprender', 'escuela', 'estudiante',
    'clase', 'estudiar', 'numero', 'palabra', 'idioma', 'hablar', 'escuchar',
    // French
    'livre', 'lire', 'ecrire', 'apprendre', 'ecole', 'etudiant',
    'classe', 'etudier', 'mot', 'langue', 'parler', 'ecouter',
    // German
    'Buch', 'lesen', 'schreiben', 'lernen', 'Schule', 'Student',
    'Klasse', 'Wort', 'Sprache', 'sprechen', 'horen', 'verstehen',
  ],
}

// Build a reverse lookup: word -> planet
const WORD_TO_PLANET = new Map<string, string>()
for (const [planet, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
  for (const kw of keywords) {
    WORD_TO_PLANET.set(kw.toLowerCase(), planet)
  }
}

/**
 * Try to determine the best planet for a word based on its lemma and translation.
 * Returns a planet ID or 'daily' as fallback.
 */
export function categorizeWord(lemma: string, translation: string): string {
  const lemmaLower = lemma.toLowerCase()
  const transLower = translation.toLowerCase()

  // Check lemma first
  if (WORD_TO_PLANET.has(lemmaLower)) return WORD_TO_PLANET.get(lemmaLower)!

  // Check each word in translation
  const transWords = transLower.split(/[\s/(),]+/).filter(Boolean)
  for (const tw of transWords) {
    if (WORD_TO_PLANET.has(tw)) return WORD_TO_PLANET.get(tw)!
  }

  // Check if lemma contains any keyword
  for (const [word, planet] of WORD_TO_PLANET) {
    if (lemmaLower.includes(word) || transLower.includes(word)) return planet
  }

  return 'daily'
}
