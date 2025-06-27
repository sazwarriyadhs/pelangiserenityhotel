export type Room = {
  name: string;
  description: string;
  image: string;
  aiHint: string;
  price: number;
};

export const rooms: Room[] = [
  {
    name: "Deluxe Queen Room",
    description: "A spacious room with a queen-sized bed, offering a stunning city view.",
    image: "/images/room-deluxe.png",
    aiHint: "hotel room",
    price: 250,
  },
  {
    name: "Luxury King Suite",
    description: "Experience ultimate luxury in our suite with a king-sized bed and a separate living area.",
    image: "/images/room-suite.png",
    aiHint: "luxury suite",
    price: 450,
  },
  {
    name: "Presidential Suite",
    description: "The pinnacle of luxury, this suite offers unparalleled amenities and panoramic views.",
    image: "/images/room-presidential.png",
    aiHint: "presidential suite",
    price: 1200,
  },
];
