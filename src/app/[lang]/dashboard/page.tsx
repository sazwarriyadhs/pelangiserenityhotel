import { getDictionary } from '@/lib/get-dictionary'
import type { Locale } from '@/config/i18n-config'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { DashboardContent } from '@/components/dashboard-content'

export default async function DashboardPage({ params: { lang } }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(lang)

    return (
        <div className="flex flex-col min-h-dvh bg-background font-body">
            <Header lang={lang} dictionary={dictionary} />
            <DashboardContent dictionary={dictionary} />
            <Footer dictionary={dictionary.footer} />
        </div>
    )
}
