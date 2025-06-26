
import { getDictionary } from '@/lib/get-dictionary'
import type { Locale } from '@/config/i18n-config'
import { WebsiteManagement } from '@/components/website-management'

export default async function WebsitePage({ params: { lang } }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(lang)
    return <WebsiteManagement dictionary={dictionary} lang={lang} />
}
