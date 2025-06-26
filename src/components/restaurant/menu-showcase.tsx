'use client'

import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCurrency } from '@/context/currency-provider'
import { formatCurrency, priceRates } from '@/lib/currency'
import { menuItems as initialMenuItems } from '@/lib/restaurant-constants'

type MenuCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Drinks';

export function MenuShowcase({ dictionary }: { dictionary: any }) {
    const { currency } = useCurrency();
    const menuDict = dictionary.dashboard.restaurant.menuManagementPage;
    const pageDict = dictionary.restaurantPage;
    
    const categories: MenuCategory[] = ['Breakfast', 'Lunch', 'Dinner', 'Drinks'];

    return (
        <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline text-primary">
                        {pageDict.title}
                    </h1>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        {pageDict.subtitle}
                    </p>
                </div>
            </div>

            <Tabs defaultValue="Breakfast" className="w-full mt-12">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                    {categories.map(cat => (
                         <TabsTrigger key={cat} value={cat}>{menuDict.categories[cat]}</TabsTrigger>
                    ))}
                </TabsList>
                {categories.map(cat => (
                    <TabsContent key={cat} value={cat}>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
                            {initialMenuItems.filter(item => item.category === cat).map((item) => (
                                <Card key={item.id} className="flex flex-col overflow-hidden border-primary/20 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-2">
                                    <CardHeader className="p-0">
                                        <div className="aspect-video relative">
                                            <Image 
                                                src={item.image} 
                                                alt={item.name} 
                                                fill 
                                                className="object-cover"
                                                data-ai-hint={item.aiHint}
                                            />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-grow p-4">
                                        <CardTitle className="text-lg">{item.name}</CardTitle>
                                        <CardDescription className="mt-1 text-sm">{item.description}</CardDescription>
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0">
                                        <div className="font-semibold text-lg text-primary">{formatCurrency(item.price * priceRates[currency], currency)}</div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}
