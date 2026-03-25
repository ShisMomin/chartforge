import type { Metadata } from 'next';
import '@/app/_styles/globals.css';
import ThemeProvider from '@/shared/providers/theme-provider';
import { ClerkProvider } from '@clerk/nextjs';
import TanstackProvider from '@/shared/providers/tanstack-provider';
export const metadata: Metadata = {
    title: {
        // template: '%s The ChartForge',
        template: '%s • ChartForge',
        default: 'ChartForge',
        // default: 'Welcome / The ChartForge',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`h-dvh w-screen overflow-y-scroll `}>
                <ClerkProvider>
                    <TanstackProvider>
                        <ThemeProvider>{children}</ThemeProvider>
                    </TanstackProvider>
                </ClerkProvider>
            </body>
        </html>
    );
}
