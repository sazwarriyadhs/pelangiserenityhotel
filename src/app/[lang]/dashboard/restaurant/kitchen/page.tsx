
import { getDictionary } from '@/lib/get-dictionary'
import type { Locale } from '@/config/i18n-config'
import { KitchenDisplay } from '@/components/restaurant/kitchen-display'

export default async function KitchenDisplayPage({ params: { lang } }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(lang)
    return <KitchenDisplay dictionary={dictionary} lang={lang} />
}
