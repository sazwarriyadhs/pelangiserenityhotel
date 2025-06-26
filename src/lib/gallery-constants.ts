
export type GalleryCategory = 'Rooms' | 'Restaurant' | 'Pool' | 'Spa' | 'Events';

export type GalleryImage = {
    id: string;
    src: string;
    alt: string;
    category: GalleryCategory;
    aiHint: string;
};

export const initialGalleryImages: GalleryImage[] = [
    // Rooms
    { id: 'img-room-1', src: 'https://placehold.co/400x300.png', alt: 'Spacious Deluxe Queen Room', category: 'Rooms', aiHint: 'hotel room' },
    { id: 'img-room-2', src: 'https://placehold.co/400x300.png', alt: 'Modern bathroom in Luxury King Suite', category: 'Rooms', aiHint: 'hotel bathroom' },
    { id: 'img-room-3', src: 'https://placehold.co/400x300.png', alt: 'Balcony view from the Presidential Suite', category: 'Rooms', aiHint: 'ocean view' },

    // Restaurant
    { id: 'img-resto-1', src: 'https://placehold.co/400x300.png', alt: 'Elegant dining area at our restaurant', category: 'Restaurant', aiHint: 'elegant restaurant' },
    { id: 'img-resto-2', src: 'https://placehold.co/400x300.png', alt: 'A gourmet dish prepared by our chef', category: 'Restaurant', aiHint: 'gourmet food' },
    { id: 'img-resto-3', src: 'https://placehold.co/400x300.png', alt: 'Cozy bar with a wide selection of drinks', category: 'Restaurant', aiHint: 'hotel bar' },

    // Pool
    { id: 'img-pool-1', src: 'https://placehold.co/400x300.png', alt: 'Infinity pool overlooking the ocean', category: 'Pool', aiHint: 'infinity pool' },
    { id: 'img-pool-2', src: 'https://placehold.co/400x300.png', alt: 'Relaxing poolside lounge chairs', category: 'Pool', aiHint: 'poolside lounge' },
    
    // Spa
    { id: 'img-spa-1', src: 'https://placehold.co/400x300.png', alt: 'Serene spa treatment room', category: 'Spa', aiHint: 'spa room' },

    // Events
    { id: 'img-event-1', src: 'https://placehold.co/400x300.png', alt: 'Wedding setup at our ballroom', category: 'Events', aiHint: 'wedding ballroom' },
];
