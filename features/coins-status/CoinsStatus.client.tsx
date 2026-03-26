'use client';
import { Ticker } from '@/shared/types/common';
import { useMemo } from 'react';
import CoinsStatusTable from './CoinsStatusTable';

interface Props {
    initialData: Ticker[];
}

export default function CoinsStatusClient({ initialData }: Props) {
    console.log(initialData);
    const usdt_pairs = useMemo(() => {
        return initialData.filter((t) => t.symbol.endsWith('USDT'));
    }, [initialData]);
    const { topGainers, topLosers, topVolumes, topHotCoins } = useMemo(() => {
        const gainers = [...usdt_pairs]
            .sort(
                (a, b) =>
                    Number(b.priceChangePercent) - Number(a.priceChangePercent),
            )
            .slice(0, 20);

        const losers = [...usdt_pairs]
            .sort(
                (a, b) =>
                    Number(a.priceChangePercent) - Number(b.priceChangePercent),
            )
            .slice(0, 20);

        const volumes = [...usdt_pairs]
            .sort((a, b) => Number(b.quoteVolume) - Number(a.quoteVolume))
            .slice(0, 20);
        const hotCoins = [...usdt_pairs]
            .sort(
                (a, b) =>
                    Math.abs(Number(b.priceChangePercent)) *
                        Number(b.quoteVolume) -
                    Math.abs(Number(a.priceChangePercent)) *
                        Number(a.quoteVolume),
            )
            .slice(0, 20);
        return {
            topGainers: gainers,
            topLosers: losers,
            topVolumes: volumes,
            topHotCoins: hotCoins,
        };
    }, [usdt_pairs]);

    return (
        <div className="p-2 grid grid-cols-1 md3:grid-cols-2 gap-x-5 gap-y-5">
            <CoinsStatusTable
                label="Top Gainers"
                topCoins={topGainers}
                typeOfTable="topGainers"
            />
            <CoinsStatusTable
                label="Top Losers"
                topCoins={topLosers}
                typeOfTable="topLosers"
            />
            <CoinsStatusTable
                label="Top Volumes"
                topCoins={topVolumes}
                typeOfTable="topVolumes"
            />
            <CoinsStatusTable
                label="Hot Coins"
                topCoins={topHotCoins}
                typeOfTable="topHotCoins"
            />
        </div>
    );
}
