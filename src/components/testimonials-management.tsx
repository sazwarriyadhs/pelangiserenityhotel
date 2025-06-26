
'use client'

import { useState } from 'react'
import { useAuth } from '@/context/auth-provider'
import { AccessDenied } from '@/components/access-denied'
import type { Locale } from '@/config/i18n-config'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { PlusCircle, Star } from 'lucide-react'
import { initialTestimonials, type Testimonial } from '@/lib/testimonials-constants'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useToast } from '@/hooks/use-toast'

export function TestimonialsManagement({ dictionary, lang }: { dictionary: any, lang: Locale }) {
    const { user } = useAuth()
    const { toast } = useToast()
    const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials)
    
    const isAuthorized = user && user.role === 'admin'
    const testimonialsDict = dictionary.dashboard.testimonialsPage

    if (!isAuthorized) {
        return <AccessDenied dictionary={dictionary.accessDenied} lang={lang} />
    }

    const handlePublishChange = (id: string, published: boolean) => {
        setTestimonials(currentTestimonials =>
            currentTestimonials.map(t => (t.id === id ? { ...t, published } : t))
        )
        toast({
            title: testimonialsDict.toast.statusChangedTitle,
            description: testimonialsDict.toast.statusChangedDescription.replace('{status}', published ? testimonialsDict.statuses.published : testimonialsDict.statuses.unpublished),
        })
    }
    
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">{testimonialsDict.title}</h1>
                    <p className="text-muted-foreground">{testimonialsDict.description}</p>
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {testimonialsDict.addTestimonial}
                </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map(testimonial => (
                    <Card key={testimonial.id}>
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={testimonial.avatar} data-ai-hint="avatar person" />
                                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle>{testimonial.name}</CardTitle>
                                    <div className="flex items-center gap-0.5 mt-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < testimonial.rating ? 'text-primary fill-primary' : 'text-muted-foreground'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground italic">"{testimonial.comment}"</p>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center">
                            <Badge variant={testimonial.published ? 'default' : 'secondary'}>
                                {testimonial.published ? testimonialsDict.statuses.published : testimonialsDict.statuses.unpublished}
                            </Badge>
                            <div className="flex items-center space-x-2">
                                <Label htmlFor={`publish-${testimonial.id}`}>{testimonialsDict.publish}</Label>
                                <Switch
                                    id={`publish-${testimonial.id}`}
                                    checked={testimonial.published}
                                    onCheckedChange={(checked) => handlePublishChange(testimonial.id, checked)}
                                />
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
