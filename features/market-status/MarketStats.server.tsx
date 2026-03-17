// components/MarketStats.server.tsx
import { Suspense } from 'react';
import { MarketStatsClient } from './MarketStats.client';
import MarketStatsSkeleton from '@/app/(main)/loading';
import { promise } from 'zod';

async function getInitialMarketData() {
    try {
        const globalRes = await fetch(
            'https://api.coingecko.com/api/v3/global',
            {
                next: { revalidate: 60 },
            },
        );
        const fearGreedRes = await fetch(
            'https://api.alternative.me/fng/?limit=1',
            {
                next: { revalidate: 60 },
            },
        );

        const globalData = await globalRes.json();
        const fearGreedData = await fearGreedRes.json();
        return {
            marketCap: globalData.data.total_market_cap.usd,
            volume: globalData.data.total_volume.usd,
            btcDominance: globalData.data.market_cap_percentage.btc,
            fearGreed: fearGreedData.data[0],
        };
    } catch (error) {
        // Return mock data on error
        // console.log(error);
        return {
            marketCap: 2_840_000_000_000,
            volume: 98_200_000_000,
            btcDominance: 48.2,
            fearGreed: { value: '55', value_classification: 'Neutral' },
        };
    }
}

export async function MarketStatsServer() {
    const initialData = await getInitialMarketData();

    return (
        <Suspense fallback={<MarketStatsSkeleton />}>
            <MarketStatsClient initialData={initialData} />
        </Suspense>
    );
}

// function MarketStatsSkeleton() {
//     return (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             {[1, 2, 3, 4].map((i) => (
//                 <div
//                     key={i}
//                     className="bg-white rounded-lg shadow p-6 animate-pulse"
//                 >
//                     <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
//                     <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
//                     <div className="h-4 bg-gray-200 rounded w-1/3"></div>
//                 </div>
//             ))}
//         </div>
//     );
// }
