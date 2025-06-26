import { Hotel } from "lucide-react";
import Link from "next/link";
import { LocaleSwitcher } from './locale-switcher'
import type { Locale } from '@/config/i18n-config'
import { AuthSwitcher } from "./auth-switcher";
import { Button } from "./ui/button";

export function DashboardHeader({ lang, dictionary }: { lang: Locale, dictionary: any }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href={`/${lang}/dashboard`} className="flex items-center gap-3 font-bold text-primary transition-transform duration-300 hover:scale-105">
          <Hotel className="h-6 w-6" />
          <span className="text-2xl font-headline">{dictionary.dashboard.header.title}</span>
        </Link>
        <div className="flex items-center gap-2">
            <Button asChild variant="outline">
                <Link href={`/${lang}`}>{dictionary.dashboard.header.viewSite}</Link>
            </Button>
            <AuthSwitcher dictionary={dictionary.header} />
            <LocaleSwitcher dictionary={dictionary.header} />
        </div>
      </div>
    </header>
  );
}
