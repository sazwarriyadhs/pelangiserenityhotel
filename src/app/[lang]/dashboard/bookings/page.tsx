import { getDictionary } from '@/lib/get-dictionary'
import type { Locale } from '@/config/i18n-config'
import { BookingsManagement } from '@/components/bookings-management'

export default async function BookingsPage({ params: { lang } }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(lang)
    return <BookingsManagement dictionary={dictionary} lang={lang} />
}
