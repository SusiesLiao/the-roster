import { createContext, useContext, useMemo, useState } from 'react'
import { translations } from './translations.js'

export const LANGUAGE_KEY = 'roster-public-language-v1'
export const LANGUAGES = ['en', 'zh-Hans', 'zh-Hant']
const LanguageContext = createContext(null)

export function translate(value, language) {
  if (typeof value !== 'string' || language === 'en') return value
  return translations[language]?.[value.trim()] ?? value
}

export function LanguageProvider({ children }) {
  const [language, updateLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_KEY)
      return LANGUAGES.includes(saved) ? saved : 'en'
    } catch { return 'en' }
  })
  const value = useMemo(() => ({
    language,
    setLanguage(next) {
      if (!LANGUAGES.includes(next)) return
      updateLanguage(next)
      try { localStorage.setItem(LANGUAGE_KEY, next) } catch { /* Works without persistence. */ }
    },
    t: text => translate(text, language),
  }), [language])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() { return useContext(LanguageContext) }
export function useT() { return useLanguage().t }
