
'use client'

import { useState, useMemo } from 'react'
import { useAuth } from '@/context/auth-provider'
import { AccessDenied } from '@/components/access-denied'
import type { Locale } from '@/config/i18n-config'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MoreHorizontal, Star } from 'lucide-react'

type BookingHistory = {
    id: string;
    room: string;
    checkIn: string;
    checkOut: string;
    amount: number;
    status: string;
};

type LoyaltyTransaction = {
    date: string;
    description: string;
    points: number;
};

type LoyaltyTier = 'Platinum' | 'Gold' | 'Silver' | 'None';

type GuestWithHistory = {
    id: string;
    name: string;
    email: string;
    phone: string;
    totalBookings: number;
    lastVisit: string;
    avatar: string;
    joinDate: string;
    notes: string;
    loyaltyTier: LoyaltyTier;
    loyaltyPoints: number;
    bookingHistory: BookingHistory[];
    loyaltyHistory: LoyaltyTransaction[];
};

const mockGuests: GuestWithHistory[] = [
    { 
        id: 'GST-001', name: 'Alice Johnson', email: 'alice@example.com', phone: '+1234567890', totalBookings: 3, lastVisit: '2024-07-28', avatar: '/images/avatars/avatar1.png', joinDate: '2023-01-15', notes: 'Prefers a quiet room away from the elevator.', loyaltyTier: 'Gold', loyaltyPoints: 12500,
        bookingHistory: [
            { id: 'BK-1294', room: 'Luxury King Suite', checkIn: '2024-07-26', checkOut: '2024-07-28', amount: 900, status: 'Completed' },
            { id: 'BK-1120', room: 'Deluxe Queen Room', checkIn: '2023-12-20', checkOut: '2023-12-23', amount: 750, status: 'Completed' },
            { id: 'BK-1055', room: 'Deluxe Queen Room', checkIn: '2023-01-15', checkOut: '2023-01-16', amount: 250, status: 'Completed' },
        ],
        loyaltyHistory: [
            { date: '2024-07-28', description: "Points Earned - Booking BK-1294", points: 9000 },
            { date: '2023-12-23', description: "Points Earned - Booking BK-1120", points: 7500 },
            { date: '2023-05-01', description: "Points Redeemed - Room Upgrade", points: -5000 },
            { date: '2023-01-16', description: "Points Earned - Booking BK-1055", points: 2500 },
            { date: '2023-01-15', description: "Welcome Bonus", points: 1000 },
        ]
    },
    { 
        id: 'GST-002', name: 'Bob Williams', email: 'bob@example.com', phone: '+1987654321', totalBookings: 1, lastVisit: '2024-07-28', avatar: '/images/avatars/avatar2.png', joinDate: '2024-07-28', notes: 'First time guest.', loyaltyTier: 'Silver', loyaltyPoints: 1500,
        bookingHistory: [
            { id: 'BK-1293', room: 'Deluxe Queen Room', checkIn: '2024-07-28', checkOut: '2024-07-30', amount: 500, status: 'CheckedIn' },
        ],
        loyaltyHistory: [
            { date: '2024-07-28', description: "Points Earned - Booking BK-1293", points: 500 },
            { date: '2024-07-28', description: "Welcome Bonus", points: 1000 },
        ]
    },
    { 
        id: 'GST-003', name: 'Charlie Brown', email: 'charlie@example.com', phone: '+1122334455', totalBookings: 5, lastVisit: '2024-07-27', avatar: '/images/avatars/avatar3.png', joinDate: '2022-03-10', notes: 'VIP Guest. Likes a complimentary fruit basket upon arrival.', loyaltyTier: 'Platinum', loyaltyPoints: 55000,
        bookingHistory: [
            { id: 'BK-1292', room: 'Presidential Suite', checkIn: '2024-07-25', checkOut: '2024-07-27', amount: 2400, status: 'Completed' },
            { id: 'BK-1105', room: 'Presidential Suite', checkIn: '2023-11-01', checkOut: '2023-11-05', amount: 4800, status: 'Completed' },
        ],
        loyaltyHistory: [
            { date: '2024-07-27', description: "Points Earned - Booking BK-1292", points: 24000 },
            { date: '2023-11-05', description: "Points Earned - Booking BK-1105", points: 48000 },
            { date: '2023-01-01', description: "Points Redeemed - Free Dinner", points: -15000 },
            { date: '2022-03-10', description: "Welcome Bonus", points: 2000 },
        ]
    },
    { 
        id: 'GST-004', name: 'Diana Prince', email: 'diana@example.com', phone: '+1555666777', totalBookings: 2, lastVisit: '2024-07-26', avatar: '/images/avatars/avatar4.png', joinDate: '2023-08-19', notes: '', loyaltyTier: 'Silver', loyaltyPoints: 4000,
        bookingHistory: [
            { id: 'BK-1291', room: 'Deluxe Queen Room', checkIn: '2024-07-24', checkOut: '2024-07-26', amount: 500, status: 'Completed' },
        ],
        loyaltyHistory: [
            { date: '2024-07-26', description: "Points Earned - Booking BK-1291", points: 3000 },
            { date: '2023-08-19', description: "Welcome Bonus", points: 1000 },
        ]
    },
    { 
        id: 'GST-005', name: 'Ethan Hunt', email: 'ethan@example.com', phone: '+1444333222', totalBookings: 1, lastVisit: '2024-07-25', avatar: '/images/avatars/avatar5.png', joinDate: '2024-07-25', notes: 'Allergic to peanuts.', loyaltyTier: 'None', loyaltyPoints: 900,
        bookingHistory: [
            { id: 'BK-1290', room: 'Luxury King Suite', checkIn: '2024-07-23', checkOut: '2024-07-25', amount: 900, status: 'Completed' },
        ],
        loyaltyHistory: [
            { date: '2024-07-25', description: "Points Earned - Booking BK-1290", points: 900 },
        ]
    },
];

export function GuestsManagement({ dictionary, lang }: { dictionary: any, lang: Locale }) {
    const { user } = useAuth()
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGuest, setSelectedGuest] = useState<GuestWithHistory | null>(null);
    const isAuthorized = user && (user.role === 'admin' || user.role === 'staff')

    const guestsDict = dictionary.dashboard.guestsPage;

    const filteredGuests = useMemo(() => {
        return mockGuests.filter(guest => 
            guest.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);
    
    if (!isAuthorized) {
        return <AccessDenied dictionary={dictionary.accessDenied} lang={lang} />
    }

    const getTierVariant = (tier: LoyaltyTier): "default" | "secondary" | "destructive" | "outline" => {
        switch (tier) {
            case 'Platinum': return 'default';
            case 'Gold': return 'outline';
            case 'Silver': return 'secondary';
            default: return 'secondary';
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">{guestsDict.title}</h1>
            
            <div className="mb-4">
                <Input 
                    placeholder={guestsDict.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{guestsDict.tableTitle}</CardTitle>
                    <CardDescription>{guestsDict.tableDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{guestsDict.headers.name}</TableHead>
                                <TableHead>{guestsDict.headers.contact}</TableHead>
                                <TableHead className="text-center">{guestsDict.headers.totalBookings}</TableHead>
                                <TableHead>{guestsDict.headers.loyaltyTier}</TableHead>
                                <TableHead>{guestsDict.headers.lastVisit}</TableHead>
                                <TableHead><span className="sr-only">{guestsDict.actions}</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredGuests.map((guest) => (
                                <TableRow key={guest.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={guest.avatar} alt={guest.name} data-ai-hint="avatar person" />
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
                                    <TableCell>
                                        <Badge variant={getTierVariant(guest.loyaltyTier)}>
                                            {guestsDict.loyaltyTiers[guest.loyaltyTier]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{format(new Date(guest.lastVisit), 'LLL dd, y')}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">{guestsDict.actions}</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => setSelectedGuest(guest)}>
                                                    {guestsDict.actionsMenu.viewDetails}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={!!selectedGuest} onOpenChange={(isOpen) => !isOpen && setSelectedGuest(null)}>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{guestsDict.detailsDialog.title}: {selectedGuest?.name}</DialogTitle>
                        <DialogDescription>
                            {guestsDict.detailsDialog.guestSince} {selectedGuest ? format(new Date(selectedGuest.joinDate), 'LLL dd, y') : ''}.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedGuest && (
                        <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-1 flex flex-col items-center">
                                    <Avatar className="h-24 w-24 mb-2">
                                        <AvatarImage src={selectedGuest.avatar} alt={selectedGuest.name} data-ai-hint="avatar person"/>
                                        <AvatarFallback>{selectedGuest.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <p className="text-sm text-muted-foreground">{selectedGuest.id}</p>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <h3 className="text-lg font-semibold">{guestsDict.detailsDialog.contactInfo}</h3>
                                    <p className="text-sm"><strong>{guestsDict.detailsDialog.email}:</strong> {selectedGuest.email}</p>
                                    <p className="text-sm"><strong>{guestsDict.detailsDialog.phone}:</strong> {selectedGuest.phone}</p>
                                    <h3 className="text-lg font-semibold mt-4">{guestsDict.detailsDialog.notes}</h3>
                                    <p className="text-sm text-muted-foreground">{selectedGuest.notes || 'No notes for this guest.'}</p>
                                </div>
                            </div>
                             <div className="space-y-2">
                                <h3 className="text-lg font-semibold flex items-center gap-2"><Star className="h-5 w-5 text-primary"/>{guestsDict.detailsDialog.loyaltyStatus}</h3>
                                <div className="flex items-baseline gap-4">
                                    <p className="text-sm"><strong>{guestsDict.detailsDialog.loyaltyTier}:</strong> <Badge variant={getTierVariant(selectedGuest.loyaltyTier)}>{guestsDict.loyaltyTiers[selectedGuest.loyaltyTier]}</Badge></p>
                                    <p className="text-sm"><strong>{guestsDict.detailsDialog.loyaltyPoints}:</strong> {selectedGuest.loyaltyPoints.toLocaleString()}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">{guestsDict.detailsDialog.bookingHistoryTitle}</h3>
                                <div className="border rounded-md max-h-48 overflow-y-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>{guestsDict.detailsDialog.historyHeaders.bookingId}</TableHead>
                                                <TableHead>{guestsDict.detailsDialog.historyHeaders.room}</TableHead>
                                                <TableHead>{guestsDict.detailsDialog.historyHeaders.dates}</TableHead>
                                                <TableHead className="text-right">{guestsDict.detailsDialog.historyHeaders.amount}</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {selectedGuest.bookingHistory.map(booking => (
                                                <TableRow key={booking.id}>
                                                    <TableCell>{booking.id}</TableCell>
                                                    <TableCell>{booking.room}</TableCell>
                                                    <TableCell>{format(new Date(booking.checkIn), 'PP')} - {format(new Date(booking.checkOut), 'PP')}</TableCell>
                                                    <TableCell className="text-right">${booking.amount.toLocaleString()}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">{guestsDict.detailsDialog.loyaltyHistoryTitle}</h3>
                                <div className="border rounded-md max-h-48 overflow-y-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>{guestsDict.detailsDialog.loyaltyHistoryHeaders.date}</TableHead>
                                                <TableHead>{guestsDict.detailsDialog.loyaltyHistoryHeaders.description}</TableHead>
                                                <TableHead className="text-right">{guestsDict.detailsDialog.loyaltyHistoryHeaders.points}</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {selectedGuest.loyaltyHistory.map((transaction, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{format(new Date(transaction.date), 'PP')}</TableCell>
                                                    <TableCell>
                                                        {transaction.description
                                                            .replace('Points Earned - Booking {bookingId}', guestsDict.detailsDialog.pointsEarnedBooking)
                                                            .replace('Points Redeemed - Room Upgrade', guestsDict.detailsDialog.pointsRedeemedUpgrade)
                                                            .replace('Welcome Bonus', guestsDict.detailsDialog.pointsEarnedWelcome)
                                                        }
                                                    </TableCell>
                                                    <TableCell className={`text-right font-medium ${transaction.points > 0 ? 'text-primary' : 'text-destructive'}`}>
                                                        {transaction.points > 0 ? '+' : ''}{transaction.points.toLocaleString()}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">{guestsDict.detailsDialog.close}</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
