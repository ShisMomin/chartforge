'use client';

import { Ticker } from '@/shared/types/common';
import { useQuery } from '@tanstack/react-query';

export function useWatchlist() {
    return useQuery({
        queryKey: ['watchlist'],
        queryFn: async () => {
            try {
                const res = await fetch('/api/watchlist');
                if (!res.ok) {
                    throw new Error('Failed to fetch watchlist');
                }
                const watchlistData = await res.json();
                const binanceRes = await fetch(
                    'https://api.binance.com/api/v3/ticker/24hr',
                );
                if (!binanceRes.ok) {
                    throw new Error('Failed to fetch Coins data');
                }
                const allCoinsData = (await binanceRes.json()) as Ticker[];
                const coinMap = new Map(
                    allCoinsData.map((coin) => [coin.symbol, coin]),
                );
                const finalData = watchlistData
                    .map((w: { symbol: string }) => coinMap.get(w.symbol))
                    .filter(Boolean) as Ticker[];
                return finalData;
            } catch (error) {
                console.error('Watchlist fetch error:', error);
                return [];
            }
        },
    });
}
