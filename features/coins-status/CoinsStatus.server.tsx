import { ExchangeInfoResponse } from '@/shared/types/common';
import CoinsStatusClient from './CoinsStatus.client';
// async function getActiveSymbolPairs() {
//     try {
//         const res = await fetch('https://api.binance.com/api/v3/exchangeInfo', {
//             cache: 'no-store',
//         });

//         const data: ExchangeInfoResponse = await res.json();
//         if (!res.ok) {
//             throw new Error('Failed to fetch exchange info');
//         }
//         return data.symbols.filter(
//             (symbolInfo) => symbolInfo.status === 'TRADING',
//         );
//     } catch (error) {
//         if (error instanceof Error) {
//             console.log(error.message);
//         }
//         return [];
//     }
// }
// async function getAllCoins24hStatus() {
//     try {
//         // Server side
//         const res = await fetch(
//             'https://api.binance.com/api/v3/ticker/24hr',
//             { next: { revalidate: 10 } }, // cache 10 seconds
//             // { cache: 'no-store' },
//         );

//         const allCoinsData = await res.json();
//         const activePairs=await getActiveSymbolPairs();
//         console.log(allCoinsData);
//         if (!Array.isArray(allCoinsData)) {
//             console.error('Binance API Error:', allCoinsData);
//             return [];
//         }

//         return allCoinsData.filter((symInfo)=> activePairs.some((active)=>active.symbol===symInfo.symbol));
//     } catch (error) {
//         // Return mock data on error
//         console.log(error);
//         return [];
//     }
// }

async function getAllCoins24hStatus() {
    try {
        const [tickerRes, exchangeRes] = await Promise.all([
            fetch('https://api.binance.com/api/v3/ticker/24hr', {
                next: { revalidate: 10 },
            }),
            fetch('https://api.binance.com/api/v3/exchangeInfo', {
                cache: 'force-cache',
            }),
        ]);

        const allCoinsData = await tickerRes.json();
        const exchangeData: ExchangeInfoResponse = await exchangeRes.json();

        if (!Array.isArray(allCoinsData)) {
            console.error('Binance API Error:', allCoinsData);
            return [];
        }

        const activeSet = new Set(
            exchangeData.symbols
                .filter((s) => s.status === 'TRADING')
                .map((s) => s.symbol),
        );

        return allCoinsData.filter((coin) => activeSet.has(coin.symbol));
    } catch (error) {
        console.log(error);
        return [];
    }
}
export default async function CoinsStatusServer() {
    const initialData = await getAllCoins24hStatus();
    return <CoinsStatusClient initialData={initialData} />;
}
