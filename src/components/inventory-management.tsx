
'use client'

import { useState, useMemo } from 'react'
import { useAuth } from '@/context/auth-provider'
import { AccessDenied } from '@/components/access-denied'
import type { Locale } from '@/config/i18n-config'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { Button } from "@/components/ui/button"
import { Badge } from '@/components/ui/badge'
import { Boxes, PackagePlus, ArrowRightLeft, PlusCircle } from 'lucide-react'
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { initialInventoryItems, type InventoryItem, type ItemCategory } from '@/lib/inventory-constants'

const getAddItemFormSchema = (dictionary: any) => z.object({
  name: z.string().min(1, { message: dictionary.errors.nameRequired }),
  category: z.string({ required_error: dictionary.errors.categoryRequired }),
  quantity: z.coerce.number().min(0, { message: dictionary.errors.quantityNonNegative }),
  lowStockThreshold: z.coerce.number().min(0, { message: dictionary.errors.thresholdNonNegative }),
  supplier: z.string().optional(),
});

const getStockMovementFormSchema = (dictionary: any) => z.object({
  itemId: z.string({ required_error: dictionary.errors.itemRequired }),
  movementType: z.enum(['in', 'out'], { required_error: dictionary.errors.movementTypeRequired }),
  quantity: z.coerce.number().min(1, { message: dictionary.errors.quantityPositive }),
});

export function InventoryManagement({ dictionary, lang }: { dictionary: any, lang: Locale }) {
    const { user } = useAuth()
    const { toast } = useToast();
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(initialInventoryItems);
    const [activeTab, setActiveTab] = useState<ItemCategory | "All">("All");
    const [isAddDialog, setAddDialog] = useState(false);
    const [isMoveDialog, setMoveDialog] = useState(false);
    
    const inventoryDict = dictionary.dashboard.inventoryPage;
    const addItemDialogDict = inventoryDict.addItemDialog;
    const moveStockDialogDict = inventoryDict.moveStockDialog;

    const addItemFormSchema = getAddItemFormSchema(addItemDialogDict);
    const moveStockFormSchema = getStockMovementFormSchema(moveStockDialogDict);

    const addItemForm = useForm<z.infer<typeof addItemFormSchema>>({ resolver: zodResolver(addItemFormSchema) });
    const moveStockForm = useForm<z.infer<typeof moveStockFormSchema>>({ resolver: zodResolver(moveStockFormSchema) });

    const filteredItems = useMemo(() => {
        if (activeTab === 'All') return inventoryItems;
        return inventoryItems.filter(i => i.category === activeTab);
    }, [activeTab, inventoryItems]);

    const lowStockCount = useMemo(() => {
        return inventoryItems.filter(i => i.quantity <= i.lowStockThreshold).length;
    }, [inventoryItems]);
    
    const isAuthorized = user && (user.role === 'admin' || user.role === 'staff')

    if (!isAuthorized) {
        return <AccessDenied dictionary={dictionary.accessDenied} lang={lang} />
    }
    
    function onAddItem(data: z.infer<typeof addItemFormSchema>) {
      const newItem: InventoryItem = {
          id: `INV-${Math.floor(Math.random() * 1000)}`,
          name: data.name,
          category: data.category as ItemCategory,
          quantity: data.quantity,
          lowStockThreshold: data.lowStockThreshold,
          supplier: data.supplier || '',
      };
      setInventoryItems(prev => [...prev, newItem]);
      toast({
        title: addItemDialogDict.success.title,
        description: addItemDialogDict.success.description.replace('{name}', data.name)
      });
      setAddDialog(false);
      addItemForm.reset();
    }

    function onMoveStock(data: z.infer<typeof moveStockFormSchema>) {
      setInventoryItems(prev => prev.map(item => {
        if (item.id === data.itemId) {
            const newQuantity = data.movementType === 'in'
                ? item.quantity + data.quantity
                : item.quantity - data.quantity;
            
            if (newQuantity < 0) {
                toast({ variant: 'destructive', title: moveStockDialogDict.errors.insufficientStock });
                return item;
            }
            return { ...item, quantity: newQuantity };
        }
        return item;
      }));
      toast({
        title: moveStockDialogDict.success.title,
        description: moveStockDialogDict.success.description.replace('{quantity}', data.quantity.toString()).replace('{type}', moveStockDialogDict[data.movementType]).replace('{itemName}', inventoryItems.find(i=>i.id===data.itemId)?.name ?? '')
      });
      setMoveDialog(false);
      moveStockForm.reset();
    }
    
    const categories: ItemCategory[] = ['Housekeeping', 'Kitchen', 'Bar', 'Utility'];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">{inventoryDict.title}</h1>
                    <p className="text-muted-foreground">{inventoryDict.description}</p>
                </div>
                <div className="flex gap-2">
                    <Dialog open={isMoveDialog} onOpenChange={setMoveDialog}>
                        <DialogTrigger asChild><Button variant="outline"><ArrowRightLeft className="mr-2"/>{inventoryDict.recordMovement}</Button></DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{moveStockDialogDict.title}</DialogTitle>
                                <DialogDescription>{moveStockDialogDict.description}</DialogDescription>
                            </DialogHeader>
                            <Form {...moveStockForm}>
                                <form onSubmit={moveStockForm.handleSubmit(onMoveStock)} className="space-y-4">
                                    <FormField control={moveStockForm.control} name="itemId" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{moveStockDialogDict.item}</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder={moveStockDialogDict.selectItem} /></SelectTrigger></FormControl>
                                                <SelectContent>{inventoryItems.map(item => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent>
                                            </Select><FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={moveStockForm.control} name="movementType" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{moveStockDialogDict.movementType}</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder={moveStockDialogDict.selectType} /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="in">{moveStockDialogDict.in}</SelectItem>
                                                    <SelectItem value="out">{moveStockDialogDict.out}</SelectItem>
                                                </SelectContent>
                                            </Select><FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={moveStockForm.control} name="quantity" render={({ field }) => (
                                        <FormItem><FormLabel>{moveStockDialogDict.quantity}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <DialogFooter>
                                        <DialogClose asChild><Button type="button" variant="secondary">{moveStockDialogDict.cancel}</Button></DialogClose>
                                        <Button type="submit">{moveStockDialogDict.submit}</Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                     <Dialog open={isAddDialog} onOpenChange={setAddDialog}>
                        <DialogTrigger asChild><Button><PlusCircle className="mr-2"/>{inventoryDict.addNewItem}</Button></DialogTrigger>
                        <DialogContent>
                             <DialogHeader>
                                <DialogTitle>{addItemDialogDict.title}</DialogTitle>
                                <DialogDescription>{addItemDialogDict.description}</DialogDescription>
                            </DialogHeader>
                             <Form {...addItemForm}>
                                <form onSubmit={addItemForm.handleSubmit(onAddItem)} className="space-y-4">
                                    <FormField control={addItemForm.control} name="name" render={({ field }) => (
                                        <FormItem><FormLabel>{addItemDialogDict.name}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                     <FormField control={addItemForm.control} name="category" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{addItemDialogDict.category}</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder={addItemDialogDict.selectCategory} /></SelectTrigger></FormControl>
                                                <SelectContent>{categories.map(cat => <SelectItem key={cat} value={cat}>{inventoryDict.categories[cat]}</SelectItem>)}</SelectContent>
                                            </Select><FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={addItemForm.control} name="quantity" render={({ field }) => (
                                        <FormItem><FormLabel>{addItemDialogDict.initialStock}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={addItemForm.control} name="lowStockThreshold" render={({ field }) => (
                                        <FormItem><FormLabel>{addItemDialogDict.lowStockAt}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={addItemForm.control} name="supplier" render={({ field }) => (
                                        <FormItem><FormLabel>{addItemDialogDict.supplier}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <DialogFooter>
                                        <DialogClose asChild><Button type="button" variant="secondary">{addItemDialogDict.cancel}</Button></DialogClose>
                                        <Button type="submit">{addItemDialogDict.submit}</Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{inventoryDict.stats.totalItems}</CardTitle>
                        <Boxes className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{inventoryItems.length}</div></CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{inventoryDict.stats.lowStockItems}</CardTitle>
                        <PackagePlus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${lowStockCount > 0 ? 'text-destructive' : ''}`}>{lowStockCount}</div>
                    </CardContent>
                </Card>
            </div>

            <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)}>
                <TabsList>
                    <TabsTrigger value="All">{inventoryDict.categories.All}</TabsTrigger>
                    {categories.map(cat => <TabsTrigger key={cat} value={cat}>{inventoryDict.categories[cat]}</TabsTrigger>)}
                </TabsList>
                <Card className="mt-4">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{inventoryDict.headers.item}</TableHead>
                                    <TableHead>{inventoryDict.headers.category}</TableHead>
                                    <TableHead className="text-center">{inventoryDict.headers.stock}</TableHead>
                                    <TableHead>{inventoryDict.headers.supplier}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredItems.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell>{inventoryDict.categories[item.category]}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={item.quantity <= item.lowStockThreshold ? 'destructive' : 'outline'}>
                                                {item.quantity}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{item.supplier}</TableCell>
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
