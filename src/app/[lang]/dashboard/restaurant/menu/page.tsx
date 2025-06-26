
import { getDictionary } from '@/lib/get-dictionary'
import type { Locale } from '@/config/i18n-config'
import { MenuManagement } from '@/components/restaurant/menu-management'

export default async function MenuManagementPage({ params: { lang } }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(lang)
    return <MenuManagement dictionary={dictionary} lang={lang} />
}
