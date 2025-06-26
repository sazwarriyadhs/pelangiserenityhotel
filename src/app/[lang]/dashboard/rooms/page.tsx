
import { getDictionary } from '@/lib/get-dictionary'
import type { Locale } from '@/config/i18n-config'
import { RoomsManagement } from '@/components/rooms-management'

export default async function RoomsPage({ params: { lang } }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(lang)
    return <RoomsManagement dictionary={dictionary} lang={lang} />
}
