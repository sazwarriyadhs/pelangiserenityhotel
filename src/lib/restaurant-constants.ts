
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
