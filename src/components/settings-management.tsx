'use client'

import { useAuth } from '@/context/auth-provider'
import { useTheme } from '@/context/theme-provider'
import { AccessDenied } from '@/components/access-denied'
import type { Locale } from '@/config/i18n-config'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { Palette, Building } from 'lucide-react'

export function SettingsManagement({ dictionary, lang }: { dictionary: any, lang: Locale }) {
    const { user } = useAuth()
    const { theme, setTheme } = useTheme()
    const { toast } = useToast()
    
    const isAuthorized = user && (user.role === 'admin') 

    const settingsDict = dictionary.dashboard.settingsPage;

    if (!isAuthorized) {
        return <AccessDenied dictionary={dictionary.accessDenied} lang={lang} />
    }

    const handleSaveChanges = () => {
        toast({
            title: settingsDict.toast.title,
            description: settingsDict.toast.description,
        })
    }
    
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">{settingsDict.title}</h1>
                <p className="text-muted-foreground">{settingsDict.description}</p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Building /> {settingsDict.hotelDetails.title}</CardTitle>
                    <CardDescription>{settingsDict.hotelDetails.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="hotelName">{settingsDict.hotelDetails.hotelName}</Label>
                        <Input id="hotelName" defaultValue="Tranquil Stays" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="hotelAddress">{settingsDict.hotelDetails.hotelAddress}</Label>
                        <Input id="hotelAddress" defaultValue="123 Luxury Lane, Beverly Hills, CA 90210" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Palette /> {settingsDict.appearance.title}</CardTitle>
                    <CardDescription>{settingsDict.appearance.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="darkMode" className="flex flex-col space-y-1">
                            <span>{settingsDict.appearance.darkMode}</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                {settingsDict.appearance.darkModeDescription}
                            </span>
                        </Label>
                        <Switch 
                            id="darkMode"
                            checked={theme === 'dark'}
                            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSaveChanges}>{settingsDict.saveChanges}</Button>
            </div>
        </div>
    )
}
