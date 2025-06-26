
'use client'

import { useState, useMemo } from 'react'
import { useAuth } from '@/context/auth-provider'
import { AccessDenied } from '@/components/access-denied'
import type { Locale } from '@/config/i18n-config'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { orders as initialOrders, type Order, type OrderStatus } from '@/lib/restaurant-constants'
import { useToast } from "@/hooks/use-toast";
import { Separator } from '../ui/separator'

export function KitchenDisplay({ dictionary, lang }: { dictionary: any, lang: Locale }) {
    const { user } = useAuth()
    const { toast } = useToast();
    const [orders, setOrders] = useState<Order[]>(initialOrders.filter(o => o.status !== 'Cancelled' && o.status !== 'Served'));

    const isAuthorized = user && (user.role === 'admin' || user.role === 'staff')
    
    const kitchenDict = dictionary.dashboard.restaurant.kitchenDisplayPage;

    const newOrders = useMemo(() => orders.filter(o => o.status === 'Pending'), [orders]);
    const inProgressOrders = useMemo(() => orders.filter(o => o.status === 'InProgress'), [orders]);

    if (!isAuthorized) {
        return <AccessDenied dictionary={dictionary.accessDenied} lang={lang} />
    }
    
    const handleStatusUpdate = (orderId: string, status: OrderStatus) => {
        const updatedOrders = orders.map(o => o.id === orderId ? {...o, status} : o);
        
        if (status === 'Served') {
            // Remove from display after a short delay to simulate completion
            setOrders(updatedOrders.filter(o => o.id !== orderId));
        } else {
            setOrders(updatedOrders);
        }
        
        toast({
            title: kitchenDict.toast.statusUpdated,
            description: kitchenDict.toast.orderStatusNow.replace('{orderId}', orderId).replace('{status}', dictionary.dashboard.restaurant.orderManagementPage.statuses[status]),
        })
    }
    
    const renderOrderCard = (order: Order) => (
        <Card key={order.id} className="mb-4">
            <CardHeader>
                <CardTitle className="text-lg flex justify-between">
                    <span>{kitchenDict.orderId} #{order.id.split('-')[1]}</span>
                    <Badge variant="secondary">{dictionary.dashboard.restaurant.orderManagementPage.types[order.type]}</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">{kitchenDict.customer}: {order.customer}</p>
            </CardHeader>
            <CardContent>
                <p className="font-semibold mb-2">{kitchenDict.items}:</p>
                <ul className="list-disc pl-5 space-y-1">
                    {order.items.map(item => (
                        <li key={item.id}>
                            <span className="font-medium">{item.quantity}x</span> {item.name}
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
                 {order.status === 'Pending' && (
                    <Button className="w-full" onClick={() => handleStatusUpdate(order.id, 'InProgress')}>
                        {kitchenDict.startCooking}
                    </Button>
                )}
                {order.status === 'InProgress' && (
                    <Button className="w-full" onClick={() => handleStatusUpdate(order.id, 'Served')}>
                        {kitchenDict.markAsReady}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">{kitchenDict.title}</h1>
                <p className="text-muted-foreground">{kitchenDict.description}</p>
            </div>
            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-muted/30 rounded-lg p-4">
                    <h2 className="text-xl font-bold mb-4">{kitchenDict.newOrders} ({newOrders.length})</h2>
                    <div className="space-y-4 h-full overflow-y-auto">
                        {newOrders.length > 0 ? newOrders.map(renderOrderCard) : <p className="text-muted-foreground">{kitchenDict.noOrders}</p>}
                    </div>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                    <h2 className="text-xl font-bold mb-4">{kitchenDict.inProgress} ({inProgressOrders.length})</h2>
                    <div className="space-y-4 h-full overflow-y-auto">
                         {inProgressOrders.length > 0 ? inProgressOrders.map(renderOrderCard) : <p className="text-muted-foreground">{kitchenDict.noOrders}</p>}
                    </div>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                    <h2 className="text-xl font-bold mb-4">{kitchenDict.readyForPickup}</h2>
                     <div className="space-y-4 h-full overflow-y-auto">
                        <p className="text-muted-foreground">{kitchenDict.pickupInstructions}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
