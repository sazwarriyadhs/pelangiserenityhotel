
export type Testimonial = {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    comment: string;
    published: boolean;
};

export const initialTestimonials: Testimonial[] = [
    {
        id: 'T-001',
        name: 'Alice Johnson',
        avatar: '/images/avatars/avatar1.png',
        rating: 5,
        comment: 'Absolutely breathtaking! The views are incredible and the service was top-notch. Can\'t wait to come back.',
        published: true,
    },
    {
        id: 'T-002',
        name: 'Carlos Gomez',
        avatar: '/images/avatars/avatar2.png',
        rating: 5,
        comment: 'The restaurant was a highlight of our stay. Every meal was a culinary delight. Highly recommended for foodies!',
        published: true,
    },
    {
        id: 'T-003',
        name: 'Samantha Lee',
        avatar: '/images/avatars/avatar3.png',
        rating: 4,
        comment: 'A wonderful and relaxing experience. The room was clean and comfortable. The pool area could use more shade, but otherwise, it was perfect.',
        published: false,
    },
    {
        id: 'T-004',
        name: 'David Chen',
        avatar: '/images/avatars/avatar4.png',
        rating: 5,
        comment: 'From check-in to check-out, everything was seamless. The staff are incredibly friendly and helpful. Truly a 5-star experience.',
        published: true,
    }
];
