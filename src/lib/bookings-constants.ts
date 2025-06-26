
import { format, addDays, subDays } from 'date-fns'

export type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled' | 'CheckedIn';

export type Booking = { 
    id: string; 
    guest: string; 
    room: string; 
    checkIn: string; 
    checkOut: string; 
    amount: number; 
    status: BookingStatus 
};

const today = new Date();
export const initialBookings: Booking[] = [
    { id: 'BK-1294', guest: 'Alice Johnson', room: 'Luxury King Suite', checkIn: format(today, 'yyyy-MM-dd'), checkOut: format(addDays(today, 3), 'yyyy-MM-dd'), amount: 1350, status: 'Confirmed' },
    { id: 'BK-1293', guest: 'Bob Williams', room: 'Deluxe Queen Room', checkIn: format(today, 'yyyy-MM-dd'), checkOut: format(addDays(today, 2), 'yyyy-MM-dd'), amount: 500, status: 'Confirmed' },
    { id: 'BK-1292', guest: 'Charlie Brown', room: 'Presidential Suite', checkIn: format(addDays(today, 1), 'yyyy-MM-dd'), checkOut: format(addDays(today, 3), 'yyyy-MM-dd'), amount: 2400, status: 'Pending' },
    { id: 'BK-1291', guest: 'Diana Prince', room: 'Deluxe Queen Room', checkIn: format(subDays(today, 2), 'yyyy-MM-dd'), checkOut: format(today, 'yyyy-MM-dd'), amount: 500, status: 'CheckedIn' },
    { id: 'BK-1290', guest: 'Ethan Hunt', room: 'Luxury King Suite', checkIn: format(subDays(today, 5), 'yyyy-MM-dd'), checkOut: format(subDays(today, 2), 'yyyy-MM-dd'), amount: 1350, status: 'Cancelled' },
    { id: 'BK-1289', guest: 'Fiona Glenanne', room: 'Deluxe Queen Room', checkIn: format(addDays(today, 2), 'yyyy-MM-dd'), checkOut: format(addDays(today, 5), 'yyyy-MM-dd'), amount: 750, status: 'Confirmed' },
    { id: 'BK-1288', guest: 'George Costanza', room: 'Presidential Suite', checkIn: format(addDays(today, 10), 'yyyy-MM-dd'), checkOut: format(addDays(today, 15), 'yyyy-MM-dd'), amount: 6000, status: 'Pending' },
    { id: 'BK-1287', guest: 'Hannah Montana', room: 'Deluxe Queen Room', checkIn: format(subDays(today, 1), 'yyyy-MM-dd'), checkOut: format(addDays(today, 1), 'yyyy-MM-dd'), amount: 500, status: 'CheckedIn' },
];
