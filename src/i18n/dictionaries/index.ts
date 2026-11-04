import type { Locale } from '../config'
import { type Dictionary, en } from './en'
import { ro } from './ro'

export type { Dictionary }

const dictionaries: Record<Locale, Dictionary> = { en, ro }

export function getDictionary(lang: Locale): Dictionary {
  return dictionaries[lang] ?? en
}
