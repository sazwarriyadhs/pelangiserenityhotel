"use client"

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
import { useCurrency } from "@/context/currency-provider";
import { priceRates } from "@/config/i18n-config";
import type { Currency } from "@/context/currency-provider";

function formatCurrency(amount: number, currency: Currency) {
    if (currency === 'IDR') {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export function RoomShowcase({ dictionary }: { dictionary: any }) {
  const { currency } = useCurrency();

  return (
    <div className="flex flex-col items-center text-center">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline text-primary">{dictionary.title}</h2>
      <p className="mt-4 max-w-2xl text-muted-foreground md:text-xl/relaxed">
        {dictionary.subtitle}
      </p>
      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => {
            const price = room.price * priceRates[currency];
            return (
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
                  <p className="text-lg font-bold text-primary">{formatCurrency(price, currency)}<span className="text-sm font-normal text-muted-foreground">{dictionary.perNight}</span></p>
                  <Button asChild>
                    <Link href="#booking">{dictionary.bookNow}</Link>
                  </Button>
                </CardFooter>
              </Card>
            )
        })}
      </div>
    </div>
  );
}
