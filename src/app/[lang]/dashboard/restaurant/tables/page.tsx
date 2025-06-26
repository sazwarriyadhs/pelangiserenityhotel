
import { getDictionary } from '@/lib/get-dictionary'
import type { Locale } from '@/config/i18n-config'
import { TableManagement } from '@/components/restaurant/table-management'

export default async function TableManagementPage({ params: { lang } }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(lang)
    return <TableManagement dictionary={dictionary} lang={lang} />
}
