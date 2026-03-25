import { getAllLayout } from '@/lib/data-service';
import { Suspense } from 'react';
import LoadingLayouts from '../loading';
import SymbolOverview from '@/features/overview/components/SymbolOverview';
import BinanceSocketProvider from '@/shared/providers/binance-socket-provider';
import { Metadata } from 'next';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ layoutId: string; symbol: string }>;
}): Promise<Metadata> {
    const symbol = (await params).symbol;
    return {
        title: `${symbol}/Overview`,
    };
}
export default async function page({
    params,
}: {
    params: Promise<{ layoutId: string; symbol: string }>;
}) {
    const { symbol } = await params;
    const layouts = await getAllLayout();
    return (
        <Suspense fallback={<LoadingLayouts />}>
            <BinanceSocketProvider>
                <main className="w-full h-full">
                    {<SymbolOverview symbolName={symbol} layouts={layouts} />}
                </main>
            </BinanceSocketProvider>
        </Suspense>
    );
}
