import type { Metadata } from 'next'
import '../globals.css'
import { Toaster } from "@/components/ui/toaster"
import { i18n, currencyMap } from '@/config/i18n-config'
import type { Locale } from '@/config/i18n-config'
import { CurrencyProvider } from '@/context/currency-provider'


export async function generateStaticParams() {
  return i18n.locales.map(locale => ({ lang: locale }))
}

export const metadata: Metadata = {
  title: 'Tranquil Stays',
  description: 'Where luxury meets tranquility. Your exclusive escape awaits.',
};

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode,
  params: { lang: Locale }
}>) {
  const initialCurrency = currencyMap[params.lang]
  return (
    <html lang={params.lang} className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <CurrencyProvider initialCurrency={initialCurrency}>
            {children}
        </CurrencyProvider>
        <Toaster />
      </body>
    </html>
  );
}
