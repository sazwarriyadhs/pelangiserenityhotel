import type { Locale } from '@/config/i18n-config';

export type Currency = 'USD' | 'IDR';

export const currencyMap: Record<Locale, Currency> = {
    en: 'USD',
    id: 'IDR',
};

export const priceRates: Record<Currency, number> = {
    USD: 1,
    IDR: 15500,
};

export function formatCurrency(amount: number, currency: Currency) {
    if (currency === 'IDR') {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}
