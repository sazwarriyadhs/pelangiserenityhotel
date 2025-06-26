import { getDictionary } from '@/lib/get-dictionary'
import type { Locale } from '@/config/i18n-config'
import { StaffManagement } from '@/components/staff-management'

export default async function StaffPage({ params: { lang } }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(lang)
    return <StaffManagement dictionary={dictionary} lang={lang} />
}
