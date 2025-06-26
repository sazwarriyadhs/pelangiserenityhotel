
'use client'

import * as React from 'react'
import Image from 'next/image'
import Autoplay from "embla-carousel-autoplay"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { initialTestimonials } from '@/lib/testimonials-constants'
import { Star } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export function TestimonialsShowcase({ dictionary }: { dictionary: any }) {
    const publishedTestimonials = initialTestimonials.filter(t => t.published);
    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    )

    if (publishedTestimonials.length === 0) {
        return null;
    }

    return (
        <div className="container flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline text-primary">{dictionary.title}</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground md:text-xl/relaxed">
                {dictionary.subtitle}
            </p>
            <Carousel
                plugins={[plugin.current]}
                className="w-full max-w-4xl mt-12"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
            >
                <CarouselContent>
                    {publishedTestimonials.map((testimonial) => (
                        <CarouselItem key={testimonial.id}>
                            <div className="p-1">
                                <Card>
                                    <CardContent className="flex flex-col items-center justify-center p-6 text-center gap-4">
                                        <Avatar className="w-20 h-20">
                                            <AvatarImage src={testimonial.avatar} data-ai-hint="avatar person" />
                                            <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`h-5 w-5 ${i < testimonial.rating ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />
                                            ))}
                                        </div>
                                        <p className="text-lg italic text-foreground/80">"{testimonial.comment}"</p>
                                        <span className="font-semibold">{testimonial.name}</span>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}
