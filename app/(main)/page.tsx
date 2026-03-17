import CoinsStatusServer from '@/features/coins-status/CoinsStatus.server';
import { MarketStatsServer } from '@/features/market-status/MarketStats.server';
import SymbolOverview from '@/features/overview/components/SymbolOverview';
import BinanceSocketProvider from '@/shared/providers/binance-socket-provider';

export default function Home() {
    return (
        <BinanceSocketProvider>
            <div className="flex flex-col items-center h-full w-full">
                <MarketStatsServer />
                <div className="min-h-110 w-full px-4 py-2">
                    <SymbolOverview symbolName="BTCUSDT" />
                </div>
                <CoinsStatusServer />
            </div>
        </BinanceSocketProvider>
    );
}
