
'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { useAuth } from '@/context/auth-provider'
import { AccessDenied } from '@/components/access-denied'
import type { Locale } from '@/config/i18n-config'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MoreHorizontal, PlusCircle } from 'lucide-react'
import { useCurrency } from '@/context/currency-provider'
import { formatCurrency, priceRates } from '@/lib/currency'
import { menuItems as initialMenuItems, type MenuItem } from '@/lib/restaurant-constants'

const getMenuFormSchema = (dictionary: any) => z.object({
  name: z.string().min(1, { message: dictionary.errors.nameRequired }),
  description: z.string().min(1, { message: dictionary.errors.descriptionRequired }),
  price: z.coerce.number().min(0, { message: dictionary.errors.priceRequired }),
  category: z.string({ required_error: dictionary.errors.categoryRequired }),
  imageUrl: z.string().url({ message: dictionary.errors.imageUrlInvalid }),
});

type MenuCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Drinks';

export function MenuManagement({ dictionary, lang }: { dictionary: any, lang: Locale }) {
    const { user } = useAuth()
    const { currency } = useCurrency();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const isAuthorized = user && (user.role === 'admin' || user.role === 'staff')
    
    const menuDict = dictionary.dashboard.restaurant.menuManagementPage;
    const dialogDict = menuDict.addMenuDialog;
    const menuFormSchema = getMenuFormSchema(dialogDict);

    const form = useForm<z.infer<typeof menuFormSchema>>({
      resolver: zodResolver(menuFormSchema),
    });

    if (!isAuthorized) {
        return <AccessDenied dictionary={dictionary.accessDenied} lang={lang} />
    }
    
    function onAddItem(data: z.infer<typeof menuFormSchema>) {
      toast({
        title: dialogDict.success.title,
        description: dialogDict.success.description.replace('{name}', data.name)
      });
      console.log("New Menu Item Data:", data);
      setIsDialogOpen(false);
      form.reset();
    }
    
    const categories: MenuCategory[] = ['Breakfast', 'Lunch', 'Dinner', 'Drinks'];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">{menuDict.title}</h1>
                    <p className="text-muted-foreground">{menuDict.description}</p>
                </div>
                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            {menuDict.addNew}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{dialogDict.title}</DialogTitle>
                            <DialogDescription>{dialogDict.description}</DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onAddItem)} className="space-y-4">
                                <FormField control={form.control} name="name" render={({ field }) => (
                                    <FormItem><FormLabel>{dialogDict.name}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="description" render={({ field }) => (
                                    <FormItem><FormLabel>{dialogDict.descriptionField}</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="price" render={({ field }) => (
                                    <FormItem><FormLabel>{dialogDict.price} (USD)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="category" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{dialogDict.category}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder={dialogDict.selectCategory} /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {categories.map((cat) => (<SelectItem key={cat} value={cat}>{menuDict.categories[cat]}</SelectItem>))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                                    <FormItem><FormLabel>{dialogDict.imageUrl}</FormLabel><FormControl><Input placeholder="https://placehold.co/600x400.png" {...field} /></FormControl><FormMessage /></FormItem>
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

            <Tabs defaultValue="Breakfast" className="w-full">
                <TabsList>
                    {categories.map(cat => (
                         <TabsTrigger key={cat} value={cat}>{menuDict.categories[cat]}</TabsTrigger>
                    ))}
                </TabsList>
                {categories.map(cat => (
                    <TabsContent key={cat} value={cat}>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
                            {initialMenuItems.filter(item => item.category === cat).map((item) => (
                                <Card key={item.id} className="flex flex-col">
                                    <CardHeader className="p-0">
                                        <div className="aspect-video relative">
                                            <Image 
                                                src={item.image} 
                                                alt={item.name} 
                                                fill 
                                                className="rounded-t-lg object-cover"
                                                data-ai-hint={item.aiHint}
                                            />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-grow pt-4">
                                        <CardTitle className="flex items-start justify-between text-lg">
                                            <span>{item.name}</span>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>{menuDict.edit}</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">{menuDict.delete}</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </CardTitle>
                                        <CardDescription className="mt-1">{item.description}</CardDescription>
                                    </CardContent>
                                    <CardFooter className="flex justify-end items-center">
                                        <div className="font-semibold text-lg">{formatCurrency(item.price * priceRates[currency], currency)}</div>
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
