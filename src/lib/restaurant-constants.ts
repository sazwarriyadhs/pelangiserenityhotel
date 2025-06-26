
export type MenuItem = {
    id: string;
    name: string;
    description: string;
    price: number; // in USD
    category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Drinks';
    image: string;
    aiHint: string;
};

export const menuItems: MenuItem[] = [
    // Breakfast
    {
        id: 'B-001',
        name: 'Classic American Breakfast',
        description: 'Two eggs any style, bacon or sausage, toast, and breakfast potatoes.',
        price: 15.00,
        category: 'Breakfast',
        image: 'https://placehold.co/600x400.png',
        aiHint: 'american breakfast',
    },
    {
        id: 'B-002',
        name: 'Avocado Toast',
        description: 'Smashed avocado on sourdough toast with red pepper flakes and a poached egg.',
        price: 12.50,
        category: 'Breakfast',
        image: 'https://placehold.co/600x400.png',
        aiHint: 'avocado toast',
    },
    // Lunch
    {
        id: 'L-001',
        name: 'Grilled Chicken Sandwich',
        description: 'Grilled chicken breast with lettuce, tomato, and aioli on a brioche bun. Served with fries.',
        price: 18.00,
        category: 'Lunch',
        image: 'https://placehold.co/600x400.png',
        aiHint: 'chicken sandwich',
    },
    {
        id: 'L-002',
        name: 'Caesar Salad',
        description: 'Crisp romaine lettuce, parmesan cheese, croutons, and Caesar dressing. Add chicken for $5.',
        price: 14.00,
        category: 'Lunch',
        image: 'https://placehold.co/600x400.png',
        aiHint: 'caesar salad',
    },
    // Dinner
    {
        id: 'D-001',
        name: 'Filet Mignon',
        description: '8oz center-cut filet, served with mashed potatoes and grilled asparagus.',
        price: 45.00,
        category: 'Dinner',
        image: 'https://placehold.co/600x400.png',
        aiHint: 'filet mignon',
    },
    {
        id: 'D-002',
        name: 'Pan-Seared Salmon',
        description: 'Salmon fillet with a crispy skin, served over a bed of quinoa and seasonal vegetables.',
        price: 32.00,
        category: 'Dinner',
        image: 'https://placehold.co/600x400.png',
        aiHint: 'seared salmon',
    },
     {
        id: 'D-003',
        name: 'Lobster Ravioli',
        description: 'Handmade ravioli stuffed with lobster meat in a creamy tomato sauce.',
        price: 35.00,
        category: 'Dinner',
        image: 'https://placehold.co/600x400.png',
        aiHint: 'lobster ravioli',
    },
    // Drinks
    {
        id: 'K-001',
        name: 'Espresso',
        description: 'A strong shot of freshly brewed coffee.',
        price: 4.00,
        category: 'Drinks',
        image: 'https://placehold.co/600x400.png',
        aiHint: 'espresso shot',
    },
    {
        id: 'K-002',
        name: 'Old Fashioned',
        description: 'Bourbon, a sugar cube, Angostura bitters, and an orange peel.',
        price: 16.00,
        category: 'Drinks',
        image: 'https://placehold.co/600x400.png',
        aiHint: 'old fashioned cocktail',
    },
];

export type OrderStatus = 'Pending' | 'InProgress' | 'Served' | 'Cancelled';
export type OrderType = 'DineIn' | 'TakeAway' | 'RoomService';

export type Order = {
    id: string;
    customer: string; // Guest name or Table number
    type: OrderType;
    status: OrderStatus;
    amount: number;
    date: string;
}

export const orders: Order[] = [
    { id: 'ORD-001', customer: 'Room 201', type: 'RoomService', status: 'Served', amount: 55.50, date: '2024-07-29T10:00:00Z' },
    { id: 'ORD-002', customer: 'Table 5', type: 'DineIn', status: 'InProgress', amount: 120.00, date: '2024-07-29T12:30:00Z' },
    { id: 'ORD-003', customer: 'Alice Johnson', type: 'TakeAway', status: 'Pending', amount: 32.00, date: '2024-07-29T13:00:00Z' },
    { id: 'ORD-004', customer: 'Room 102', type: 'RoomService', status: 'Pending', amount: 25.00, date: '2024-07-29T14:15:00Z' },
    { id: 'ORD-005', customer: 'Table 2', type: 'DineIn', status: 'Cancelled', amount: 78.00, date: '2024-07-29T11:00:00Z' },
    { id: 'ORD-006', customer: 'Bob Williams', type: 'TakeAway', status: 'Served', amount: 18.50, date: '2024-07-28T18:00:00Z' },
];


export type TableStatus = 'Available' | 'Occupied' | 'Reserved';

export type Table = {
    id: string;
    number: number;
    capacity: number;
    status: TableStatus;
}

export const initialTables: Table[] = [
    { id: 'T1', number: 1, capacity: 2, status: 'Available' },
    { id: 'T2', number: 2, capacity: 4, status: 'Occupied' },
    { id: 'T3', number: 3, capacity: 2, status: 'Available' },
    { id: 'T4', number: 4, capacity: 4, status: 'Reserved' },
    { id: 'T5', number: 5, capacity: 6, status: 'Available' },
    { id: 'T6', number: 6, capacity: 4, status: 'Available' },
    { id: 'T7', number: 7, capacity: 8, status: 'Occupied' },
    { id: 'T8', number: 8, capacity: 2, status: 'Available' },
];
