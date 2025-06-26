
import Image from 'next/image';
import { initialGalleryImages } from '@/lib/gallery-constants';

export function GalleryShowcase({ dictionary }: { dictionary: any }) {
    const images = initialGalleryImages.slice(0, 8); // Show a subset

    return (
        <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline text-primary">
                        {dictionary.title}
                    </h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        {dictionary.subtitle}
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-12">
                {images.map((image) => (
                    <div key={image.id} className="overflow-hidden rounded-lg group">
                        <Image
                            src={image.src}
                            alt={image.alt}
                            width={400}
                            height={300}
                            className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={image.aiHint}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
