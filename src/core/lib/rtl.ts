/**
 * RTL (right-to-left) language detection utility.
 */

const RTL_LANGUAGES = new Set(['ar', 'he', 'fa', 'ur', 'ps', 'yi', 'ku'])

/** Returns true if the language code is RTL */
export function isRTL(langCode: string): boolean {
  return RTL_LANGUAGES.has(langCode)
}

/** Returns 'rtl' or 'ltr' based on language code */
export function getDir(langCode: string): 'rtl' | 'ltr' {
  return isRTL(langCode) ? 'rtl' : 'ltr'
}
