import { redirect } from 'next/navigation'
import { i18n } from '@/config/i18n-config'

// This page now redirects to the default locale.
export default function RootPage() {
  redirect(i18n.defaultLocale)
}
