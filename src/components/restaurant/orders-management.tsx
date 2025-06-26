
'use client'

import { useState, useMemo } from 'react'
import { useAuth } from '@/context/auth-provider'
import { AccessDenied } from '@/components/access-denied'
import type { Locale } from '@/config/i18n-config'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Printer } from 'lucide-react'
import { useCurrency } from '@/context/currency-provider'
import { formatCurrency, priceRates } from '@/lib/currency'
import { orders as initialOrders, type Order, type OrderStatus } from '@/lib/restaurant-constants'
import { useToast } from "@/hooks/use-toast";

export function OrdersManagement({ dictionary, lang }: { dictionary: any, lang: Locale }) {
    const { user } = useAuth()
    const { currency } = useCurrency();
    const { toast } = useToast();
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [activeTab, setActiveTab] = useState<OrderStatus | "All">("All");

    const isAuthorized = user && (user.role === 'admin' || user.role === 'staff')
    
    const ordersDict = dictionary.dashboard.restaurant.orderManagementPage;

    const filteredOrders = useMemo(() => {
        if (activeTab === 'All') return orders;
        return orders.filter(o => o.status === activeTab);
    }, [activeTab, orders]);

    if (!isAuthorized) {
        return <AccessDenied dictionary={dictionary.accessDenied} lang={lang} />
    }
    
    const handleStatusUpdate = (orderId: string, status: OrderStatus) => {
        setOrders(currentOrders => 
            currentOrders.map(o => o.id === orderId ? {...o, status} : o)
        );
        toast({
            title: ordersDict.toast.statusUpdated,
            description: ordersDict.toast.orderStatusNow.replace('{orderId}', orderId).replace('{status}', ordersDict.statuses[status]),
        })
    }
    
    const getStatusVariant = (status: OrderStatus): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
            case 'Served': return 'default'
            case 'Pending': return 'secondary'
            case 'Cancelled': return 'destructive'
            case 'InProgress': return 'outline'
            default: return 'secondary'
        }
    }

    const orderStatuses: OrderStatus[] = ['Pending', 'InProgress', 'Served', 'Cancelled'];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">{ordersDict.title}</h1>
                <p className="text-muted-foreground">{ordersDict.description}</p>
            </div>

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger value="All">{ordersDict.tabs.all}</TabsTrigger>
                         {orderStatuses.map(status => (
                            <TabsTrigger key={status} value={status}>{ordersDict.statuses[status]}</TabsTrigger>
                        ))}
                    </TabsList>
                </div>
                <Card className="mt-4">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{ordersDict.headers.orderId}</TableHead>
                                    <TableHead>{ordersDict.headers.customer}</TableHead>
                                    <TableHead>{ordersDict.headers.type}</TableHead>
                                    <TableHead>{ordersDict.headers.status}</TableHead>
                                    <TableHead className="text-right">{ordersDict.headers.amount}</TableHead>
                                    <TableHead><span className="sr-only">{ordersDict.actions}</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">{order.id}</TableCell>
                                        <TableCell>{order.customer}</TableCell>
                                        <TableCell>{ordersDict.types[order.type]}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(order.status)}>{ordersDict.statuses[order.status]}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">{formatCurrency(order.amount * priceRates[currency], currency)}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild><Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">{ordersDict.actions}</span></Button></DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>{ordersDict.actions}</DropdownMenuLabel>
                                                    {orderStatuses.map(status => (
                                                        <DropdownMenuItem key={status} onClick={() => handleStatusUpdate(order.id, status)} disabled={order.status === status}>
                                                            {ordersDict.actionsMenu.updateTo} {ordersDict.statuses[status]}
                                                        </DropdownMenuItem>
                                                    ))}
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        <Printer className="mr-2 h-4 w-4" />
                                                        {ordersDict.actionsMenu.printReceipt}
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
            </Tabs>
        </div>
    )
}
