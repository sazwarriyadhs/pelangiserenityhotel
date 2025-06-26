import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getDictionary } from '@/lib/get-dictionary'
import type { Locale } from '@/config/i18n-config'
import { MenuShowcase } from '@/components/restaurant/menu-showcase';

export default async function RestaurantPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang)

  return (
    <div className="flex flex-col min-h-dvh bg-background font-body">
      <Header lang={lang} dictionary={dictionary} />
      <main className="flex-1 py-16 md:py-24 lg:py-32">
        <MenuShowcase dictionary={dictionary} />
      </main>
      <Footer dictionary={dictionary.footer} />
    </div>
  );
}
