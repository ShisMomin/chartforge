// md:sticky md:flex-row md:items-center md:justify-between md:w-full md:h-full max-w-400 md:px-8

// export default function Navbar() {
//     const [isOpen, setIsOpen] = useState(false);
//     return (
//         <nav
//             className="flex items-center justify-center h-14 md:h-16 w-full
//           bg-panel z-50 border-b border-blue-300"
//         >
//             {/* <div
//                 className="
//             flex flex-col items-start gap-2 absolute h-screen top-0 right-0  px-8 w-screen py-3 md3:sticky md3:flex-row md3:items-center md3:justify-between md3:w-full md3:h-full max-w-400 md3:px-8"
//             > */}
//             <div
//                 className="
//             flex gap-2 absolute top-0 right-0 px-8 w-screen py-3 md3:sticky md3:flex-row md3:items-center justify-between md3:w-full md3:h-full max-w-400 md3:px-8"
//             >
//                 <Link
//                     className="font-semibold text-2xl md:text-3xl text-foreground cursor-pointer"
//                     href="/"
//                 >
//                     CHARTINGview
//                 </Link>
//                 <div className="md3:hidden z-50 p-0.5 flex gap-2">
//                     <button
//                         onClick={() => setIsOpen((prev) => !prev)}
//                         className="bg-transparent p-0.5 border-0 cursor-pointer"
//                     >
//                         <span
//                             className={`block w-6 h-0.5 my-1 bg-foreground transition-all duration-75 ease-in-out ${isOpen ? 'translate-y-1 rotate-45' : ''}`}
//                         ></span>
//                         <span
//                             className={`block w-6 h-0.5 my-1 bg-foreground transition-all duration-75 ease-in-out ${isOpen ? 'opacity-0' : ''}`}
//                         ></span>
//                         <span
//                             className={`block w-6 h-0.5 my-1 bg-foreground transition-all duration-75 ease-in-out ${isOpen ? '-translate-y-2 -rotate-45' : ''}`}
//                         ></span>
//                     </button>
//                     <button
//                         // onClick={() => setIsOpen((prev) => !prev)}
//                         className="bg-transparent p-0.5 border-0 cursor-pointer"
//                     >
//                         <ThemeSwitch />
//                     </button>
//                 </div>

//                 <ul
//                     className={`${isOpen ? 'flex' : 'hidden'} md3:flex flex-col items-start gap-5 absolute h-screen top-0 right-0 px-6 py-15 md3:py-8 bg-panel border-l border-blue-300 md3:flex-row md3:items-center md3:gap-6 md3:h-full md3:bg-transparent md3:border-none z-30`}
//                 >
//                     <li>
//                         <Link
//                             className="
//                             text-xl text-foreground cursor-pointer py-0.5 px-6 transition-all duration-100 ease-in-out rounded-2xl border-blue-300
//                             hover:bg-hover hover:border-2
//                              "
//                             href="/"
//                         >
//                             Dashboard
//                         </Link>
//                     </li>
//                     <li>
//                         <Link
//                             className="text-xl text-foreground cursor-pointer py-0.5 px-6 transition-all duration-100 ease-in-out rounded-2xl
//                              border-blue-300
//                             hover:bg-hover hover:border-2 "
//                             href="/markets"
//                         >
//                             Markets
//                         </Link>
//                     </li>
//                     <li>
//                         <Link
//                             className="text-xl text-foreground cursor-pointer py-0.5 px-6 transition-all duration-100 ease-in-out rounded-2xl
//                              border-blue-300
//                             hover:bg-hover hover:border-2 "
//                             href="/"
//                         >
//                             Chart Terminal
//                         </Link>
//                     </li>
//                     <li>
//                         <Link
//                             className="text-xl text-foreground cursor-pointer py-0.5 px-6 transition-all duration-100 ease-in-out rounded-2xl
//                              border-blue-300
//                             hover:bg-hover hover:border-2 "
//                             href="/"
//                         >
//                             Watchlist
//                         </Link>
//                     </li>
//                 </ul>
//             </div>
//             <button className="bg-transparent p-0.5 border-0 cursor-pointer hidden md3:block pr-4">
//                 <ThemeSwitch />
//             </button>
//         </nav>
//     );
// }

'use client';
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useRef,
} from 'react';
import { CandlestickData, IChartApi, Time } from 'lightweight-charts';
import { AppConfig } from '@/app-config';
// import {
//     setCacheCandles,
//     setInitCandles,
//     setInitLoading,
//     setPrevLoading,
//     updateHistory,
// } from '@/store/chartDataSlice';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useStore } from '@/store/store';
import {
    selectChartDataByChartId,
    // selectIndicatorsIdsByChartId,
    selectLastUpdateByChartId,
    // selectSymbolByChartId,
    // selectTimeframeByChartId,
} from '@/store/selectors/chartDataSelectors';
import { indicatorRegistry } from 'lightweight-charts-indicators';
import { selectChartIndicatorByChartId } from '@/store/selectors/indicatorsDataSelectors';
// import { result } from 'lodash';
import { Bar } from 'oakscriptjs';
import { finalIndicatorData } from '@/lib/indicatorCalculation';
import { useBinanceSocket } from './binance-socket-provider';
import { BinanceKlineEvent } from '@/lib/binance/BinanceSocket';
import { CandleType } from '../types/common';
// import dayjs from 'dayjs';
// import { CandlestickData, IChartApi } from 'lightweight-charts';

type CandlestickDataResponse = {
    finalData: CandlestickData<Time>[];
    cacheData: CandlestickData<Time>[];
    tempData: CandlestickData<Time>[];
};
type ChartEngineContextValue = {
    chartRef: React.MutableRefObject<IChartApi | null>;
    initChartInstance: (instance: IChartApi) => void;
    fetchMoreData: () => void;
    chartId: string;
};
/*
const createStubArray = (length: number) => new Array(length).fill(0);

const generateOHLCData = (length: number): CandlestickData<string>[] => {
    const start = dayjs().subtract(length, 'day');
    let previousClose = Math.max(1, Math.random() * 100);

    return createStubArray(length).map((_, i) => {
        const open = previousClose;
        const high = open + Math.random() * 10;
        let low = open - Math.random() * 10;

        low = Math.max(0, low);

        const minimalDistance = 0.01;
        const adjustedHigh = Math.max(high, low + minimalDistance);

        const close = low + Math.random() * (adjustedHigh - low);

        previousClose = close;

        return {
            time: start.add(i, 'day').format('YYYY-MM-DD'),
            open,
            high: adjustedHigh,
            low,
            close,
        };
    });
};
*/

const ChartDataEngineContext = createContext<ChartEngineContextValue | null>(
    null,
);
function getBars(
    cacheCandles: CandlestickData[],
    candles: CandlestickData[],
): Bar[] {
    if (candles.length <= 0) return [];
    const data = [...cacheCandles, ...candles];
    const barsData = data.map((d) => {
        return {
            time: Number(d.time),
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
        };
    });
    return barsData;
}
// const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type Props = {
    children: ReactNode;
    chartId: string;
};

type GetFetchProp = {
    symbol: string;
    timeframe: string;
    endTime?: Time;
};
function formatKline(
    event: BinanceKlineEvent,
    convertSecond = true,
): CandlestickData | null {
    if (event.k.n <= 0) return null;
    if (convertSecond) {
        return {
            time: Math.floor(event.k.t / 1000) as Time,
            open: Number(event.k.o),
            high: Number(event.k.h),
            low: Number(event.k.l),
            close: Number(event.k.c),
        };
    }
    return {
        time: Math.floor(event.k.t) as Time,
        open: Number(event.k.o),
        high: Number(event.k.h),
        low: Number(event.k.l),
        close: Number(event.k.c),
    };
}
function getFetchString({ symbol, timeframe, endTime }: GetFetchProp): string {
    if (AppConfig.isAggInterval(timeframe)) {
        return `/api/binance/klines/aggInterval?symbol=${symbol.toUpperCase()}&interval=${timeframe}${endTime ? `&endTime=${endTime}` : ''}`;
    }
    return `/api/binance/klines?symbol=${symbol.toUpperCase()}&interval=${timeframe}${endTime ? `&endTime=${endTime}` : ''}`;
}
export default function ChartDataEngineProvider({ children, chartId }: Props) {
    const chartRef = useRef<IChartApi | null>(null);
    const {
        setInitLoadingByChartId,
        setPrevLoadingByChartId,
        setInitCandlesByChartId,
        setTempCandlesByChartId,
        setCacheCandlesByChartId,
        updateHistoryByChartId,
        setIndicatorByChartAndIndicatorId,
        updateIndicatorHistoryByChartAndIndicatorId,
        updateLiveCandleByChartId,
        updateLiveTempCandlesByChartId,
        // addIndicatorByChartAndIndicatorId,
    } = useStore();
    const chartData = useStore(selectChartDataByChartId(chartId));
    const chartIndicators = useStore(selectChartIndicatorByChartId(chartId));
    const { socket } = useBinanceSocket();
    const {
        symbol,
        timeframe,
        indicators: indicatorIds,
        firstHistoryTime,
    } = chartData;
    const firstHistoryRef = useRef<Time | null>(firstHistoryTime);
    const symbolRef = useRef(symbol);
    const timeframeRef = useRef(timeframe);
    const chartIndicatorsRef = useRef(chartIndicators);
    useEffect(() => {
        firstHistoryRef.current = firstHistoryTime;
    }, [firstHistoryTime]);

    useEffect(() => {
        symbolRef.current = symbol;
    }, [symbol]);
    useEffect(() => {
        timeframeRef.current = timeframe;
    }, [timeframe]);
    useEffect(() => {
        chartIndicatorsRef.current = chartIndicators;
    }, [chartIndicators]);
    const setAllIndicators = useCallback(
        function (cacheCandles: CandlestickData[], candles: CandlestickData[]) {
            const allindicators = chartIndicatorsRef.current;
            Object.values(allindicators).forEach((value) => {
                setIndicatorByChartAndIndicatorId(
                    chartId,
                    value.registry,
                    cacheCandles,
                    candles,
                );
            });
        },
        [chartId, setIndicatorByChartAndIndicatorId],
        // [chartId],
    );
    const updateAllIndicatorsHistory = useCallback(
        function (cacheCandles: CandlestickData[], candles: CandlestickData[]) {
            const allindicators = chartIndicatorsRef.current;
            Object.values(allindicators).forEach((value) => {
                updateIndicatorHistoryByChartAndIndicatorId(
                    chartId,
                    value.registry,
                    cacheCandles,
                    candles,
                );
            });
        },
        [chartId, updateIndicatorHistoryByChartAndIndicatorId],
    );
    const initChartInstance = useCallback((instance: IChartApi) => {
        chartRef.current = instance;
    }, []);
    useEffect(
        function () {
            async function loadData() {
                try {
                    if (!symbolRef.current || !timeframeRef.current) return;
                    setInitLoadingByChartId(chartId, true);
                    const res = await fetch(
                        getFetchString({
                            symbol: symbolRef.current,
                            timeframe: timeframeRef.current,
                        }),
                    );
                    if (!res.ok) {
                        throw new Error(`Failed: ${res.status}`);
                    }
                    const data: CandlestickDataResponse = await res.json();
                    setAllIndicators(data.cacheData, data.finalData);
                    setInitCandlesByChartId(chartId, data.finalData);
                    setTempCandlesByChartId(chartId, data.tempData);
                    setCacheCandlesByChartId(chartId, data.cacheData);
                } catch (error) {
                    if (error instanceof Error) {
                        throw new Error(
                            `Failed to load data: ${error.message}`,
                        );
                    } else {
                        throw new Error('Failed to load data: unknown error');
                    }
                } finally {
                    setInitLoadingByChartId(chartId, false);
                }
            }
            loadData();
        },
        [
            chartId,
            symbol,
            timeframe,
            setInitLoadingByChartId,
            setInitCandlesByChartId,
            setCacheCandlesByChartId,
            setTempCandlesByChartId,
            setAllIndicators,
        ],
    );

    const onBinanceKline = useCallback(
        function (event: BinanceKlineEvent) {
            if (event.s === symbol && event.k.i === timeframe) {
                const data = formatKline(event);

                if (!data) return;
                updateLiveCandleByChartId(chartId, data);
            }
        },
        [chartId, updateLiveCandleByChartId, symbol, timeframe],
    );
    const onAggKline = useCallback(
        function (event: BinanceKlineEvent) {
            let sourceInterval = null;
            if (AppConfig.isAggInterval(timeframe)) {
                sourceInterval = AppConfig.getSourceInterval(timeframe);
            }
            if (event.s === symbol && event.k.i === sourceInterval) {
                const data = formatKline(event, false);

                if (!data) return;
                const aggData = updateLiveTempCandlesByChartId(
                    chartId,
                    timeframe,
                    data,
                );
                console.log(aggData);
                if (aggData) {
                    updateLiveCandleByChartId(chartId, aggData);
                }
            }
        },
        [
            chartId,
            updateLiveTempCandlesByChartId,
            updateLiveCandleByChartId,
            symbol,
            timeframe,
        ],
    );
    useEffect(
        function () {
            if (!socket) return;
            let sourceInterval = null;
            let isAgg = false;
            if (AppConfig.isAggInterval(timeframe)) {
                isAgg = true;
                sourceInterval = AppConfig.getSourceInterval(timeframe);
            } else {
                sourceInterval = timeframe;
            }
            if (!sourceInterval) return;
            socket.subscribeKline(symbol, sourceInterval);
            socket.addKlineHandler(isAgg ? onAggKline : onBinanceKline);
            return () => {
                socket.removeKlineHandler(isAgg ? onAggKline : onBinanceKline);
                socket.unsubscribeKline(symbol, sourceInterval);
            };
        },
        [socket, symbol, timeframe, onBinanceKline, onAggKline],
    );
    const fetchMoreData = useCallback(
        async function () {
            try {
                if (
                    !firstHistoryRef.current ||
                    !symbolRef.current ||
                    !timeframeRef.current
                )
                    return;
                setPrevLoadingByChartId(chartId, true);
                const res = await fetch(
                    getFetchString({
                        symbol: symbolRef.current,
                        timeframe: timeframeRef.current,
                        endTime: firstHistoryRef.current,
                    }),
                );
                if (!res.ok) {
                    throw new Error(`Failed: ${res.status}`);
                }
                const data: CandlestickDataResponse = await res.json();
                updateAllIndicatorsHistory(data.cacheData, data.finalData);
                updateHistoryByChartId(chartId, data.finalData);
                setCacheCandlesByChartId(chartId, data.cacheData);
                // await sleep(2000);
            } catch (error) {
                if (error instanceof Error) {
                    console.log(error.message);
                }
            } finally {
                setPrevLoadingByChartId(chartId, false);
            }
        },
        [
            chartId,
            setPrevLoadingByChartId,
            updateHistoryByChartId,
            setCacheCandlesByChartId,
            updateAllIndicatorsHistory,
        ],
    );

    return (
        <ChartDataEngineContext.Provider
            value={{ chartRef, chartId, initChartInstance, fetchMoreData }}
        >
            {children}
        </ChartDataEngineContext.Provider>
    );
}

function useChartDataEngine() {
    const context = useContext(ChartDataEngineContext);
    if (!context)
        throw new Error(
            'ChartDataEngine context was used outside of ChartDataEngineProveder',
        );
    return context;
}

export { ChartDataEngineProvider, useChartDataEngine };
