import 'server-only'
import type { Locale } from '@/config/i18n-config'

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  id: () => import('@/dictionaries/id.json').then((module) => module.default),
}

export const getDictionary = async (locale: Locale) => {
    return locale === 'id' ? dictionaries.id() : dictionaries.en()
}
