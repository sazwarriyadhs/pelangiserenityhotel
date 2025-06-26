
import { getDictionary } from '@/lib/get-dictionary'
import type { Locale } from '@/config/i18n-config'
import { DashboardHeader } from '@/components/dashboard-header'
import { DashboardSidebar } from '@/components/dashboard-sidebar'

export default async function DashboardLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode,
  params: { lang: Locale },
}) {
  const dictionary = await getDictionary(lang)

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <DashboardSidebar dictionary={dictionary.dashboard.sidebar} lang={lang} />
        <div className="flex flex-col">
            <DashboardHeader lang={lang} dictionary={dictionary} />
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto">
                {children}
            </main>
        </div>
    </div>
  )
}
