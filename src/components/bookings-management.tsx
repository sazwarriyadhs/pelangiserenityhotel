'use client'

import { useAuth } from '@/context/auth-provider'
import { AccessDenied } from '@/components/access-denied'
import type { Locale } from '@/config/i18n-config'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { useCurrency } from '@/context/currency-provider'
import { formatCurrency, priceRates } from '@/lib/currency'

type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled';

const mockBookings: { id: string; guest: string; room: string; checkIn: string; checkOut: string; amount: number; status: BookingStatus }[] = [
    { id: 'BK-1294', guest: 'Alice Johnson', room: 'Luxury King Suite', checkIn: '2024-07-28', checkOut: '2024-08-01', amount: 900, status: 'Confirmed' },
    { id: 'BK-1293', guest: 'Bob Williams', room: 'Deluxe Queen Room', checkIn: '2024-07-28', checkOut: '2024-07-30', amount: 500, status: 'Confirmed' },
    { id: 'BK-1292', guest: 'Charlie Brown', room: 'Presidential Suite', checkIn: '2024-07-27', checkOut: '2024-07-29', amount: 2400, status: 'Pending' },
    { id: 'BK-1291', guest: 'Diana Prince', room: 'Deluxe Queen Room', checkIn: '2024-07-26', checkOut: '2024-07-27', amount: 250, status: 'Cancelled' },
    { id: 'BK-1290', guest: 'Ethan Hunt', room: 'Luxury King Suite', checkIn: '2024-07-25', checkOut: '2024-07-28', amount: 450, status: 'Confirmed' },
    { id: 'BK-1289', guest: 'Fiona Glenanne', room: 'Deluxe Queen Room', checkIn: '2024-08-02', checkOut: '2024-08-05', amount: 750, status: 'Confirmed' },
    { id: 'BK-1288', guest: 'George Costanza', room: 'Presidential Suite', checkIn: '2024-08-10', checkOut: '2024-08-15', amount: 6000, status: 'Pending' },
];

export function BookingsManagement({ dictionary, lang }: { dictionary: any, lang: Locale }) {
    const { user } = useAuth()
    const { currency } = useCurrency();
    const isAuthorized = user && (user.role === 'admin' || user.role === 'staff')

    if (!isAuthorized) {
        return <AccessDenied dictionary={dictionary.accessDenied} lang={lang} />
    }
    
    const bookingsDict = dictionary.dashboard.bookingsPage;

    const getStatusVariant = (status: BookingStatus): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
            case 'Confirmed': return 'default'
            case 'Pending': return 'secondary'
            case 'Cancelled': return 'destructive'
            default: return 'outline'
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">{bookingsDict.title}</h1>
            <Card>
                <CardHeader>
                    <CardTitle>{bookingsDict.tableTitle}</CardTitle>
                    <CardDescription>{bookingsDict.tableDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{bookingsDict.headers.bookingId}</TableHead>
                                <TableHead>{bookingsDict.headers.guest}</TableHead>
                                <TableHead>{bookingsDict.headers.roomType}</TableHead>
                                <TableHead>{bookingsDict.headers.dates}</TableHead>
                                <TableHead>{bookingsDict.headers.status}</TableHead>
                                <TableHead className="text-right">{bookingsDict.headers.amount}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockBookings.map((booking) => (
                                <TableRow key={booking.id}>
                                    <TableCell className="font-medium">{booking.id}</TableCell>
                                    <TableCell>{booking.guest}</TableCell>
                                    <TableCell>{booking.room}</TableCell>
                                    <TableCell>{`${format(new Date(booking.checkIn), 'LLL dd, y')} - ${format(new Date(booking.checkOut), 'LLL dd, y')}`}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(booking.status)}>{bookingsDict.statuses[booking.status]}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{formatCurrency(booking.amount * priceRates[currency], currency)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
