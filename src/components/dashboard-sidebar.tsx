
'use client'

import Link from 'next/link';
import { LayoutDashboard, BookOpenCheck, Users, BarChart3, Settings, Hotel } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { Locale } from '@/config/i18n-config';

export function DashboardSidebar({ dictionary, lang }: { dictionary: any, lang: Locale }) {
    const pathname = usePathname();

    const mainNav = [
        { href: `/${lang}/dashboard`, label: dictionary.overview, icon: LayoutDashboard },
        { href: `/${lang}/dashboard/bookings`, label: dictionary.bookings, icon: BookOpenCheck },
        { href: `/${lang}/dashboard/guests`, label: dictionary.guests, icon: Users },
        { href: `/${lang}/dashboard/analytics`, label: dictionary.analytics, icon: BarChart3 },
    ];

    const settingsNav = {
        href: `/${lang}/dashboard/settings`,
        label: dictionary.settings,
        icon: Settings
    }

    return (
        <aside className="hidden border-r bg-background md:block">
           <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-[60px] items-center border-b px-6">
                    <Link href={`/${lang}/dashboard`} className="flex items-center gap-2 font-semibold">
                        <Hotel className="h-6 w-6 text-primary" />
                        <span className="font-headline text-xl">Tranquil Stays</span>
                    </Link>
                </div>
                <div className="flex-1">
                    <nav className="grid items-start p-2 text-sm font-medium lg:p-4">
                        {mainNav.map((item) => (
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
                    </nav>
                </div>
                <div className="mt-auto p-4 border-t">
                    <nav className="grid items-start text-sm font-medium">
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
                    </nav>
                </div>
           </div>
        </aside>
    );
}
