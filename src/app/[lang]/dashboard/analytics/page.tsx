import { getDictionary } from '@/lib/get-dictionary'
import type { Locale } from '@/config/i18n-config'
import { AnalyticsManagement } from '@/components/analytics-management'

export default async function AnalyticsPage({ params: { lang } }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(lang)
    return <AnalyticsManagement dictionary={dictionary} lang={lang} />
}
