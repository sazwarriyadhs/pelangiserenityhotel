
import { getDictionary } from '@/lib/get-dictionary'
import type { Locale } from '@/config/i18n-config'
import { RestaurantAnalytics } from '@/components/restaurant/analytics'

export default async function RestaurantAnalyticsPage({ params: { lang } }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(lang)
    return <RestaurantAnalytics dictionary={dictionary} lang={lang} />
}
