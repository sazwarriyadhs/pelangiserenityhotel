'use client'

import { useState } from 'react'
import { useAuth } from '@/context/auth-provider'
import { AccessDenied } from '@/components/access-denied'
import type { Locale } from '@/config/i18n-config'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

type RoomStatus = 'Clean' | 'Dirty' | 'In Progress' | 'Inspected';

const initialHousekeepingStatus: { id: string; roomName: string; status: RoomStatus; assignedTo: string; notes: string }[] = [
    { id: 'R-101', roomName: 'Deluxe Queen Room (101)', status: 'Clean', assignedTo: 'Anna', notes: '' },
    { id: 'R-102', roomName: 'Deluxe Queen Room (102)', status: 'Dirty', assignedTo: 'John', notes: 'Needs deep clean' },
    { id: 'R-103', roomName: 'Deluxe Queen Room (103)', status: 'In Progress', assignedTo: 'John', notes: '' },
    { id: 'R-201', roomName: 'Luxury King Suite (201)', status: 'Inspected', assignedTo: 'Maria', notes: 'Ready for guest' },
    { id: 'R-202', roomName: 'Luxury King Suite (202)', status: 'Dirty', assignedTo: 'Peter', notes: 'Guest just checked out' },
    { id: 'R-301', roomName: 'Presidential Suite (301)', status: 'Clean', assignedTo: 'Susan', notes: '' },
];


export function HousekeepingManagement({ dictionary, lang }: { dictionary: any, lang: Locale }) {
    const { user } = useAuth()
    const [statuses, setStatuses] = useState(initialHousekeepingStatus);
    const isAuthorized = user && (user.role === 'admin' || user.role === 'staff')

    const housekeepingDict = dictionary.dashboard.housekeepingPage;

    if (!isAuthorized) {
        return <AccessDenied dictionary={dictionary.accessDenied} lang={lang} />
    }
    
    const handleStatusChange = (roomId: string, newStatus: RoomStatus) => {
        setStatuses(currentStatuses =>
            currentStatuses.map(room =>
                room.id === roomId ? { ...room, status: newStatus } : room
            )
        );
    };

    const getStatusVariant = (status: RoomStatus): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
            case 'Clean': return 'default'
            case 'Dirty': return 'destructive'
            case 'In Progress': return 'secondary'
            case 'Inspected': return 'outline'
            default: return 'secondary'
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">{housekeepingDict.title}</h1>
                <p className="text-muted-foreground">{housekeepingDict.description}</p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>{housekeepingDict.tableTitle}</CardTitle>
                    <CardDescription>{housekeepingDict.tableDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{housekeepingDict.headers.room}</TableHead>
                                <TableHead>{housekeepingDict.headers.status}</TableHead>
                                <TableHead>{housekeepingDict.headers.assignedTo}</TableHead>
                                <TableHead>{housekeepingDict.headers.notes}</TableHead>
                                <TableHead className="text-right">{housekeepingDict.headers.actions}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {statuses.map((room) => (
                                <TableRow key={room.id}>
                                    <TableCell className="font-medium">{room.roomName}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(room.status)}>{housekeepingDict.statuses[room.status]}</Badge>
                                    </TableCell>
                                    <TableCell>{room.assignedTo}</TableCell>
                                    <TableCell>{room.notes}</TableCell>
                                    <TableCell className="text-right">
                                        <Select
                                            value={room.status}
                                            onValueChange={(newStatus: RoomStatus) => handleStatusChange(room.id, newStatus)}
                                        >
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder={housekeepingDict.updateStatus} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(Object.keys(housekeepingDict.statuses) as RoomStatus[]).map(statusKey => (
                                                    <SelectItem key={statusKey} value={statusKey}>{housekeepingDict.statuses[statusKey]}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
