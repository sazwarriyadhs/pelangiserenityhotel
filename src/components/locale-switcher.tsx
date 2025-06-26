"use client"

import { usePathname, useRouter } from "next/navigation"
import { useCurrency } from "@/context/currency-provider"
import { i18n } from "@/config/i18n-config"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"

export function LocaleSwitcher({ dictionary }: { dictionary: any }) {
  const pathName = usePathname()
  const router = useRouter()
  const { setCurrency } = useCurrency()

  const redirectedPathName = (locale: string) => {
    if (!pathName) return "/"
    const segments = pathName.split("/")
    segments[1] = locale
    return segments.join("/")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{dictionary.language}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {i18n.locales.map(locale => (
          <DropdownMenuItem
            key={locale}
            onClick={() => router.push(redirectedPathName(locale))}
          >
            {dictionary.languages[locale]}
          </DropdownMenuItem>
        ))}
        <DropdownMenuLabel>{dictionary.currency}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setCurrency('USD')}>
          {dictionary.currencies.usd}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setCurrency('IDR')}>
          {dictionary.currencies.idr}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
