
'use client'

import { useState } from 'react'
import { useAuth } from '@/context/auth-provider'
import { AccessDenied } from '@/components/access-denied'
import type { Locale } from '@/config/i18n-config'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { LayoutTemplate } from 'lucide-react'

export function WebsiteManagement({ dictionary, lang }: { dictionary: any, lang: Locale }) {
    const { user } = useAuth()
    const { toast } = useToast()
    
    // Default values matching the current homepage
    const [heroTitle, setHeroTitle] = useState(dictionary.hero.title);
    const [heroSubtitle, setHeroSubtitle] = useState(dictionary.hero.subtitle);
    const [heroImageUrl, setHeroImageUrl] = useState("https://placehold.co/1920x1080.png");

    const isAuthorized = user && (user.role === 'admin') 

    const websiteDict = dictionary.dashboard.websitePage;

    if (!isAuthorized) {
        return <AccessDenied dictionary={dictionary.accessDenied} lang={lang} />
    }

    const handleSaveChanges = () => {
        // In a real application, you would send this data to your backend/API
        console.log({ heroTitle, heroSubtitle, heroImageUrl });
        toast({
            title: websiteDict.toastSuccessTitle,
            description: websiteDict.toastSuccessDescription,
        })
    }
    
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">{websiteDict.title}</h1>
                <p className="text-muted-foreground">{websiteDict.description}</p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><LayoutTemplate /> {websiteDict.heroSection.title}</CardTitle>
                    <CardDescription>{websiteDict.heroSection.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="heroTitle">{websiteDict.heroSection.heroTitle}</Label>
                        <Input id="heroTitle" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="heroSubtitle">{websiteDict.heroSection.heroSubtitle}</Label>
                        <Textarea id="heroSubtitle" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="heroImageUrl">{websiteDict.heroSection.heroImageUrl}</Label>
                        <Input id="heroImageUrl" value={heroImageUrl} onChange={(e) => setHeroImageUrl(e.target.value)} />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSaveChanges}>{websiteDict.saveChanges}</Button>
                </CardFooter>
            </Card>
        </div>
    )
}
