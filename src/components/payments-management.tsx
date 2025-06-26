'use client'

import { useAuth } from '@/context/auth-provider'
import { AccessDenied } from '@/components/access-denied'
import type { Locale } from '@/config/i18n-config'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from "@/components/ui/button"
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'
import { useCurrency } from '@/context/currency-provider'
import { formatCurrency, priceRates } from '@/lib/currency'
import { CreditCard, DollarSign, FileDown, MoreHorizontal, Receipt } from 'lucide-react'

type TransactionStatus = 'Paid' | 'Pending' | 'Failed';

const mockTransactions = [
    { id: 'TRX-9876', guest: 'Alice Johnson', date: '2024-07-28', amount: 900, status: 'Paid' as TransactionStatus },
    { id: 'TRX-9875', guest: 'Bob Williams', date: '2024-07-28', amount: 500, status: 'Paid' as TransactionStatus },
    { id: 'TRX-9874', guest: 'Charlie Brown', date: '2024-07-27', amount: 2400, status: 'Pending' as TransactionStatus },
    { id: 'TRX-9873', guest: 'Diana Prince', date: '2024-07-26', amount: 250, status: 'Failed' as TransactionStatus },
    { id: 'TRX-9872', guest: 'Ethan Hunt', date: '2024-07-25', amount: 450, status: 'Paid' as TransactionStatus },
    { id: 'TRX-9871', guest: 'Fiona Glenanne', date: '2024-07-24', amount: 750, status: 'Pending' as TransactionStatus },
];

const totalRevenue = 52310.55;
const outstandingInvoices = 2;
const transactionsToday = 5;

export function PaymentsManagement({ dictionary, lang }: { dictionary: any, lang: Locale }) {
    const { user } = useAuth()
    const { currency } = useCurrency();
    const isAuthorized = user && (user.role === 'admin' || user.role === 'staff')

    const paymentsDict = dictionary.dashboard.paymentsPage;

    if (!isAuthorized) {
        return <AccessDenied dictionary={dictionary.accessDenied} lang={lang} />
    }
    
    const getStatusVariant = (status: TransactionStatus): "default" | "secondary" | "destructive" => {
        switch (status) {
            case 'Paid': return 'default'
            case 'Pending': return 'secondary'
            case 'Failed': return 'destructive'
            default: return 'default'
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">{paymentsDict.title}</h1>
                    <p className="text-muted-foreground">{paymentsDict.description}</p>
                </div>
                 <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <FileDown className="mr-2 h-4 w-4" />
                        {paymentsDict.exportReport}
                    </Button>
                    <Button>
                        <Receipt className="mr-2 h-4 w-4" />
                        {paymentsDict.newInvoice}
                    </Button>
                 </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{paymentsDict.stats.totalRevenue}</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalRevenue * priceRates[currency], currency)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{paymentsDict.stats.outstandingInvoices}</CardTitle>
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{outstandingInvoices}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{paymentsDict.stats.transactionsToday}</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{transactionsToday}</div>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>{paymentsDict.recentTransactions.title}</CardTitle>
                    <CardDescription>{paymentsDict.recentTransactions.description}</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{paymentsDict.headers.transactionId}</TableHead>
                                <TableHead>{paymentsDict.headers.guest}</TableHead>
                                <TableHead>{paymentsDict.headers.date}</TableHead>
                                <TableHead>{paymentsDict.headers.status}</TableHead>
                                <TableHead className="text-right">{paymentsDict.headers.amount}</TableHead>
                                <TableHead><span className="sr-only">{paymentsDict.actions}</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockTransactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell className="font-medium">{transaction.id}</TableCell>
                                    <TableCell>{transaction.guest}</TableCell>
                                    <TableCell>{format(new Date(transaction.date), 'LLL dd, y')}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(transaction.status)}>{paymentsDict.statuses[transaction.status]}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{formatCurrency(transaction.amount * priceRates[currency], currency)}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">Toggle menu</span></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>{paymentsDict.viewDetails}</DropdownMenuItem>
                                                {transaction.status === 'Pending' && <DropdownMenuItem>{paymentsDict.sendReminder}</DropdownMenuItem>}
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
