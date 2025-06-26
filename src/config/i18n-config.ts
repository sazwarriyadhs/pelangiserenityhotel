export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'id'],
} as const;

export type Locale = (typeof i18n)['locales'][number];

export const currencyMap = {
  en: 'USD',
  id: 'IDR',
} as const;

export const priceRates = {
  USD: 1,
  IDR: 15500,
};
