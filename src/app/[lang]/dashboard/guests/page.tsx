import { getDictionary } from '@/lib/get-dictionary'
import type { Locale } from '@/config/i18n-config'
import { GuestsManagement } from '@/components/guests-management'

export default async function GuestsPage({ params: { lang } }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(lang)
    return <GuestsManagement dictionary={dictionary} lang={lang} />
}
