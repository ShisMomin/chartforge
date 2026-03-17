import Watchlist from '@/features/watchlist/components/Watchlist';
import BinanceSocketProvider from '@/shared/providers/binance-socket-provider';
import React from 'react';

export default function page() {
    return (
        <div className="h-full">
            <BinanceSocketProvider>
                <Watchlist isEditable={true} />
            </BinanceSocketProvider>
        </div>
    );
}
