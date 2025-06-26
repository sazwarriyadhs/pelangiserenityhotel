
'use client';

import { Hotel, Menu, LayoutDashboard, BookOpenCheck, Users, BarChart3, Settings, BedDouble, CreditCard, Sparkles, UserCog, UtensilsCrossed, ClipboardList, Armchair, ChefHat, Boxes } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LocaleSwitcher } from './locale-switcher'
import type { Locale } from '@/config/i18n-config'
import { AuthSwitcher } from "./auth-switcher";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";


export function DashboardHeader({ lang, dictionary }: { lang: Locale, dictionary: any }) {
    const pathname = usePathname();
    const navDict = dictionary.dashboard.sidebar;
    const headerDict = dictionary.dashboard.header;
    
    const hotelNav = [
        { href: `/${lang}/dashboard`, label: navDict.overview, icon: LayoutDashboard },
        { href: `/${lang}/dashboard/bookings`, label: navDict.bookings, icon: BookOpenCheck },
        { href: `/${lang}/dashboard/rooms`, label: navDict.rooms, icon: BedDouble },
        { href: `/${lang}/dashboard/housekeeping`, label: navDict.housekeeping, icon: Sparkles },
        { href: `/${lang}/dashboard/guests`, label: navDict.guests, icon: Users },
        { href: `/${lang}/dashboard/payments`, label: navDict.payments, icon: CreditCard },
        { href: `/${lang}/dashboard/analytics`, label: navDict.analytics, icon: BarChart3 },
        { href: `/${lang}/dashboard/staff`, label: navDict.staff, icon: UserCog },
        { href: `/${lang}/dashboard/inventory`, label: navDict.inventory, icon: Boxes },
    ];
    
    const restaurantNav = [
        { href: `/${lang}/dashboard/restaurant/menu`, label: navDict.restaurantMenu, icon: UtensilsCrossed },
        { href: `/${lang}/dashboard/restaurant/orders`, label: navDict.restaurantOrderManagement, icon: ClipboardList },
        { href: `/${lang}/dashboard/restaurant/tables`, label: navDict.restaurantTables, icon: Armchair },
        { href: `/${lang}/dashboard/restaurant/kitchen`, label: navDict.restaurantKitchen, icon: ChefHat },
    ];

    const settingsNav = { href: `/${lang}/dashboard/settings`, label: navDict.settings, icon: Settings };

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 sticky top-0 z-40">
        <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
                <div className="flex h-full max-h-screen flex-col">
                    <div className="flex h-16 items-center border-b px-6">
                        <Link href={`/${lang}/dashboard`} className="flex items-center gap-3 font-bold text-primary">
                            <Hotel className="h-6 w-6" />
                            <span className="text-2xl font-headline">{headerDict.title}</span>
                        </Link>
                    </div>
                    <nav className="flex-1 grid items-start p-4 text-sm font-medium">
                        <span className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{navDict.hotelManagement}</span>
                        {hotelNav.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                                    pathname === item.href && "bg-muted text-primary"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        ))}
                        <Separator className="my-4" />
                        <span className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{navDict.restaurantManagement}</span>
                        {restaurantNav.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                                    pathname.startsWith(item.href) && "bg-muted text-primary"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="mt-auto p-4 border-t">
                        <Link
                            href={settingsNav.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                                pathname === settingsNav.href && "bg-muted text-primary"
                            )}
                        >
                            <settingsNav.icon className="h-4 w-4" />
                            {settingsNav.label}
                        </Link>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
        <div className="w-full flex-1 flex items-center justify-between md:justify-end">
            <Link href={`/${lang}/dashboard`} className="flex items-center gap-3 font-bold text-primary md:hidden">
                <Hotel className="h-6 w-6" />
                <span className="text-xl font-headline">{dictionary.dashboard.header.title}</span>
            </Link>
            <div className="flex items-center gap-2">
                <Button asChild variant="outline">
                    <Link href={`/${lang}`}>{headerDict.viewSite}</Link>
                </Button>
                <AuthSwitcher dictionary={dictionary.header} />
                <LocaleSwitcher dictionary={dictionary.header} />
            </div>
        </div>
    </header>
  );
}
