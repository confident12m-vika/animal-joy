import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { translateText } from '../lib/translate.js'

// Shared logic for the "Translate" button used on admin-authored content
// (articles, jokes, site text) that's only written in English for now.
// `fields` is an object like { title: '...', excerpt: '...' } in English.
// Returns the fields to display (translated or original) plus button state.
export function useOnDemandTranslate(fields) {
  const { i18n } = useTranslation()
  const [translated, setTranslated] = useState(null)
  const [translating, setTranslating] = useState(false)
  const [error, setError] = useState('')

  const isEnglish = i18n.language === 'en'
  // Identifies which piece of content this is, so we know when to reset
  // (e.g. Surprise Me showing a new random item should not keep showing
  // the previous item's translation).
  const contentKey = Object.values(fields).join('|')

  useEffect(() => {
    setTranslated(null)
    setError('')
  }, [contentKey])

  const toggle = async () => {
    if (translated) {
      setTranslated(null)
      return
    }
    setTranslating(true)
    setError('')
    try {
      const keys = Object.keys(fields)
      const results = await Promise.all(keys.map((k) => translateText(fields[k], i18n.language)))
      const next = {}
      keys.forEach((k, i) => (next[k] = results[i]))
      setTranslated(next)
    } catch {
      setError('Translation unavailable right now.')
    }
    setTranslating(false)
  }

  return {
    shown: translated || fields,
    translated: Boolean(translated),
    translating,
    error,
    toggle,
    // The button only makes sense when viewing in a non-English language.
    show: !isEnglish,
  }
}
