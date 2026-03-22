/**
 * Starter words added after onboarding to give users immediate material.
 * 10 words per language: greeting, goodbye, yes, no, please, thank you, numbers 1-3, sorry.
 * These words are orbit 1 (core vocabulary) with mixed planet assignments.
 */

export interface StarterWord {
  lemma: string
  translation: string
  pronunciation?: string
  planet: string
  orbit: number
}

const STARTER_WORDS: Record<string, StarterWord[]> = {
  es: [
    { lemma: 'Adios', translation: 'Goodbye', planet: 'daily', orbit: 1 },
    { lemma: 'Si', translation: 'Yes', planet: 'daily', orbit: 1 },
    { lemma: 'No', translation: 'No', planet: 'daily', orbit: 1 },
    { lemma: 'Por favor', translation: 'Please', planet: 'daily', orbit: 1 },
    { lemma: 'Gracias', translation: 'Thank you', planet: 'daily', orbit: 1 },
    { lemma: 'Uno', translation: 'One', planet: 'education', orbit: 1 },
    { lemma: 'Dos', translation: 'Two', planet: 'education', orbit: 1 },
    { lemma: 'Tres', translation: 'Three', planet: 'education', orbit: 1 },
    { lemma: 'Perdona', translation: 'Sorry', planet: 'emotions', orbit: 1 },
    { lemma: 'Agua', translation: 'Water', planet: 'food', orbit: 1 },
  ],
  fr: [
    { lemma: 'Au revoir', translation: 'Goodbye', planet: 'daily', orbit: 1 },
    { lemma: 'Oui', translation: 'Yes', planet: 'daily', orbit: 1 },
    { lemma: 'Non', translation: 'No', planet: 'daily', orbit: 1 },
    { lemma: "S'il vous plait", translation: 'Please', planet: 'daily', orbit: 1 },
    { lemma: 'Merci', translation: 'Thank you', planet: 'daily', orbit: 1 },
    { lemma: 'Un', translation: 'One', planet: 'education', orbit: 1 },
    { lemma: 'Deux', translation: 'Two', planet: 'education', orbit: 1 },
    { lemma: 'Trois', translation: 'Three', planet: 'education', orbit: 1 },
    { lemma: 'Pardon', translation: 'Sorry', planet: 'emotions', orbit: 1 },
    { lemma: 'Eau', translation: 'Water', planet: 'food', orbit: 1 },
  ],
  de: [
    { lemma: 'Tschuss', translation: 'Goodbye', planet: 'daily', orbit: 1 },
    { lemma: 'Ja', translation: 'Yes', planet: 'daily', orbit: 1 },
    { lemma: 'Nein', translation: 'No', planet: 'daily', orbit: 1 },
    { lemma: 'Bitte', translation: 'Please', planet: 'daily', orbit: 1 },
    { lemma: 'Danke', translation: 'Thank you', planet: 'daily', orbit: 1 },
    { lemma: 'Eins', translation: 'One', planet: 'education', orbit: 1 },
    { lemma: 'Zwei', translation: 'Two', planet: 'education', orbit: 1 },
    { lemma: 'Drei', translation: 'Three', planet: 'education', orbit: 1 },
    { lemma: 'Entschuldigung', translation: 'Sorry', planet: 'emotions', orbit: 1 },
    { lemma: 'Wasser', translation: 'Water', planet: 'food', orbit: 1 },
  ],
  ar: [
    { lemma: '\u0645\u0639 \u0627\u0644\u0633\u0644\u0627\u0645\u0629', translation: 'Goodbye', pronunciation: 'ma\'a salama', planet: 'daily', orbit: 1 },
    { lemma: '\u0646\u0639\u0645', translation: 'Yes', pronunciation: 'na\'am', planet: 'daily', orbit: 1 },
    { lemma: '\u0644\u0627', translation: 'No', pronunciation: 'la', planet: 'daily', orbit: 1 },
    { lemma: '\u0645\u0646 \u0641\u0636\u0644\u0643', translation: 'Please', pronunciation: 'min fadlak', planet: 'daily', orbit: 1 },
    { lemma: '\u0634\u0643\u0631\u0627', translation: 'Thank you', pronunciation: 'shukran', planet: 'daily', orbit: 1 },
    { lemma: '\u0648\u0627\u062D\u062F', translation: 'One', pronunciation: 'wahid', planet: 'education', orbit: 1 },
    { lemma: '\u0627\u062B\u0646\u0627\u0646', translation: 'Two', pronunciation: 'ithnan', planet: 'education', orbit: 1 },
    { lemma: '\u062B\u0644\u0627\u062B\u0629', translation: 'Three', pronunciation: 'thalatha', planet: 'education', orbit: 1 },
    { lemma: '\u0622\u0633\u0641', translation: 'Sorry', pronunciation: 'asif', planet: 'emotions', orbit: 1 },
    { lemma: '\u0645\u0627\u0621', translation: 'Water', pronunciation: 'maa\'', planet: 'food', orbit: 1 },
  ],
  ja: [
    { lemma: '\u3055\u3088\u3046\u306A\u3089', translation: 'Goodbye', pronunciation: 'sayounara', planet: 'daily', orbit: 1 },
    { lemma: '\u306F\u3044', translation: 'Yes', pronunciation: 'hai', planet: 'daily', orbit: 1 },
    { lemma: '\u3044\u3044\u3048', translation: 'No', pronunciation: 'iie', planet: 'daily', orbit: 1 },
    { lemma: '\u304A\u306D\u304C\u3044\u3057\u307E\u3059', translation: 'Please', pronunciation: 'onegaishimasu', planet: 'daily', orbit: 1 },
    { lemma: '\u3042\u308A\u304C\u3068\u3046', translation: 'Thank you', pronunciation: 'arigatou', planet: 'daily', orbit: 1 },
    { lemma: '\u4E00', translation: 'One', pronunciation: 'ichi', planet: 'education', orbit: 1 },
    { lemma: '\u4E8C', translation: 'Two', pronunciation: 'ni', planet: 'education', orbit: 1 },
    { lemma: '\u4E09', translation: 'Three', pronunciation: 'san', planet: 'education', orbit: 1 },
    { lemma: '\u3054\u3081\u3093\u306A\u3055\u3044', translation: 'Sorry', pronunciation: 'gomen nasai', planet: 'emotions', orbit: 1 },
    { lemma: '\u6C34', translation: 'Water', pronunciation: 'mizu', planet: 'food', orbit: 1 },
  ],
  ko: [
    { lemma: '\uC548\uB155\uD788 \uAC00\uC138\uC694', translation: 'Goodbye', pronunciation: 'annyeonghi gaseyo', planet: 'daily', orbit: 1 },
    { lemma: '\uB124', translation: 'Yes', pronunciation: 'ne', planet: 'daily', orbit: 1 },
    { lemma: '\uC544\uB2C8\uC694', translation: 'No', pronunciation: 'aniyo', planet: 'daily', orbit: 1 },
    { lemma: '\uC81C\uBC1C', translation: 'Please', pronunciation: 'jebal', planet: 'daily', orbit: 1 },
    { lemma: '\uAC10\uC0AC\uD569\uB2C8\uB2E4', translation: 'Thank you', pronunciation: 'gamsahamnida', planet: 'daily', orbit: 1 },
    { lemma: '\uD558\uB098', translation: 'One', pronunciation: 'hana', planet: 'education', orbit: 1 },
    { lemma: '\uB458', translation: 'Two', pronunciation: 'dul', planet: 'education', orbit: 1 },
    { lemma: '\uC14B', translation: 'Three', pronunciation: 'set', planet: 'education', orbit: 1 },
    { lemma: '\uBBF8\uC548\uD569\uB2C8\uB2E4', translation: 'Sorry', pronunciation: 'mianhamnida', planet: 'emotions', orbit: 1 },
    { lemma: '\uBB3C', translation: 'Water', pronunciation: 'mul', planet: 'food', orbit: 1 },
  ],
  zh: [
    { lemma: '\u518D\u89C1', translation: 'Goodbye', pronunciation: 'zaijian', planet: 'daily', orbit: 1 },
    { lemma: '\u662F', translation: 'Yes', pronunciation: 'shi', planet: 'daily', orbit: 1 },
    { lemma: '\u4E0D\u662F', translation: 'No', pronunciation: 'bu shi', planet: 'daily', orbit: 1 },
    { lemma: '\u8BF7', translation: 'Please', pronunciation: 'qing', planet: 'daily', orbit: 1 },
    { lemma: '\u8C22\u8C22', translation: 'Thank you', pronunciation: 'xiexie', planet: 'daily', orbit: 1 },
    { lemma: '\u4E00', translation: 'One', pronunciation: 'yi', planet: 'education', orbit: 1 },
    { lemma: '\u4E8C', translation: 'Two', pronunciation: 'er', planet: 'education', orbit: 1 },
    { lemma: '\u4E09', translation: 'Three', pronunciation: 'san', planet: 'education', orbit: 1 },
    { lemma: '\u5BF9\u4E0D\u8D77', translation: 'Sorry', pronunciation: 'duibuqi', planet: 'emotions', orbit: 1 },
    { lemma: '\u6C34', translation: 'Water', pronunciation: 'shui', planet: 'food', orbit: 1 },
  ],
  it: [
    { lemma: 'Arrivederci', translation: 'Goodbye', planet: 'daily', orbit: 1 },
    { lemma: 'Si', translation: 'Yes', planet: 'daily', orbit: 1 },
    { lemma: 'No', translation: 'No', planet: 'daily', orbit: 1 },
    { lemma: 'Per favore', translation: 'Please', planet: 'daily', orbit: 1 },
    { lemma: 'Grazie', translation: 'Thank you', planet: 'daily', orbit: 1 },
    { lemma: 'Uno', translation: 'One', planet: 'education', orbit: 1 },
    { lemma: 'Due', translation: 'Two', planet: 'education', orbit: 1 },
    { lemma: 'Tre', translation: 'Three', planet: 'education', orbit: 1 },
    { lemma: 'Scusa', translation: 'Sorry', planet: 'emotions', orbit: 1 },
    { lemma: 'Acqua', translation: 'Water', planet: 'food', orbit: 1 },
  ],
  pt: [
    { lemma: 'Tchau', translation: 'Goodbye', planet: 'daily', orbit: 1 },
    { lemma: 'Sim', translation: 'Yes', planet: 'daily', orbit: 1 },
    { lemma: 'Nao', translation: 'No', planet: 'daily', orbit: 1 },
    { lemma: 'Por favor', translation: 'Please', planet: 'daily', orbit: 1 },
    { lemma: 'Obrigado', translation: 'Thank you', planet: 'daily', orbit: 1 },
    { lemma: 'Um', translation: 'One', planet: 'education', orbit: 1 },
    { lemma: 'Dois', translation: 'Two', planet: 'education', orbit: 1 },
    { lemma: 'Tres', translation: 'Three', planet: 'education', orbit: 1 },
    { lemma: 'Desculpa', translation: 'Sorry', planet: 'emotions', orbit: 1 },
    { lemma: 'Agua', translation: 'Water', planet: 'food', orbit: 1 },
  ],
  ru: [
    { lemma: '\u0414\u043E \u0441\u0432\u0438\u0434\u0430\u043D\u0438\u044F', translation: 'Goodbye', pronunciation: 'do svidaniya', planet: 'daily', orbit: 1 },
    { lemma: '\u0414\u0430', translation: 'Yes', pronunciation: 'da', planet: 'daily', orbit: 1 },
    { lemma: '\u041D\u0435\u0442', translation: 'No', pronunciation: 'nyet', planet: 'daily', orbit: 1 },
    { lemma: '\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430', translation: 'Please', pronunciation: 'pozhaluysta', planet: 'daily', orbit: 1 },
    { lemma: '\u0421\u043F\u0430\u0441\u0438\u0431\u043E', translation: 'Thank you', pronunciation: 'spasibo', planet: 'daily', orbit: 1 },
    { lemma: '\u041E\u0434\u0438\u043D', translation: 'One', pronunciation: 'odin', planet: 'education', orbit: 1 },
    { lemma: '\u0414\u0432\u0430', translation: 'Two', pronunciation: 'dva', planet: 'education', orbit: 1 },
    { lemma: '\u0422\u0440\u0438', translation: 'Three', pronunciation: 'tri', planet: 'education', orbit: 1 },
    { lemma: '\u0418\u0437\u0432\u0438\u043D\u0438\u0442\u0435', translation: 'Sorry', pronunciation: 'izvinite', planet: 'emotions', orbit: 1 },
    { lemma: '\u0412\u043E\u0434\u0430', translation: 'Water', pronunciation: 'voda', planet: 'food', orbit: 1 },
  ],
  tr: [
    { lemma: 'Hosca kal', translation: 'Goodbye', planet: 'daily', orbit: 1 },
    { lemma: 'Evet', translation: 'Yes', planet: 'daily', orbit: 1 },
    { lemma: 'Hayir', translation: 'No', planet: 'daily', orbit: 1 },
    { lemma: 'Lutfen', translation: 'Please', planet: 'daily', orbit: 1 },
    { lemma: 'Tesekkurler', translation: 'Thank you', planet: 'daily', orbit: 1 },
    { lemma: 'Bir', translation: 'One', planet: 'education', orbit: 1 },
    { lemma: 'Iki', translation: 'Two', planet: 'education', orbit: 1 },
    { lemma: 'Uc', translation: 'Three', planet: 'education', orbit: 1 },
    { lemma: 'Ozur dilerim', translation: 'Sorry', planet: 'emotions', orbit: 1 },
    { lemma: 'Su', translation: 'Water', planet: 'food', orbit: 1 },
  ],
  nl: [
    { lemma: 'Tot ziens', translation: 'Goodbye', planet: 'daily', orbit: 1 },
    { lemma: 'Ja', translation: 'Yes', planet: 'daily', orbit: 1 },
    { lemma: 'Nee', translation: 'No', planet: 'daily', orbit: 1 },
    { lemma: 'Alstublieft', translation: 'Please', planet: 'daily', orbit: 1 },
    { lemma: 'Dank u', translation: 'Thank you', planet: 'daily', orbit: 1 },
    { lemma: 'Een', translation: 'One', planet: 'education', orbit: 1 },
    { lemma: 'Twee', translation: 'Two', planet: 'education', orbit: 1 },
    { lemma: 'Drie', translation: 'Three', planet: 'education', orbit: 1 },
    { lemma: 'Sorry', translation: 'Sorry', planet: 'emotions', orbit: 1 },
    { lemma: 'Water', translation: 'Water', planet: 'food', orbit: 1 },
  ],
}

export function getStarterWords(langCode: string): StarterWord[] {
  return STARTER_WORDS[langCode] ?? STARTER_WORDS.es ?? []
}
