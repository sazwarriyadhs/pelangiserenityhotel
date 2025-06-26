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
import { Share2 } from 'lucide-react'

type OtaPlatform = {
    id: 'booking_com' | 'agoda' | 'traveloka' | 'expedia' | 'tiket_com';
    name: string;
    initiallyConnected: boolean;
};

const otaPlatforms: OtaPlatform[] = [
  { id: 'booking_com', name: 'Booking.com', initiallyConnected: true },
  { id: 'agoda', name: 'Agoda', initiallyConnected: true },
  { id: 'traveloka', name: 'Traveloka', initiallyConnected: false },
  { id: 'expedia', name: 'Expedia Group', initiallyConnected: true },
  { id: 'tiket_com', name: 'Tiket.com', initiallyConnected: false },
];

export function OtaManagement({ dictionary, lang }: { dictionary: any, lang: Locale }) {
    const { user } = useAuth()
    const isAuthorized = user && (user.role === 'admin') 

    const [connections, setConnections] = useState<Record<string, boolean>>(
        otaPlatforms.reduce((acc, platform) => {
            acc[platform.id] = platform.initiallyConnected;
            return acc;
        }, {} as Record<string, boolean>)
    );

    const otaDict = dictionary.dashboard.otaPage;

    if (!isAuthorized) {
        return <AccessDenied dictionary={dictionary.accessDenied} lang={lang} />
    }

    const handleConnectionChange = (platformId: string, isConnected: boolean) => {
        setConnections(prev => ({ ...prev, [platformId]: isConnected }));
    };
    
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">{otaDict.title}</h1>
                <p className="text-muted-foreground">{otaDict.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otaPlatforms.map((platform) => (
                    <Card key={platform.id}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Share2 className="text-primary"/>
                                {platform.name}
                            </CardTitle>
                            <CardDescription>{otaDict.cardDescription.replace('{platformName}', platform.name)}</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Badge variant={connections[platform.id] ? 'default' : 'secondary'}>
                                {connections[platform.id] ? otaDict.status.connected : otaDict.status.disconnected}
                            </Badge>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <Switch 
                                    id={`switch-${platform.id}`} 
                                    checked={connections[platform.id]}
                                    onCheckedChange={(checked) => handleConnectionChange(platform.id, checked)}
                                />
                                <Label htmlFor={`switch-${platform.id}`}>{otaDict.enableIntegration}</Label>
                            </div>
                            <Button variant="outline" disabled>{otaDict.settings}</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
