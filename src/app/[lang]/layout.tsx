import type { Metadata } from 'next'
import { i18n } from '@/config/i18n-config'
import type { Locale } from '@/config/i18n-config'
import { CurrencyProvider } from '@/context/currency-provider'
import { currencyMap } from '@/lib/currency'
import { AuthProvider } from '@/context/auth-provider'


export async function generateStaticParams() {
  return i18n.locales.map(locale => ({ lang: locale }))
}

export const metadata: Metadata = {
  title: 'Serenity Hotel, Resort, and Restaurant',
  description: 'Where luxury meets serenity. Your exclusive escape awaits.',
};

export default function LangLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode,
  params: { lang: Locale }
}>) {
  const initialCurrency = currencyMap[params.lang]
  return (
    <AuthProvider>
      <CurrencyProvider initialCurrency={initialCurrency}>
          {children}
      </CurrencyProvider>
    </AuthProvider>
  );
}
