
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useAuth } from '@/context/auth-provider'
import { AccessDenied } from '@/components/access-denied'
import type { Locale } from '@/config/i18n-config'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, PlusCircle } from 'lucide-react'
import { rooms as initialRooms, type Room } from '@/lib/constants'
import { useCurrency } from '@/context/currency-provider'
import { formatCurrency, priceRates } from '@/lib/currency'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from "@/hooks/use-toast";

type RoomStatus = 'Available' | 'Maintenance' | 'Cleaning';
type MockRoom = Room & { status: RoomStatus, id: string };

const mockRooms: MockRoom[] = initialRooms.map((room, index) => ({
    ...room,
    id: `R-${101 + index}`,
    status: (['Available', 'Maintenance', 'Cleaning'] as RoomStatus[])[index % 3],
}));

const getRoomFormSchema = (dictionary: any) => z.object({
  roomName: z.string().min(1, { message: dictionary.errors.roomNameRequired }),
  description: z.string().min(1, { message: dictionary.errors.descriptionRequired }),
  price: z.coerce.number().min(1, { message: dictionary.errors.priceRequired }),
  imageUrl: z.string().url({ message: dictionary.errors.imageUrlInvalid }),
});


export function RoomsManagement({ dictionary, lang }: { dictionary: any, lang: Locale }) {
    const { user } = useAuth()
    const { currency } = useCurrency();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    const isAuthorized = user && (user.role === 'admin' || user.role === 'staff')
    
    const roomsDict = dictionary.dashboard.roomsPage;
    const dialogDict = roomsDict.addRoomDialog;
    const roomFormSchema = getRoomFormSchema(dialogDict);

    const form = useForm<z.infer<typeof roomFormSchema>>({
      resolver: zodResolver(roomFormSchema),
    });

    function onAddRoom(data: z.infer<typeof roomFormSchema>) {
      toast({
        title: dialogDict.success.title,
        description: dialogDict.success.description.replace('{roomName}', data.roomName)
      });
      console.log("New Room Data:", data);
      setIsDialogOpen(false);
      form.reset();
    }
    
    if (!isAuthorized) {
        return <AccessDenied dictionary={dictionary.accessDenied} lang={lang} />
    }

    const getStatusVariant = (status: RoomStatus): "default" | "secondary" | "destructive" => {
        switch (status) {
            case 'Available': return 'default'
            case 'Cleaning': return 'secondary'
            case 'Maintenance': return 'destructive'
            default: return 'default'
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">{roomsDict.title}</h1>
                    <p className="text-muted-foreground">{roomsDict.description}</p>
                </div>
                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            {roomsDict.addNew}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{dialogDict.title}</DialogTitle>
                            <DialogDescription>{dialogDict.description}</DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onAddRoom)} className="space-y-4">
                                <FormField control={form.control} name="roomName" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{dialogDict.roomName}</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="description" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{dialogDict.descriptionField}</FormLabel>
                                        <FormControl><Textarea {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="price" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{dialogDict.pricePerNight} (USD)</FormLabel>
                                        <FormControl><Input type="number" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{dialogDict.imageUrl}</FormLabel>
                                        <FormControl><Input placeholder="https://placehold.co/600x400.png" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <DialogFooter>
                                    <DialogClose asChild><Button type="button" variant="secondary">{dialogDict.cancel}</Button></DialogClose>
                                    <Button type="submit">{dialogDict.submit}</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockRooms.map((room) => (
                    <Card key={room.id} className="flex flex-col">
                        <CardHeader>
                            <div className="aspect-video relative mb-4">
                                <Image 
                                    src={room.image} 
                                    alt={room.name} 
                                    fill 
                                    className="rounded-md object-cover"
                                    data-ai-hint={room.aiHint}
                                />
                            </div>
                            <CardTitle className="flex items-center justify-between">
                                <span>{room.name}</span>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>{roomsDict.edit}</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">{roomsDict.delete}</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardTitle>
                            <CardDescription>{room.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow"></CardContent>
                        <CardFooter className="flex justify-between items-center">
                            <Badge variant={getStatusVariant(room.status)}>{roomsDict.statuses[room.status]}</Badge>
                            <div className="font-semibold text-lg">{formatCurrency(room.price * priceRates[currency], currency)}</div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
