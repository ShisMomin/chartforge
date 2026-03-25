import Footer from '@/shared/components/ui/Footer';
import Navbar from '@/shared/components/ui/Navbar';
import { ReactNode } from 'react';

export default function MainLayout({
    children,
}: Readonly<{ children: ReactNode }>) {
    return (
        <div className="h-full flex flex-col">
            <Navbar />

            <main className="flex-1 overflow-y-auto px-5 py-4">{children}</main>

            <Footer />
        </div>
    );
}
