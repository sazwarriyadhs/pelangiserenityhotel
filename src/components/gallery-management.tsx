
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useAuth } from '@/context/auth-provider'
import { AccessDenied } from '@/components/access-denied'
import type { Locale } from '@/config/i18n-config'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { X, Upload } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { initialGalleryImages, type GalleryImage, type GalleryCategory } from '@/lib/gallery-constants'

export function GalleryManagement({ dictionary, lang }: { dictionary: any, lang: Locale }) {
    const { user } = useAuth()
    const { toast } = useToast()
    const [images, setImages] = useState<GalleryImage[]>(initialGalleryImages)
    const [activeTab, setActiveTab] = useState<GalleryCategory>('Rooms')

    const isAuthorized = user && user.role === 'admin'
    const galleryDict = dictionary.dashboard.galleryPage

    if (!isAuthorized) {
        return <AccessDenied dictionary={dictionary.accessDenied} lang={lang} />
    }

    const handleUpload = () => {
        // This is a mock upload function
        toast({
            title: galleryDict.toast.uploadSuccessTitle,
            description: galleryDict.toast.uploadSuccessDescription,
        })
    }

    const handleDelete = (id: string) => {
        setImages(currentImages => currentImages.filter(img => img.id !== id))
        toast({
            variant: 'destructive',
            title: galleryDict.toast.deleteSuccessTitle,
            description: galleryDict.toast.deleteSuccessDescription,
        })
    }

    const categories: GalleryCategory[] = ['Rooms', 'Restaurant', 'Pool', 'Spa', 'Events']

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">{galleryDict.title}</h1>
                    <p className="text-muted-foreground">{galleryDict.description}</p>
                </div>
                <Button onClick={handleUpload}>
                    <Upload className="mr-2 h-4 w-4" />
                    {galleryDict.uploadImage}
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as GalleryCategory)}>
                <TabsList>
                    {categories.map(cat => (
                        <TabsTrigger key={cat} value={cat}>{galleryDict.categories[cat]}</TabsTrigger>
                    ))}
                </TabsList>

                {categories.map(cat => (
                    <TabsContent key={cat} value={cat}>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                            {images.filter(img => img.category === cat).map(image => (
                                <Card key={image.id} className="relative group">
                                    <CardContent className="p-0">
                                        <Image
                                            src={image.src}
                                            alt={image.alt}
                                            width={400}
                                            height={300}
                                            className="aspect-video object-cover rounded-md"
                                            data-ai-hint={image.aiHint}
                                        />
                                    </CardContent>
                                    <CardFooter className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-xs text-white truncate flex-1">{image.alt}</p>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => handleDelete(image.id)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}
