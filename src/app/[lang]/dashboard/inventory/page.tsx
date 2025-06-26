
import { getDictionary } from '@/lib/get-dictionary'
import type { Locale } from '@/config/i18n-config'
import { InventoryManagement } from '@/components/inventory-management'

export default async function InventoryPage({ params: { lang } }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(lang)
    return <InventoryManagement dictionary={dictionary} lang={lang} />
}
