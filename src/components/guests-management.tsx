
'use client'

import { useAuth } from '@/context/auth-provider'
import { AccessDenied } from '@/components/access-denied'
import type { Locale } from '@/config/i18n-config'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const mockGuests = [
    { id: 'GST-001', name: 'Alice Johnson', email: 'alice@example.com', phone: '+1234567890', totalBookings: 3, lastVisit: '2024-07-28', avatar: '/avatars/01.png' },
    { id: 'GST-002', name: 'Bob Williams', email: 'bob@example.com', phone: '+1987654321', totalBookings: 1, lastVisit: '2024-07-28', avatar: '/avatars/02.png' },
    { id: 'GST-003', name: 'Charlie Brown', email: 'charlie@example.com', phone: '+1122334455', totalBookings: 5, lastVisit: '2024-07-27', avatar: '/avatars/03.png' },
    { id: 'GST-004', name: 'Diana Prince', email: 'diana@example.com', phone: '+1555666777', totalBookings: 2, lastVisit: '2024-07-26', avatar: '/avatars/04.png' },
    { id: 'GST-005', name: 'Ethan Hunt', email: 'ethan@example.com', phone: '+1444333222', totalBookings: 1, lastVisit: '2024-07-25', avatar: '/avatars/05.png' },
];

export function GuestsManagement({ dictionary, lang }: { dictionary: any, lang: Locale }) {
    const { user } = useAuth()
    const isAuthorized = user && (user.role === 'admin' || user.role === 'staff')

    if (!isAuthorized) {
        return <AccessDenied dictionary={dictionary.accessDenied} lang={lang} />
    }
    
    const guestsDict = dictionary.dashboard.guestsPage;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">{guestsDict.title}</h1>
            <Card>
                <CardHeader>
                    <CardTitle>{guestsDict.tableTitle}</CardTitle>
                    <CardDescription>{guestsDict.tableDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{guestsDict.headers.guestId}</TableHead>
                                <TableHead>{guestsDict.headers.name}</TableHead>
                                <TableHead>{guestsDict.headers.contact}</TableHead>
                                <TableHead>{guestsDict.headers.totalBookings}</TableHead>
                                <TableHead>{guestsDict.headers.lastVisit}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockGuests.map((guest) => (
                                <TableRow key={guest.id}>
                                    <TableCell className="font-medium">{guest.id}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={guest.avatar} alt={guest.name} />
                                                <AvatarFallback>{guest.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="font-medium">{guest.name}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>{guest.email}</div>
                                        <div className="text-sm text-muted-foreground">{guest.phone}</div>
                                    </TableCell>
                                    <TableCell className="text-center">{guest.totalBookings}</TableCell>
                                    <TableCell>{format(new Date(guest.lastVisit), 'LLL dd, y')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
