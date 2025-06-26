import { getDictionary } from '@/lib/get-dictionary'
import type { Locale } from '@/config/i18n-config'
import { PaymentsManagement } from '@/components/payments-management'

export default async function PaymentsPage({ params: { lang } }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(lang)
    return <PaymentsManagement dictionary={dictionary} lang={lang} />
}
