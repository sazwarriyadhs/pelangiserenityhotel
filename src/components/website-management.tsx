
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
import { LayoutTemplate, Wind, Wifi, Coffee } from 'lucide-react'

export function WebsiteManagement({ dictionary, lang }: { dictionary: any, lang: Locale }) {
    const { user } = useAuth()
    const { toast } = useToast()
    
    // State for Hero Section
    const [heroTitle, setHeroTitle] = useState(dictionary.hero.title);
    const [heroSubtitle, setHeroSubtitle] = useState(dictionary.hero.subtitle);
    const [heroImageUrl, setHeroImageUrl] = useState("https://placehold.co/1920x1080.png");

    // State for Highlights Section
    const [h1Title, setH1Title] = useState(dictionary.highlights.items.seaBreeze.title);
    const [h1Desc, setH1Desc] = useState(dictionary.highlights.items.seaBreeze.description);
    const [h2Title, setH2Title] = useState(dictionary.highlights.items.freeWifi.title);
    const [h2Desc, setH2Desc] = useState(dictionary.highlights.items.freeWifi.description);
    const [h3Title, setH3Title] = useState(dictionary.highlights.items.gourmetBreakfast.title);
    const [h3Desc, setH3Desc] = useState(dictionary.highlights.items.gourmetBreakfast.description);

    const isAuthorized = user && (user.role === 'admin') 

    const websiteDict = dictionary.dashboard.websitePage;

    if (!isAuthorized) {
        return <AccessDenied dictionary={dictionary.accessDenied} lang={lang} />
    }

    const handleSaveChanges = () => {
        // In a real application, you would send this data to your backend/API
        console.log({ 
            heroTitle, heroSubtitle, heroImageUrl,
            h1Title, h1Desc,
            h2Title, h2Desc,
            h3Title, h3Desc
        });
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
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><LayoutTemplate /> {websiteDict.highlightsSection.title}</CardTitle>
                    <CardDescription>{websiteDict.highlightsSection.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Highlight 1 */}
                    <div className="space-y-2 p-4 border rounded-lg">
                        <Label className="flex items-center gap-2"><Wind className="h-4 w-4 text-muted-foreground" /> {websiteDict.highlightsSection.itemTitle}: {dictionary.highlights.items.seaBreeze.title}</Label>
                        <Input value={h1Title} onChange={(e) => setH1Title(e.target.value)} />
                        <Label>{websiteDict.highlightsSection.itemDescription}</Label>
                        <Textarea value={h1Desc} onChange={(e) => setH1Desc(e.target.value)} />
                    </div>
                    {/* Highlight 2 */}
                    <div className="space-y-2 p-4 border rounded-lg">
                        <Label className="flex items-center gap-2"><Wifi className="h-4 w-4 text-muted-foreground" /> {websiteDict.highlightsSection.itemTitle}: {dictionary.highlights.items.freeWifi.title}</Label>
                        <Input value={h2Title} onChange={(e) => setH2Title(e.target.value)} />
                        <Label>{websiteDict.highlightsSection.itemDescription}</Label>
                        <Textarea value={h2Desc} onChange={(e) => setH2Desc(e.target.value)} />
                    </div>
                    {/* Highlight 3 */}
                    <div className="space-y-2 p-4 border rounded-lg">
                        <Label className="flex items-center gap-2"><Coffee className="h-4 w-4 text-muted-foreground" /> {websiteDict.highlightsSection.itemTitle}: {dictionary.highlights.items.gourmetBreakfast.title}</Label>
                        <Input value={h3Title} onChange={(e) => setH3Title(e.target.value)} />
                        <Label>{websiteDict.highlightsSection.itemDescription}</Label>
                        <Textarea value={h3Desc} onChange={(e) => setH3Desc(e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSaveChanges}>{websiteDict.saveChanges}</Button>
            </div>
        </div>
    )
}
