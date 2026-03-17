'use client';

import { useState, useEffect } from 'react';

interface Props {
    initialData: {
        marketCap: number;
        volume: number;
        btcDominance: number;
        fearGreed: {
            value: string;
            value_classification: string;
        };
    };
}

export function MarketStatsClient({ initialData }: Props) {
    const [marketData, setMarketData] = useState({
        totalMarketCap: initialData.marketCap,
        totalVolume: initialData.volume,
        btcDominance: initialData.btcDominance,
        // marketCapChange: 2.3, // You'd calculate this
        // volumeChange: -1.2,
        // dominanceChange: -0.5,
    });

    const [fearGreed, setFearGreed] = useState(initialData.fearGreed);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    useEffect(() => {
        setLastUpdated(new Date());
    }, []);
    useEffect(() => {
        const fetchUpdates = async () => {
            try {
                const [globalRes, fearGreedRes] = await Promise.all([
                    fetch('https://api.coingecko.com/api/v3/global'),
                    fetch('https://api.alternative.me/fng/?limit=1'),
                ]);

                const globalData = await globalRes.json();
                const fearGreedData = await fearGreedRes.json();

                setMarketData((prev) => ({
                    ...prev,
                    totalMarketCap: globalData.data.total_market_cap.usd,
                    totalVolume: globalData.data.total_volume.usd,
                    btcDominance: globalData.data.market_cap_percentage.btc,
                }));

                setFearGreed(fearGreedData.data[0]);
                setLastUpdated(new Date());
            } catch (error) {
                console.error('Update failed:', error);
            }
        };

        const interval = setInterval(fetchUpdates, 60000);
        return () => clearInterval(interval);
    }, []);

    const formatLargeNumber = (num: number): string => {
        if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
        if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
        if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
        return `$${num.toFixed(2)}`;
    };

    const getFearGreedColor = (value: number): string => {
        if (value <= 20) return 'text-red-600';
        if (value <= 40) return 'text-orange-500';
        if (value <= 60) return 'text-yellow-500';
        if (value <= 80) return 'text-lime-500';
        return 'text-green-600';
    };

    const getFearGreedBgColor = (value: number): string => {
        if (value <= 20) return 'bg-red-100';
        if (value <= 40) return 'bg-orange-100';
        if (value <= 60) return 'bg-yellow-100';
        if (value <= 80) return 'bg-lime-100';
        return 'bg-green-100';
    };

    return (
        // <div className="space-y-3">
        <div className="space-y-4 md:w-[70%]">
            <div className="text-xs text-gray-400 text-right">
                Last updated:{' '}
                {lastUpdated ? lastUpdated.toLocaleTimeString() : ''}
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Market Cap Card */}
                <div className="bg-card rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">
                            🌍 Market Cap
                        </span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                        {formatLargeNumber(marketData!.totalMarketCap)}
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                        Real-time global market cap
                    </div>
                </div>

                {/* 24h Volume Card */}
                <div className="bg-card rounded-lg p-6 ">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">
                            📊 24h Volume
                        </span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                        {formatLargeNumber(marketData!.totalVolume)}
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                        Total exchange volume
                    </div>
                </div>

                {/* Fear & Greed Card */}
                {fearGreed && (
                    <div
                        className={`bg-white border border-card rounded-lg p-6 ${getFearGreedBgColor(parseInt(fearGreed.value))}`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">
                                😨 Fear & Greed
                            </span>
                            <span
                                className={`text-blue-800 text-xs font-semibold px-2 py-1 rounded ${getFearGreedBgColor(parseInt(fearGreed.value))}`}
                            >
                                {fearGreed.value_classification}
                            </span>
                        </div>
                        <div className="flex items-end space-x-2">
                            <div
                                className={`text-3xl font-bold ${getFearGreedColor(parseInt(fearGreed.value))}`}
                            >
                                {fearGreed.value}
                            </div>
                            <div className="text-sm text-gray-500 mb-1">
                                /100
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${
                                    parseInt(fearGreed.value) <= 20
                                        ? 'bg-red-600'
                                        : parseInt(fearGreed.value) <= 40
                                          ? 'bg-orange-500'
                                          : parseInt(fearGreed.value) <= 60
                                            ? 'bg-yellow-500'
                                            : parseInt(fearGreed.value) <= 80
                                              ? 'bg-lime-500'
                                              : 'bg-green-600'
                                }`}
                                style={{ width: `${fearGreed.value}%` }}
                            ></div>
                        </div>

                        <div className="text-xs text-gray-500 mt-2">
                            Market sentiment indicator
                        </div>
                    </div>
                )}

                {/* BTC Dominance Card */}
                <div className="bg-card border border-card rounded-lg p-6 ">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">
                            🔶 BTC Dominance
                        </span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                        {marketData!.btcDominance.toFixed(1)}%
                    </div>

                    {/* Altcoin Season Indicator */}
                    <div className="mt-3 flex items-center space-x-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-orange-500"
                                style={{
                                    width: `${marketData!.btcDominance}%`,
                                }}
                            ></div>
                        </div>
                        <span className="text-xs text-gray-500">
                            {marketData!.btcDominance > 60
                                ? 'Bitcoin Season'
                                : marketData!.btcDominance < 40
                                  ? 'Altcoin Season'
                                  : 'Balanced'}
                        </span>
                    </div>

                    <div className="text-xs text-gray-400 mt-2">
                        Bitcoin market share
                    </div>
                </div>
            </div>

            {/* Mini market summary */}
            <div className="bg-card border border-card rounded-lg p-3 text-sm text-foreground">
                <span className="font-semibold">Market Summary:</span>{' '}
                {marketData!.btcDominance > 50
                    ? 'Bitcoin dominating. '
                    : 'Altcoins gaining ground. '}
                Fear & Greed indicates{' '}
                {fearGreed?.value_classification.toLowerCase()} sentiment.
            </div>
        </div>
    );
}
