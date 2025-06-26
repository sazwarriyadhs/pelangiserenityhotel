import { getDictionary } from '@/lib/get-dictionary'
import type { Locale } from '@/config/i18n-config'
import { SettingsManagement } from '@/components/settings-management'

export default async function SettingsPage({ params: { lang } }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(lang)
    return <SettingsManagement dictionary={dictionary} lang={lang} />
}
