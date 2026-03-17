import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/_styles/globals.css';
import ThemeProvider from '@/shared/providers/theme-provider';
import { ClerkProvider } from '@clerk/nextjs';
import TanstackProvider from '@/shared/providers/tanstack-provider';
export const metadata: Metadata = {
    title: {
        template: '%s The Charting View',
        default: 'Welcome / The Charting View',
    },
};

// const inter = Inter({
//     subsets: ['latin'],
//     weight: ['400', '600', '800', '900'], // 👈 include extrabold & black
// });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`h-screen w-screen overflow-hidden `}>
                <ClerkProvider>
                    <TanstackProvider>
                        <ThemeProvider>{children}</ThemeProvider>
                    </TanstackProvider>
                </ClerkProvider>
            </body>
        </html>
    );
}

// myCode
// export default function RootLayout({
//     children,
// }: Readonly<{
//     children: React.ReactNode;
// }>) {
//     return (
//         <html lang="en" suppressHydrationWarning>
//             <body className="min-h-screen flex flex-col">
//                 <ThemeProvider>{children}</ThemeProvider>
//             </body>
//         </html>
//     );
// }
