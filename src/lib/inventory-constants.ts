
export type ItemCategory = 'Housekeeping' | 'Kitchen' | 'Bar' | 'Utility';

export type InventoryItem = {
    id: string;
    name: string;
    category: ItemCategory;
    quantity: number;
    lowStockThreshold: number;
    supplier: string;
}

export const initialInventoryItems: InventoryItem[] = [
    // Housekeeping
    { id: 'HK-001', name: 'Linen - Bath Towel', category: 'Housekeeping', quantity: 150, lowStockThreshold: 20, supplier: 'Luxury Linens Co.' },
    { id: 'HK-002', name: 'Amenity - Shampoo (30ml)', category: 'Housekeeping', quantity: 500, lowStockThreshold: 100, supplier: 'Hotel Supplies Inc.' },
    { id: 'HK-003', name: 'Amenity - Soap Bar (25g)', category: 'Housekeeping', quantity: 450, lowStockThreshold: 100, supplier: 'Hotel Supplies Inc.' },
    
    // Kitchen
    { id: 'KT-001', name: 'Beef - Filet Mignon (kg)', category: 'Kitchen', quantity: 10, lowStockThreshold: 5, supplier: 'Prime Meats Ltd.' },
    { id: 'KT-002', name: 'Vegetable - Potatoes (kg)', category: 'Kitchen', quantity: 50, lowStockThreshold: 10, supplier: 'Farm Fresh Produce' },
    { id: 'KT-003', name: 'Dairy - Milk (L)', category: 'Kitchen', quantity: 20, lowStockThreshold: 5, supplier: 'Local Dairy Farm' },

    // Bar
    { id: 'BR-001', name: 'Spirit - Bourbon (750ml)', category: 'Bar', quantity: 12, lowStockThreshold: 3, supplier: 'Global Beverage Dist.' },
    { id: 'BR-002', name: 'Mixer - Tonic Water (can)', category: 'Bar', quantity: 200, lowStockThreshold: 50, supplier: 'Global Beverage Dist.' },
    { id: 'BR-003', name: 'Garnish - Oranges (unit)', category: 'Bar', quantity: 30, lowStockThreshold: 10, supplier: 'Farm Fresh Produce' },

    // Utility
    { id: 'UT-001', name: 'Cleaning - All-Purpose Cleaner (L)', category: 'Utility', quantity: 25, lowStockThreshold: 5, supplier: 'Janitorial Direct' },
    { id: 'UT-002', name: 'Light Bulb - LED E26', category: 'Utility', quantity: 80, lowStockThreshold: 20, supplier: 'Janitorial Direct' },
];
