import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { rooms } from "@/lib/constants";
import Link from "next/link";

export function RoomShowcase() {
  return (
    <div className="flex flex-col items-center text-center">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline text-primary">Our Accommodations</h2>
      <p className="mt-4 max-w-2xl text-muted-foreground md:text-xl/relaxed">
        Each of our rooms and suites is designed with your comfort and luxury in mind.
      </p>
      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <Card key={room.name} className="flex flex-col overflow-hidden border-primary/20 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-2">
            <CardHeader>
              <CardTitle className="font-headline text-primary">{room.name}</CardTitle>
              <CardDescription>{room.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="aspect-video overflow-hidden rounded-md">
                <Image
                  src={room.image}
                  alt={room.name}
                  data-ai-hint={room.aiHint}
                  width={600}
                  height={400}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center bg-black/30 p-4">
              <p className="text-lg font-bold text-primary">${room.price}<span className="text-sm font-normal text-muted-foreground">/night</span></p>
              <Button asChild>
                <Link href="#booking">Book Now</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
