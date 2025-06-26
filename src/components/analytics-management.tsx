'use client'

import { useAuth } from '@/context/auth-provider'
import { AccessDenied } from '@/components/access-denied'
import type { Locale } from '@/config/i18n-config'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Tooltip, Cell } from 'recharts'
import { DollarSign, CalendarDays } from 'lucide-react'

// Mock analytics data
const revenueTrend = [
  { month: 'Jan', revenue: 45000 },
  { month: 'Feb', revenue: 48000 },
  { month: 'Mar', revenue: 55000 },
  { month: 'Apr', revenue: 62000 },
  { month: 'May', revenue: 75000 },
  { month: 'Jun', revenue: 81000 },
  { month: 'Jul', revenue: 92000 },
  { month: 'Aug', revenue: 88000 },
  { month: 'Sep', revenue: 76000 },
  { month: 'Oct', revenue: 68000 },
  { month: 'Nov', revenue: 82000 },
  { month: 'Dec', revenue: 95000 },
];

const occupancyByRoomType = [
  { roomType: 'Deluxe Queen', occupancy: 85, fill: 'hsl(var(--chart-1))' },
  { roomType: 'Luxury King', occupancy: 92, fill: 'hsl(var(--chart-2))' },
  { roomType: 'Presidential', occupancy: 78, fill: 'hsl(var(--chart-3))' },
];

const avgBookingValue = 425.50;
const avgStayLength = 3.2;

export function AnalyticsManagement({ dictionary, lang }: { dictionary: any, lang: Locale }) {
    const { user } = useAuth()
    const isAuthorized = user && (user.role === 'admin') 

    if (!isAuthorized) {
        return <AccessDenied dictionary={dictionary.accessDenied} lang={lang} />
    }
    
    const analyticsDict = dictionary.dashboard.analyticsPage;

    const chartConfig = {
      revenue: { label: analyticsDict.revenue, color: "hsl(var(--chart-1))" },
      occupancy: { label: analyticsDict.occupancy, color: "hsl(var(--chart-2))" }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">{analyticsDict.title}</h1>
            <p className="text-muted-foreground">{analyticsDict.description}</p>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{analyticsDict.avgBookingValue}</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${avgBookingValue.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{analyticsDict.avgStayLength}</CardTitle>
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgStayLength} {analyticsDict.days}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{analyticsDict.revenueTrend}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[300px] w-full">
                            <LineChart data={revenueTrend} accessibilityLayer>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                                <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                                <Line dataKey="revenue" type="monotone" stroke="var(--color-revenue)" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{analyticsDict.occupancyRate}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[300px] w-full">
                            <BarChart data={occupancyByRoomType} layout="vertical" accessibilityLayer margin={{ left: 20 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="roomType" type="category" tickLine={false} axisLine={false} width={100} />
                                <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                                <Bar dataKey="occupancy" layout="vertical" radius={4}>
                                    {occupancyByRoomType.map((entry) => (
                                        <Cell key={`cell-${entry.roomType}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
