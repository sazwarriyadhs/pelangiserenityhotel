import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { RoomShowcase } from '@/components/room-showcase';
import { BookingForm } from '@/components/booking-form';
import { AiConcierge } from '@/components/ai-concierge';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getDictionary } from '@/lib/get-dictionary'
import type { Locale } from '@/config/i18n-config'
import { FeaturedHighlights } from '@/components/featured-highlights';

export default async function Home({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang)

  return (
    <div className="flex flex-col min-h-dvh bg-background font-body">
      <Header lang={lang} dictionary={dictionary} />
      <main className="flex-1">
        <section className="relative h-[70vh] w-full flex items-center justify-center text-center text-foreground overflow-hidden">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <Image
            src="https://placehold.co/1920x1080.png"
            alt="Luxury hotel lobby with a grand chandelier"
            data-ai-hint="luxury hotel"
            fill
            className="object-cover"
            priority
          />
          <div className="relative z-20 flex flex-col items-center gap-6 p-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl font-headline text-primary">
              {dictionary.hero.title}
            </h1>
            <p className="max-w-2xl text-lg text-destructive-foreground/90 md:text-xl">
              {dictionary.hero.subtitle}
            </p>
            <Button asChild size="lg" className="mt-4 transition-transform duration-300 hover:scale-105">
              <Link href="#booking">{dictionary.hero.button}</Link>
            </Button>
          </div>
        </section>

        <section id="features" className="py-16 md:py-24 lg:py-32 bg-background">
          <FeaturedHighlights dictionary={dictionary.highlights} />
        </section>

        <section id="rooms" className="py-16 md:py-24 lg:py-32">
          <div className="container">
            <RoomShowcase dictionary={dictionary.rooms} />
          </div>
        </section>

        <section className="w-full py-16 md:py-24 lg:py-32 bg-black border-y border-primary/20">
          <div className="container grid items-start gap-16 lg:grid-cols-2 lg:gap-24">
            <div id="booking" className="flex flex-col gap-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline text-primary">{dictionary.booking.title}</h2>
                <p className="text-muted-foreground">{dictionary.booking.subtitle}</p>
                <BookingForm dictionary={dictionary.booking} />
            </div>
            <div id="concierge" className="flex flex-col gap-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline text-primary">{dictionary.concierge.title}</h2>
                <p className="text-muted-foreground">{dictionary.concierge.subtitle}</p>
                <AiConcierge dictionary={dictionary.concierge} lang={lang}/>
            </div>
          </div>
        </section>
      </main>
      <Footer dictionary={dictionary.footer} />
    </div>
  );
}
