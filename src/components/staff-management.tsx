'use client'

import { useState } from 'react'
import { useAuth } from '@/context/auth-provider'
import { AccessDenied } from '@/components/access-denied'
import type { Locale } from '@/config/i18n-config'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, PlusCircle } from 'lucide-react'
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'


type StaffRole = 'Admin' | 'Staff' | 'Housekeeping';
type StaffStatus = 'Active' | 'Inactive';

type StaffMember = {
    id: string;
    name: string;
    email: string;
    role: StaffRole;
    status: StaffStatus;
};

const mockStaff: StaffMember[] = [
    { id: 'STF-001', name: 'Admin User', email: 'admin@serenity-hotel.com', role: 'Admin', status: 'Active' },
    { id: 'STF-002', name: 'Receptionist One', email: 'staff1@serenity-hotel.com', role: 'Staff', status: 'Active' },
    { id: 'STF-003', name: 'Housekeeper One', email: 'hk1@serenity-hotel.com', role: 'Housekeeping', status: 'Active' },
    { id: 'STF-004', name: 'Former Staff', email: 'former@serenity-hotel.com', role: 'Staff', status: 'Inactive' },
];

const getStaffFormSchema = (dictionary: any) => z.object({
  name: z.string().min(1, { message: dictionary.errors.nameRequired }),
  email: z.string().email({ message: dictionary.errors.emailInvalid }),
  role: z.string({ required_error: dictionary.errors.roleRequired }),
});

export function StaffManagement({ dictionary, lang }: { dictionary: any, lang: Locale }) {
    const { user } = useAuth()
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const isAuthorized = user && (user.role === 'admin')

    const staffDict = dictionary.dashboard.staffPage;
    const dialogDict = staffDict.addStaffDialog;
    const staffFormSchema = getStaffFormSchema(dialogDict);

    const form = useForm<z.infer<typeof staffFormSchema>>({
      resolver: zodResolver(staffFormSchema),
    });

    if (!isAuthorized) {
        return <AccessDenied dictionary={dictionary.accessDenied} lang={lang} />
    }
    
    function onAddStaff(data: z.infer<typeof staffFormSchema>) {
      toast({
        title: dialogDict.success.title,
        description: dialogDict.success.description.replace('{name}', data.name)
      });
      console.log("New Staff Data:", data);
      setIsDialogOpen(false);
      form.reset();
    }
    
    const getStatusVariant = (status: StaffStatus): "default" | "secondary" | "destructive" => {
        switch (status) {
            case 'Active': return 'default'
            case 'Inactive': return 'secondary'
            default: return 'default'
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">{staffDict.title}</h1>
                    <p className="text-muted-foreground">{staffDict.description}</p>
                </div>
                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            {staffDict.addNew}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{dialogDict.title}</DialogTitle>
                            <DialogDescription>{dialogDict.description}</DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onAddStaff)} className="space-y-4">
                                <FormField control={form.control} name="name" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{dialogDict.name}</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{dialogDict.email}</FormLabel>
                                        <FormControl><Input type="email" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="role" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{dialogDict.role}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder={dialogDict.selectRole} /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {(Object.keys(staffDict.roles) as StaffRole[]).map((role) => (
                                                    <SelectItem key={role} value={role}>{staffDict.roles[role]}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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

            <Card>
                <CardHeader>
                    <CardTitle>{staffDict.tableTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{staffDict.headers.name}</TableHead>
                                <TableHead>{staffDict.headers.email}</TableHead>
                                <TableHead>{staffDict.headers.role}</TableHead>
                                <TableHead>{staffDict.headers.status}</TableHead>
                                <TableHead><span className="sr-only">{staffDict.actions}</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockStaff.map((staff) => (
                                <TableRow key={staff.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={`https://placehold.co/100x100.png?text=${staff.name.charAt(0)}`} alt={staff.name} data-ai-hint="avatar person" />
                                                <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="font-medium">{staff.name}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{staff.email}</TableCell>
                                    <TableCell>{staffDict.roles[staff.role]}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(staff.status)}>{staffDict.statuses[staff.status]}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">{staffDict.actions}</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>{staffDict.actionsMenu.edit}</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">{staffDict.actionsMenu.deactivate}</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
