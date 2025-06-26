
'use client'

import { useAuth } from '@/context/auth-provider'
import { AccessDenied } from '@/components/access-denied'
import type { Locale } from '@/config/i18n-config'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from 'recharts'
import { BookOpenCheck, DollarSign, TrendingUp } from 'lucide-react'
import { useCurrency } from '@/context/currency-provider'
import { formatCurrency, priceRates } from '@/lib/currency'

// Mock analytics data
const totalOrders = 350;
const totalRevenue = 8750.00;
const avgOrderValue = totalRevenue / totalOrders;

const salesByCategory = [
  { category: 'Breakfast', sales: 2200, fill: 'hsl(var(--chart-1))' },
  { category: 'Lunch', sales: 2800, fill: 'hsl(var(--chart-2))' },
  { category: 'Dinner', sales: 3000, fill: 'hsl(var(--chart-3))' },
  { category: 'Drinks', sales: 750, fill: 'hsl(var(--chart-4))' },
];

const dailyOrders = [
    { day: 'Mon', orders: 45 },
    { day: 'Tue', orders: 52 },
    { day: 'Wed', orders: 60 },
    { day: 'Thu', orders: 55 },
    { day: 'Fri', orders: 75 },
    { day: 'Sat', orders: 85 },
    { day: 'Sun', orders: 80 },
];

export function RestaurantAnalytics({ dictionary, lang }: { dictionary: any, lang: Locale }) {
    const { user } = useAuth()
    const { currency } = useCurrency()
    const isAuthorized = user && (user.role === 'admin' || user.role === 'staff')

    const analyticsDict = dictionary.dashboard.restaurant.analyticsPage;

    if (!isAuthorized) {
        return <AccessDenied dictionary={dictionary.accessDenied} lang={lang} />
    }
    
    const chartConfig = {
      sales: { label: analyticsDict.charts.sales, color: "hsl(var(--chart-1))" },
      orders: { label: analyticsDict.charts.orders, color: "hsl(var(--chart-2))" }
    }

    const categoryChartConfig = salesByCategory.reduce((acc, item) => {
        acc[item.category] = { label: analyticsDict.categories[item.category], color: item.fill };
        return acc;
    }, {} as any);


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">{analyticsDict.title}</h1>
            <p className="text-muted-foreground">{analyticsDict.description}</p>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{analyticsDict.stats.totalOrders}</CardTitle>
                        <BookOpenCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalOrders}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{analyticsDict.stats.totalRevenue}</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalRevenue * priceRates[currency], currency)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{analyticsDict.stats.avgOrderValue}</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(avgOrderValue * priceRates[currency], currency)}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{analyticsDict.charts.salesByCategory}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={categoryChartConfig} className="h-[300px] w-full">
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                <Pie data={salesByCategory} dataKey="sales" nameKey="category" cx="50%" cy="50%" outerRadius={100} label>
                                    {salesByCategory.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <ChartLegend content={<ChartLegendContent nameKey="category" />} />
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>{analyticsDict.charts.dailyOrders}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[300px] w-full">
                            <BarChart data={dailyOrders} accessibilityLayer>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="orders" fill="var(--color-orders)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
