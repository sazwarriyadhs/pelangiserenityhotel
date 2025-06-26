import { getDictionary } from '@/lib/get-dictionary'
import type { Locale } from '@/config/i18n-config'
import { OtaManagement } from '@/components/ota-management'

export default async function OtaIntegrationsPage({ params: { lang } }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(lang)
    return <OtaManagement dictionary={dictionary} lang={lang} />
}
