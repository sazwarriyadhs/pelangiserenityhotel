
'use client'

import Link from 'next/link';
import { LayoutDashboard, BookOpenCheck, Users, BarChart3, Settings, Hotel, BedDouble, CreditCard, Sparkles, UserCog, UtensilsCrossed, ClipboardList, Armchair, ChefHat, Boxes, Share2, LayoutTemplate } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { Locale } from '@/config/i18n-config';
import { Separator } from './ui/separator';

export function DashboardSidebar({ dictionary, lang }: { dictionary: any, lang: Locale }) {
    const pathname = usePathname();

    const hotelNav = [
        { href: `/${lang}/dashboard`, label: dictionary.overview, icon: LayoutDashboard },
        { href: `/${lang}/dashboard/bookings`, label: dictionary.bookings, icon: BookOpenCheck },
        { href: `/${lang}/dashboard/rooms`, label: dictionary.rooms, icon: BedDouble },
        { href: `/${lang}/dashboard/housekeeping`, label: dictionary.housekeeping, icon: Sparkles },
        { href: `/${lang}/dashboard/guests`, label: dictionary.guests, icon: Users },
        { href: `/${lang}/dashboard/payments`, label: dictionary.payments, icon: CreditCard },
        { href: `/${lang}/dashboard/inventory`, label: dictionary.inventory, icon: Boxes },
        { href: `/${lang}/dashboard/ota-integrations`, label: dictionary.otaIntegrations, icon: Share2 },
        { href: `/${lang}/dashboard/analytics`, label: dictionary.analytics, icon: BarChart3 },
        { href: `/${lang}/dashboard/staff`, label: dictionary.staff, icon: UserCog },
    ];
    
    const restaurantNav = [
        { href: `/${lang}/dashboard/restaurant/menu`, label: dictionary.restaurantMenu, icon: UtensilsCrossed },
        { href: `/${lang}/dashboard/restaurant/orders`, label: dictionary.restaurantOrderManagement, icon: ClipboardList },
        { href: `/${lang}/dashboard/restaurant/tables`, label: dictionary.restaurantTables, icon: Armchair },
        { href: `/${lang}/dashboard/restaurant/kitchen`, label: dictionary.restaurantKitchen, icon: ChefHat },
    ];

    const managementNav = [
        { href: `/${lang}/dashboard/website`, label: dictionary.website, icon: LayoutTemplate },
        { href: `/${lang}/dashboard/settings`, label: dictionary.settings, icon: Settings }
    ];

    return (
        <aside className="hidden border-r bg-background md:block">
           <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-[60px] items-center border-b px-6">
                    <Link href={`/${lang}/dashboard`} className="flex items-center gap-2 font-semibold">
                        <Hotel className="h-6 w-6 text-primary" />
                        <span className="font-headline text-xl">Tranquil Stays</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <nav className="grid items-start p-2 text-sm font-medium lg:p-4">
                        <span className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{dictionary.hotelManagement}</span>
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
                        <span className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{dictionary.restaurantManagement}</span>
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
                         <Separator className="my-4" />
                        <span className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{dictionary.generalManagement}</span>
                         {managementNav.map((item) => (
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
                </div>
           </div>
        </aside>
    );
}
