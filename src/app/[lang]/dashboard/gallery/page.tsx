
import { getDictionary } from '@/lib/get-dictionary'
import type { Locale } from '@/config/i18n-config'
import { GalleryManagement } from '@/components/gallery-management'

export default async function GalleryPage({ params: { lang } }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(lang)
    return <GalleryManagement dictionary={dictionary} lang={lang} />
}
