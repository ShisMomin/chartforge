import Navbar from '@/shared/components/ui/Navbar';
import BinanceSocketProvider from '@/shared/providers/binance-socket-provider';
import { ReactNode } from 'react';

// export default function MainLayout({
//     children,
// }: Readonly<{ children: ReactNode }>) {
//     return (
//         <div className="w-full h-full">
//             {/* <header>
//                 <h1>Main Header (Home + Dashboard)</h1>
//                 </header> */}
//             <Navbar />
//             {children}
//         </div>
//     );
// }

export default function MainLayout({
    children,
}: Readonly<{ children: ReactNode }>) {
    return (
        <div className="h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 overflow-y-auto px-5 py-4">{children}</main>
        </div>
    );
}
