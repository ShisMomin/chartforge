import { Suspense } from 'react';
import MarketTableClient from './MarketAllCoins.client';
import LoadingMarketTable from '@/app/(main)/markets/loading';
import { ExchangeInfoResponse } from '@/shared/types/common';

async function getAllCoins24hStatus() {
    try {
        // Server side
        const res = await fetch(
            'https://api.binance.com/api/v3/ticker/24hr',
            // { next: { revalidate: 60 } }, // cache 10 seconds
            { cache: 'no-store' },
        );

        const allCoinsData = await res.json();
        console.log(allCoinsData);
        return allCoinsData;
    } catch (error) {
        // Return mock data on error
        // console.log(error);
        return [];
    }
}
async function getAllActiveCurrencies() {
    try {
        const res = await fetch('https://api.binance.com/api/v3/exchangeInfo', {
            cache: 'no-store',
        });

        const data: ExchangeInfoResponse = await res.json();
        if (!res.ok) {
            throw new Error('Failed to fetch exchange info');
        }
        const quotecurrencies = [
            ...new Set(data.symbols.flatMap((s) => s.quoteAsset)),
        ];

        // console.log(currencies);
        return quotecurrencies;
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        }
        return [];
    }
}
export default async function MarketAllCoinsServer() {
    const initialData = await getAllCoins24hStatus();
    const activeQuoteCurrencies = await getAllActiveCurrencies();
    return (
        <Suspense fallback={<LoadingMarketTable />}>
            <MarketTableClient
                initialData={initialData}
                activeQuoteCurrencies={['All', ...activeQuoteCurrencies]}
            />
        </Suspense>
    );
}
