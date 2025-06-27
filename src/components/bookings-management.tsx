
'use client'

import { useState, useMemo, useEffect } from 'react'
import { useAuth } from '@/context/auth-provider'
import { AccessDenied } from '@/components/access-denied'
import type { Locale } from '@/config/i18n-config'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { Button } from "@/components/ui/button"
import { Badge } from '@/components/ui/badge'
import { format, isToday, parseISO } from 'date-fns'
import { useCurrency } from '@/context/currency-provider'
import { formatCurrency, priceRates } from '@/lib/currency'
import { BedDouble, File, LogIn, LogOut, MoreHorizontal, PlusCircle, UserCheck } from 'lucide-react'
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { rooms } from '@/lib/constants'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { initialBookings, type Booking, type BookingStatus } from '@/lib/bookings-constants'

const getAddBookingFormSchema = (dictionary: any) => z.object({
  guestName: z.string().min(1, { message: dictionary.errors.guestNameRequired }),
  roomType: z.string({ required_error: dictionary.errors.roomRequired }),
  dates: z.object({
      from: z.date({ required_error: dictionary.errors.checkinRequired }),
      to: z.date({ required_error: dictionary.errors.checkoutRequired }),
    }, { required_error: dictionary.errors.datesRequired }
  ),
});

export function BookingsManagement({ dictionary, lang }: { dictionary: any, lang: Locale }) {
    const { user } = useAuth();
    const { currency } = useCurrency();
    const { toast } = useToast();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [activeTab, setActiveTab] = useState("all");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        try {
            const storedBookings = localStorage.getItem('serenity-bookings');
            if (storedBookings) {
                setBookings(JSON.parse(storedBookings));
            } else {
                // If no bookings in storage, initialize with mock data
                localStorage.setItem('serenity-bookings', JSON.stringify(initialBookings));
                setBookings(initialBookings);
            }
        } catch (error) {
            console.error("Could not load bookings from localStorage", error);
            setBookings(initialBookings);
        }
    }, []);
    
    const bookingsDict = dictionary.dashboard.bookingsPage;
    const addBookingDialogDict = bookingsDict.addReservationDialog;
    const addBookingFormSchema = getAddBookingFormSchema(addBookingDialogDict);

    const form = useForm<z.infer<typeof addBookingFormSchema>>({
      resolver: zodResolver(addBookingFormSchema),
      defaultValues: { guestName: "" }
    });

    const isAuthorized = user && (user.role === 'admin' || user.role === 'staff')

    const filteredBookings = useMemo(() => {
        if (activeTab === 'all') return bookings;
        return bookings.filter(b => b.status.toLowerCase() === activeTab);
    }, [activeTab, bookings]);
    
    const todaysArrivals = useMemo(() => {
        return bookings.filter(b => isToday(parseISO(b.checkIn)) && b.status === 'Confirmed');
    }, [bookings]);

    const todaysDepartures = useMemo(() => {
        return bookings.filter(b => isToday(parseISO(b.checkOut)) && b.status === 'CheckedIn');
    }, [bookings]);


    if (!isAuthorized) {
        return <AccessDenied dictionary={dictionary.accessDenied} lang={lang} />
    }
    
    function onAddBooking(data: z.infer<typeof addBookingFormSchema>) {
      // This function is for adding a booking directly from the dashboard
      // The logic is similar to the public booking form
      toast({
        title: addBookingDialogDict.success.title,
        description: addBookingDialogDict.success.description
          .replace('{guestName}', data.guestName)
          .replace('{roomType}', data.roomType)
      });
      console.log("New Booking Data:", data);
      setIsDialogOpen(false);
      form.reset();
    }

    const getStatusVariant = (status: BookingStatus): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
            case 'Confirmed': return 'default'
            case 'Pending': return 'secondary'
            case 'Cancelled': return 'destructive'
            case 'CheckedIn': return 'outline'
            default: return 'outline'
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">{bookingsDict.title}</h1>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{bookingsDict.todaysArrivals}</CardTitle>
                        <LogIn className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{todaysArrivals.length}</div>
                        <p className="text-xs text-muted-foreground">{bookingsDict.guests}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{bookingsDict.todaysDepartures}</CardTitle>
                        <LogOut className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{todaysDepartures.length}</div>
                         <p className="text-xs text-muted-foreground">{bookingsDict.guests}</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger value="all">{bookingsDict.tabs.all}</TabsTrigger>
                        <TabsTrigger value="confirmed">{bookingsDict.tabs.confirmed}</TabsTrigger>
                        <TabsTrigger value="pending">{bookingsDict.tabs.pending}</TabsTrigger>
                        <TabsTrigger value="checkedin">{bookingsDict.tabs.checkedIn}</TabsTrigger>
                        <TabsTrigger value="cancelled">{bookingsDict.tabs.cancelled}</TabsTrigger>
                    </TabsList>
                    <div className="ml-auto flex items-center gap-2">
                        <Button size="sm" variant="outline" className="h-8 gap-1">
                            <File className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                {bookingsDict.export}
                            </span>
                        </Button>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="h-8 gap-1">
                                    <PlusCircle className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    {bookingsDict.addNew}
                                    </span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{addBookingDialogDict.title}</DialogTitle>
                                    <DialogDescription>{addBookingDialogDict.description}</DialogDescription>
                                </DialogHeader>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onAddBooking)} className="space-y-4">
                                        <FormField control={form.control} name="guestName" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{addBookingDialogDict.guestName}</FormLabel>
                                                <FormControl><Input placeholder={addBookingDialogDict.guestNamePlaceholder} {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="roomType" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{addBookingDialogDict.roomType}</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder={addBookingDialogDict.selectRoom} /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        {rooms.map((room) => (<SelectItem key={room.name} value={room.name}>{room.name}</SelectItem>))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="dates" render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>{bookingsDict.headers.dates}</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value?.from && "text-muted-foreground")}>
                                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                                {field.value?.from ? (field.value.to ? (<>{format(field.value.from, "LLL dd, y")} - {format(field.value.to, "LLL dd, y")}</>) : (format(field.value.from, "LLL dd, y"))) : (<span>{dictionary.booking.pickDates}</span>)}
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar initialFocus mode="range" defaultMonth={field.value?.from} selected={{from: field.value?.from, to: field.value?.to}} onSelect={field.onChange} numberOfMonths={2} />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <DialogFooter>
                                            <DialogClose asChild><Button type="button" variant="secondary">{addBookingDialogDict.cancel}</Button></DialogClose>
                                            <Button type="submit">{addBookingDialogDict.submit}</Button>
                                        </DialogFooter>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <Card className="mt-4">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{bookingsDict.headers.bookingId}</TableHead>
                                    <TableHead>{bookingsDict.headers.guest}</TableHead>
                                    <TableHead>{bookingsDict.headers.roomType}</TableHead>
                                    <TableHead>{bookingsDict.headers.dates}</TableHead>
                                    <TableHead>{bookingsDict.headers.status}</TableHead>
                                    <TableHead className="text-right">{bookingsDict.headers.amount}</TableHead>
                                    <TableHead><span className="sr-only">{bookingsDict.actions}</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredBookings.map((booking) => (
                                    <TableRow key={booking.id}>
                                        <TableCell className="font-medium">{booking.id}</TableCell>
                                        <TableCell>{booking.guest}</TableCell>
                                        <TableCell>{booking.room}</TableCell>
                                        <TableCell>{`${format(parseISO(booking.checkIn), 'LLL dd, y')} - ${format(parseISO(booking.checkOut), 'LLL dd, y')}`}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(booking.status)}>{bookingsDict.statuses[booking.status]}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">{formatCurrency(booking.amount * priceRates[currency], currency)}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild><Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">Toggle menu</span></Button></DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>{bookingsDict.actions}</DropdownMenuLabel>
                                                    <DropdownMenuItem>{bookingsDict.actionsMenu.viewDetails}</DropdownMenuItem>
                                                    <DropdownMenuItem>{bookingsDict.actionsMenu.checkIn}</DropdownMenuItem>
                                                    <DropdownMenuItem>{bookingsDict.actionsMenu.checkOut}</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive">{bookingsDict.actionsMenu.cancel}</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Tabs>
        </div>
    )
}
