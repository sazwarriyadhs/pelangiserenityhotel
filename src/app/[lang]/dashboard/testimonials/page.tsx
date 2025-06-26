
import { getDictionary } from '@/lib/get-dictionary'
import type { Locale } from '@/config/i18n-config'
import { TestimonialsManagement } from '@/components/testimonials-management'

export default async function TestimonialsPage({ params: { lang } }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(lang)
    return <TestimonialsManagement dictionary={dictionary} lang={lang} />
}
