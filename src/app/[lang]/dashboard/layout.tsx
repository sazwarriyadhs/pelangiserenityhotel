import { getDictionary } from '@/lib/get-dictionary'
import type { Locale } from '@/config/i18n-config'
import { DashboardHeader } from '@/components/dashboard-header'

export default async function DashboardLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode,
  params: { lang: Locale },
}) {
  const dictionary = await getDictionary(lang)

  return (
    <div className="flex flex-col min-h-dvh bg-background font-body">
      <DashboardHeader lang={lang} dictionary={dictionary} />
      {children}
    </div>
  )
}
