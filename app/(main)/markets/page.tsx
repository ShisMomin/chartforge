import MarketAllCoinsServer from '@/features/markets/MarketAllCoins.server';
import BinanceSocketProvider from '@/shared/providers/binance-socket-provider';
import React from 'react';

export const metadata = {
    title: 'Markets',
};
export default function Page() {
    return (
        <BinanceSocketProvider>
            {/* <div className="h-[calc(100vh-64px)] px-5 py-4"> */}
            <MarketAllCoinsServer />
            {/* </div>5 */}
        </BinanceSocketProvider>
    );
}
