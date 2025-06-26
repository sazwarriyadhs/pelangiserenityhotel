
import { getDictionary } from '@/lib/get-dictionary'
import type { Locale } from '@/config/i18n-config'
import { OrdersManagement } from '@/components/restaurant/orders-management'

export default async function OrdersManagementPage({ params: { lang } }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(lang)
    return <OrdersManagement dictionary={dictionary} lang={lang} />
}
