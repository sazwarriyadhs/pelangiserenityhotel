import { getDictionary } from '@/lib/get-dictionary'
import type { Locale } from '@/config/i18n-config'
import { HousekeepingManagement } from '@/components/housekeeping-management'

export default async function HousekeepingPage({ params: { lang } }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(lang)
    return <HousekeepingManagement dictionary={dictionary} lang={lang} />
}
