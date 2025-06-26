import { getDictionary } from '@/lib/get-dictionary'
import type { Locale } from '@/config/i18n-config'
import { ProtectedDashboard } from '@/components/protected-dashboard'

export default async function DashboardPage({ params: { lang } }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(lang)
    return <ProtectedDashboard dictionary={dictionary} lang={lang} />
}
