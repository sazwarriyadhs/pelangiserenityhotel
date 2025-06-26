import { Hotel } from "lucide-react";
import Link from "next/link";
import { LocaleSwitcher } from './locale-switcher'
import type { Locale } from '@/config/i18n-config'

export function Header({ lang, dictionary }: { lang: Locale, dictionary: any }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href={`/${lang}`} className="flex items-center gap-3 font-bold text-primary transition-transform duration-300 hover:scale-105">
          <Hotel className="h-6 w-6" />
          <span className="text-2xl font-headline">Tranquil Stays</span>
        </Link>
        <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
              <Link href="/#rooms" className="transition-colors hover:text-primary">{dictionary.header.rooms}</Link>
              <Link href="/#booking" className="transition-colors hover:text-primary">{dictionary.header.booking}</Link>
              <Link href="/#concierge" className="transition-colors hover:text-primary">{dictionary.header.concierge}</Link>
              <Link href={`/${lang}/dashboard`} className="transition-colors hover:text-primary">{dictionary.header.dashboard}</Link>
            </nav>
            <LocaleSwitcher dictionary={dictionary.header} />
        </div>
      </div>
    </header>
  );
}
