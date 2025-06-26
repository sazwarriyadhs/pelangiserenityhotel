import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import type { Locale } from '@/config/i18n-config';

export function AccessDenied({ dictionary, lang }: { dictionary: any, lang: Locale }) {
  return (
    <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="container text-center flex flex-col items-center gap-6">
            <ShieldAlert className="w-24 h-24 text-destructive" />
            <h1 className="text-4xl font-bold tracking-tight font-headline text-destructive">{dictionary.title}</h1>
            <p className="text-lg text-muted-foreground">{dictionary.message}</p>
            <Button asChild>
                <Link href={`/${lang}`}>{dictionary.goHome}</Link>
            </Button>
        </div>
    </main>
  );
}
