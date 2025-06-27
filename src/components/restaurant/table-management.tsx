
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useAuth } from '@/context/auth-provider'
import { AccessDenied } from '@/components/access-denied'
import type { Locale } from '@/config/i18n-config'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MoreHorizontal, QrCode, User } from 'lucide-react'
import { initialTables, type Table, type TableStatus } from '@/lib/restaurant-constants'

const getReservationFormSchema = (dictionary: any) => z.object({
  customerName: z.string().min(1, { message: dictionary.errors.customerNameRequired }),
  tableId: z.string({ required_error: dictionary.errors.tableRequired }),
});

export function TableManagement({ dictionary, lang }: { dictionary: any, lang: Locale }) {
    const { user } = useAuth()
    const { toast } = useToast();
    const [tables, setTables] = useState<Table[]>(initialTables);
    const [isReserveDialogOpen, setIsReserveDialogOpen] = useState(false);
    const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);

    const isAuthorized = user && (user.role === 'admin' || user.role === 'staff')
    
    const tableDict = dictionary.dashboard.restaurant.tableManagementPage;
    const reserveDialogDict = tableDict.reserveDialog;
    const reservationFormSchema = getReservationFormSchema(reserveDialogDict);

    const form = useForm<z.infer<typeof reservationFormSchema>>({
      resolver: zodResolver(reservationFormSchema),
    });

    if (!isAuthorized) {
        return <AccessDenied dictionary={dictionary.accessDenied} lang={lang} />
    }
    
    const handleStatusUpdate = (tableId: string, status: TableStatus) => {
        setTables(currentTables => 
            currentTables.map(t => t.id === tableId ? {...t, status} : t)
        );
    }
    
    const getStatusVariant = (status: TableStatus): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
            case 'Available': return 'default'
            case 'Occupied': return 'outline'
            case 'Reserved': return 'secondary'
            default: return 'secondary'
        }
    }
    
    function onReserveTable(data: z.infer<typeof reservationFormSchema>) {
        handleStatusUpdate(data.tableId, 'Reserved');
        const table = tables.find(t => t.id === data.tableId);
        toast({
            title: reserveDialogDict.success.title,
            description: reserveDialogDict.success.description
                .replace('{tableNumber}', table?.number.toString() ?? '')
                .replace('{customerName}', data.customerName)
        });
        setIsReserveDialogOpen(false);
        form.reset();
    }
    
    const tableStatuses: TableStatus[] = ['Available', 'Occupied', 'Reserved'];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">{tableDict.title}</h1>
                    <p className="text-muted-foreground">{tableDict.description}</p>
                </div>
                 <Dialog open={isReserveDialogOpen} onOpenChange={setIsReserveDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>{tableDict.reserveTable}</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{reserveDialogDict.title}</DialogTitle>
                            <DialogDescription>{reserveDialogDict.description}</DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onReserveTable)} className="space-y-4">
                                <FormField control={form.control} name="customerName" render={({ field }) => (
                                    <FormItem><FormLabel>{reserveDialogDict.customerName}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                 <FormField control={form.control} name="tableId" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{reserveDialogDict.tableNumber}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder={reserveDialogDict.selectAvailable} /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {tables.filter(t => t.status === 'Available').map((t) => (<SelectItem key={t.id} value={t.id}>{tableDict.table} {t.number}</SelectItem>))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <DialogFooter>
                                    <DialogClose asChild><Button type="button" variant="secondary">{reserveDialogDict.cancel}</Button></DialogClose>
                                    <Button type="submit">{reserveDialogDict.submit}</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {tables.map(table => (
                    <Card key={table.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>{tableDict.table} {table.number}</span>
                                <Badge variant={getStatusVariant(table.status)}>{tableDict.statuses[table.status]}</Badge>
                            </CardTitle>
                             <CardDescription className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {tableDict.capacity.replace('{count}', table.capacity.toString())}
                             </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow"></CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="ghost" size="icon" onClick={() => { setSelectedTable(table); setIsQrDialogOpen(true); }}>
                                <QrCode className="h-5 w-5" />
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">{tableDict.actions.changeStatus}</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>{tableDict.actions.changeStatus}</DropdownMenuLabel>
                                    {tableStatuses.map(status => (
                                        <DropdownMenuItem 
                                            key={status} 
                                            onClick={() => handleStatusUpdate(table.id, status)}
                                            disabled={table.status === status}
                                        >
                                            {tableDict.statuses[status]}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{tableDict.qrDialog.title.replace('{tableNumber}', selectedTable?.number.toString() ?? '')}</DialogTitle>
                        <DialogDescription>{tableDict.qrDialog.description}</DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center p-4">
                        <Image
                            src="/images/qr-code-mock.png"
                            alt={`QR Code for Table ${selectedTable?.number}`}
                            width={200}
                            height={200}
                            data-ai-hint="qr code"
                        />
                    </div>
                     <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" onClick={() => setSelectedTable(null)}>{tableDict.qrDialog.close}</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
