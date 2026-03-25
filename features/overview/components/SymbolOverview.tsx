'use client';
import { BinanceKlineEvent } from '@/lib/binance/BinanceSocket';
import { fetchCandlestickData } from '@/lib/binance/marketData';
import CustomChart from '@/shared/components/chart-components/chart/CustomChart';
import CustomPane from '@/shared/components/chart-components/panes/CustomPane';
import CustomCandlestickSeries from '@/shared/components/chart-components/series/CustomCandlestickSeries';
import Button from '@/shared/components/ui/Button';
import Spinner from '@/shared/components/ui/Spinner';
import { useBinanceSocket } from '@/shared/providers/binance-socket-provider';
import ChartRefsProvider from '@/shared/providers/chart-refs-provider';
import { CandleType, ChartGrid, TimeFrameType } from '@/shared/types/common';
import { WatermarkText } from '@shismomin/lightweight-charts-react-components';
import { CandlestickData, Time } from 'lightweight-charts';
import { PaneLegend } from '@shismomin/lwc-plugin-pracplugin';
import React, { useCallback, useEffect, useState } from 'react';
import { ChartBarIcon } from '@heroicons/react/24/solid';
import LayoutModal from '@/features/layouts/components/LayoutModal';
import LayoutSelector from '@/features/layouts/components/LayoutSelector';

type Props = {
    symbolName: string;
    layouts?: ChartGrid[];
};
const formatSymbol = (symbol: string) => {
    const quoteAssets = ['USDT', 'BUSD', 'USDC', 'BTC', 'ETH'];

    for (const quote of quoteAssets) {
        if (symbol.endsWith(quote)) {
            return symbol.replace(quote, `/${quote}`);
        }
    }

    return symbol;
};
function formatKline(
    event: BinanceKlineEvent,
    convertSecond = true,
): CandleType | null {
    if (event.k.n <= 0) return null;
    if (convertSecond) {
        return {
            time: Math.floor(event.k.t / 1000),
            open: Number(event.k.o),
            high: Number(event.k.h),
            low: Number(event.k.l),
            close: Number(event.k.c),
            volume: Number(event.k.v),
        };
    }
    return {
        time: Math.floor(event.k.t),
        open: Number(event.k.o),
        high: Number(event.k.h),
        low: Number(event.k.l),
        close: Number(event.k.c),
        volume: Number(event.k.v),
    };
}

const allIntervals: TimeFrameType[] = ['12h', '1d', '3d', '1w', '1M'];
export default function SymbolOverview({ symbolName, layouts = [] }: Props) {
    const [legendApi, setLegendApi] = useState<PaneLegend>(new PaneLegend());
    const [interval, setInterval] = useState<TimeFrameType>('1d');
    const { socket } = useBinanceSocket();
    const [candlestickData, setCandlestickData] = useState<CandlestickData[]>(
        [],
    );
    const [isLoading, setIsLoading] = useState(false);

    function handleIntervalChange(currInterval: TimeFrameType) {
        setInterval(currInterval);
    }
    const onBinanceKline = useCallback(
        function (event: BinanceKlineEvent) {
            if (event.s === symbolName && event.k.i === interval) {
                const data = formatKline(event);
                if (!data) return;
                const data2: CandlestickData = {
                    time: data.time as Time,
                    open: data.open,
                    high: data.high,
                    low: data.low,
                    close: data.close,
                };
                setCandlestickData((prev) => {
                    const last = prev[prev.length - 1];

                    if (!last) return [data2];

                    return last.time === data2.time
                        ? [...prev.slice(0, -1), data2]
                        : [...prev, data2];
                });
            }
        },
        [interval, symbolName],
    );
    useEffect(
        function () {
            async function loadData() {
                try {
                    setIsLoading(true);
                    const data = await fetchCandlestickData({
                        symbol: symbolName,
                        interval,
                    });
                    setCandlestickData(
                        [...data.cacheData, ...data.finalData].map((c) => ({
                            time: c.time as Time,
                            open: c.open,
                            high: c.high,
                            low: c.low,
                            close: c.close,
                        })),
                    );
                } catch (error) {
                    if (error instanceof Error) {
                        console.log(error.message);
                    }
                } finally {
                    setIsLoading(false);
                    setLegendApi(new PaneLegend());
                }
            }
            loadData();
        },
        [symbolName, interval],
    );
    useEffect(
        function () {
            if (!socket) return;
            socket.subscribeKline(symbolName, interval);
            socket.addKlineHandler(onBinanceKline);
            return () => {
                socket.removeKlineHandler(onBinanceKline);
                socket.unsubscribeKline(symbolName, interval);
            };
        },
        [socket, symbolName, interval, onBinanceKline],
    );
    return (
        <div className="w-full h-full min-h-0 min-w-0 flex flex-col items-center gap-2 py-4">
            <div className="flex-1 w-[90%] border border-blue-700 rounded-xl">
                {!isLoading ? (
                    <ChartRefsProvider>
                        <CustomChart>
                            <CustomPane legendApi={legendApi} stretchFactor={2}>
                                <CustomCandlestickSeries
                                    data={candlestickData}
                                    options={{
                                        priceLineVisible: false,
                                    }}
                                    legendApi={legendApi}
                                />
                                <WatermarkText
                                    visible={true}
                                    lines={[
                                        {
                                            text: formatSymbol(symbolName),
                                            color: `#8a8de4`,
                                            fontSize: 40,
                                        },
                                    ]}
                                />
                            </CustomPane>
                        </CustomChart>
                    </ChartRefsProvider>
                ) : (
                    <Spinner />
                )}
            </div>
            <div className="w-full flex gap-2 justify-center">
                {allIntervals.map((inter) => {
                    return (
                        <Button
                            key={inter}
                            active={interval === inter}
                            onButtonClick={() => handleIntervalChange(inter)}
                        >
                            {inter.toUpperCase()}
                        </Button>
                    );
                })}
                {layouts.length > 0 && (
                    <LayoutModal
                        source={
                            <Button active={false}>
                                <ChartBarIcon className=" h-5 w-5" />
                                <span className="hidden md:block">
                                    full chart
                                </span>
                            </Button>
                        }
                        possition={{ top: 400, left: 0 }}
                    >
                        <LayoutSelector layouts={layouts} />
                    </LayoutModal>
                )}
            </div>
        </div>
    );
}
