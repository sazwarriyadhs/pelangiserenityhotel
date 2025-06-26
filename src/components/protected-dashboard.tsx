'use client';

import { useAuth } from '@/context/auth-provider';
import { DashboardContent } from '@/components/dashboard-content';
import { AccessDenied } from '@/components/access-denied';
import type { Locale } from '@/config/i18n-config';

export function ProtectedDashboard({ dictionary, lang }: { dictionary: any, lang: Locale }) {
    const { user } = useAuth();
    const isAuthorized = user && (user.role === 'admin' || user.role === 'staff');

    if (!isAuthorized) {
        return <AccessDenied dictionary={dictionary.accessDenied} lang={lang} />;
    }

    return <DashboardContent dictionary={dictionary.dashboard} />;
}
