'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, BookOpenCheck, Star, Users } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell, Tooltip } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

// Mock data
const totalRevenue = 52310.55
const totalBookings = 275
const avgRating = 4.8
const newGuests = 120

const monthlyBookings = [
  { month: "Jan", bookings: 18 },
  { month: "Feb", bookings: 25 },
  { month: "Mar", bookings: 32 },
  { month: "Apr", bookings: 45 },
  { month: "May", bookings: 58 },
  { month: "Jun", bookings: 62 },
]

const roomTypeBookings = [
  { name: 'Deluxe Queen Room', value: 120, fill: 'hsl(var(--chart-1))' },
  { name: 'Luxury King Suite', value: 95, fill: 'hsl(var(--chart-2))' },
  { name: 'Presidential Suite', value: 60, fill: 'hsl(var(--chart-3))' },
]

const recentBookings = [
    { id: 'BK-1294', guest: 'Alice Johnson', room: 'Luxury King Suite', date: '2024-07-28', amount: 900 },
    { id: 'BK-1293', guest: 'Bob Williams', room: 'Deluxe Queen Room', date: '2024-07-28', amount: 500 },
    { id: 'BK-1292', guest: 'Charlie Brown', room: 'Presidential Suite', date: '2024-07-27', amount: 2400 },
    { id: 'BK-1291', guest: 'Diana Prince', room: 'Deluxe Queen Room', date: '2024-07-26', amount: 250 },
    { id: 'BK-1290', guest: 'Ethan Hunt', room: 'Luxury King Suite', date: '2024-07-25', amount: 450 },
]

export function DashboardContent({ dictionary }: { dictionary: any }) {
    const dashboardDict = dictionary;

    const chartConfig = {
      bookings: {
        label: dashboardDict.charts.bookings,
        color: "hsl(var(--chart-1))",
      },
    }

    return (
        <main className="flex-1 p-4 md:p-8">
            <div className="container">
                <h1 className="text-3xl font-bold tracking-tight mb-8 font-headline text-primary">{dashboardDict.title}</h1>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{dashboardDict.stats.totalRevenue}</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{dashboardDict.stats.totalBookings}</CardTitle>
                            <BookOpenCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+{totalBookings}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{dashboardDict.stats.avgRating}</CardTitle>
                            <Star className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{avgRating}/5.0</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{dashboardDict.stats.newGuests}</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+{newGuests}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7 mb-8">
                    <Card className="lg:col-span-4">
                        <CardHeader>
                            <CardTitle>{dashboardDict.charts.monthlyBookingsTitle}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                                <BarChart data={monthlyBookings} accessibilityLayer>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="bookings" fill="var(--color-bookings)" radius={4} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                        <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle>{dashboardDict.charts.roomTypeDistributionTitle}</CardTitle>
                        </CardHeader>
                        <CardContent>
                                <ChartContainer config={{}} className="h-[300px] w-full">
                                <PieChart>
                                    <Tooltip content={<ChartTooltipContent hideLabel />} />
                                    <Pie data={roomTypeBookings} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                        {roomTypeBookings.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                                </PieChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{dashboardDict.recentBookings.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{dashboardDict.recentBookings.bookingId}</TableHead>
                                    <TableHead>{dashboardDict.recentBookings.guest}</TableHead>
                                    <TableHead>{dashboardDict.recentBookings.roomType}</TableHead>
                                    <TableHead>{dashboardDict.recentBookings.date}</TableHead>
                                    <TableHead className="text-right">{dashboardDict.recentBookings.amount}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentBookings.map((booking) => (
                                    <TableRow key={booking.id}>
                                        <TableCell className="font-medium">{booking.id}</TableCell>
                                        <TableCell>{booking.guest}</TableCell>
                                        <TableCell>{booking.room}</TableCell>
                                        <TableCell>{booking.date}</TableCell>
                                        <TableCell className="text-right">${booking.amount.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
