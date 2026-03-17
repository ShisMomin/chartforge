import { type ChartConfig, type ChartLayout } from '@/schemas';
import { type CandlestickData, type Time } from 'lightweight-charts';
import { type StateCreator } from 'zustand';
import { type RootState } from '@/store/types';
import { convertTimeframeLive } from '@/lib/aggregation';
import { CandleType, TimeFrameType } from '@/shared/types/common';

interface ChartCandlestickData {
    candles: CandlestickData[];
    cacheCandles: CandlestickData[];
    tempCandles?: CandlestickData[];
}
interface ChartState {
    prevLoading: boolean;
    initLoading: boolean;
    firstHistoryTime: Time | null;
}
type FullChartInfo = ChartConfig & ChartCandlestickData & ChartState;
export interface ChartsDataSlice {
    chartsById: Record<string, FullChartInfo>;
    activeChartId: string | null;
    setInitChartData: (charts: ChartLayout['charts']) => void;
    setActiveChartId: (id: string | null) => void;
    setActiveChartSymbol: (sym: string) => void;
    setActiveChartTimeframe: (timeframe: TimeFrameType) => void;
    // addIndicatorToActiveChart: (indicatorId: string) => void;
    // removeIndicatorToActiveChart: (indicatorId: string) => void;
    setInitLoadingByChartId: (id: string, loading: boolean) => void;
    setPrevLoadingByChartId: (id: string, loading: boolean) => void;
    setInitCandlesByChartId: (
        id: string,
        candlesArr: CandlestickData[],
    ) => void;
    setTempCandlesByChartId: (
        id: string,
        candlesArr: CandlestickData[],
    ) => void;
    setCacheCandlesByChartId: (
        id: string,
        candlesArr: CandlestickData[],
    ) => void;
    updateHistoryByChartId: (id: string, candlesArr: CandlestickData[]) => void;
    updateLiveCandleByChartId: (id: string, candle: CandlestickData) => void;
    updateLiveTempCandlesByChartId: (
        id: string,
        targetTime: TimeFrameType,
        candle: CandlestickData,
    ) => CandlestickData | null;
}

export const creatChartDataSlice: StateCreator<
    RootState,
    [['zustand/immer', never]],
    [],
    ChartsDataSlice
> = (set) => ({
    chartsById: {},
    activeChartId: null,
    setInitChartData: (charts) => {
        set((state) => {
            state.activeChartId = charts[0].chartId;
            state.chartsById = charts.reduce<Record<string, FullChartInfo>>(
                (acc, chart) => {
                    acc[chart.chartId] = {
                        ...chart,
                        candles: [],
                        cacheCandles: [],
                        tempCandles: [],
                        prevLoading: false,
                        initLoading: false,
                        firstHistoryTime: null,
                    };
                    return acc;
                },
                {},
            );
        });
    },
    setActiveChartId: (id) => {
        if (!id) return;
        set((state) => {
            state.activeChartId = id;
        });
    },
    setActiveChartSymbol: (sym) => {
        if (!sym) return;
        set((state) => {
            const actId = state.activeChartId;
            if (!actId) return;
            state.chartsById[actId].symbol = sym;
        });
    },
    setActiveChartTimeframe: (timeframe) => {
        if (!timeframe) return;
        set((state) => {
            const actId = state.activeChartId;
            if (!actId) return;
            state.chartsById[actId].timeframe = timeframe;
        });
    },
    // addIndicatorToActiveChart: (indicatorId) => {
    //     if (!indicatorId) return;
    //     set((state) => {
    //         const actId = state.activeChartId;
    //         if (!actId) return;
    //         state.chartsById[actId].indicators.push(indicatorId);
    //     });
    // },
    // removeIndicatorToActiveChart: (indicatorId) => {
    //     if (!indicatorId) return;
    //     set((state) => {
    //         const actId = state.activeChartId;
    //         if (!actId) return;
    //         const indicators = state.chartsById[actId].indicators;
    //         state.chartsById[actId].indicators = indicators.filter(
    //             (ind) => ind !== indicatorId,
    //         );
    //     });
    // },
    setInitLoadingByChartId: (id, loading) => {
        if (!id) return;
        set((state) => {
            if (!state.chartsById[id]) return;
            state.chartsById[id].initLoading = loading;
        });
    },
    setPrevLoadingByChartId: (id, loading) => {
        if (!id) return;
        set((state) => {
            state.chartsById[id].prevLoading = loading;
        });
    },
    setInitCandlesByChartId: (id, candlesArr) => {
        if (!id) return;
        set((state) => {
            const chart = state.chartsById[id];
            if (!chart) return;
            if (!state.chartsById[id]) return;
            chart.candles = [...candlesArr];
            chart.firstHistoryTime = candlesArr[0].time;
            // console.log('update');
            // console.log(chart.firstHistoryTime);
        });
    },
    setTempCandlesByChartId: (id, candlesArr) => {
        if (!id) return;
        set((state) => {
            const chart = state.chartsById[id];
            if (!chart) return;
            if (!state.chartsById[id]) return;
            chart.tempCandles = [...candlesArr];
        });
    },
    setCacheCandlesByChartId: (id, candlesArr) => {
        if (!id) return;
        set((state) => {
            if (!state.chartsById[id]) return;
            state.chartsById[id].cacheCandles = [...candlesArr];
            if (candlesArr.length <= 0) {
                state.chartsById[id].firstHistoryTime = null;
            }
        });
    },
    updateHistoryByChartId: (id, candlesArr) => {
        if (!id) return;
        set((state) => {
            const chart = state.chartsById[id];
            if (!chart) return;
            chart.candles.unshift(...candlesArr);
            // state.chartsById[id].candles = [...candlesArr];
            state.chartsById[id].firstHistoryTime = candlesArr[0].time;
        });
    },
    updateLiveCandleByChartId: (id, candle) => {
        if (!id) return;
        set((draft) => {
            const { candles } = draft.chartsById[id];
            if (candles.length <= 0) return;
            if (candles[candles.length - 1].time === candle.time) {
                candles.pop();
                candles.push(candle);
            } else {
                candles.push(candle);
            }
        });
    },
    updateLiveTempCandlesByChartId: (id, targetTime, candle) => {
        if (!id) return null;
        let liveAggData: CandlestickData | null = null;
        set((draft) => {
            const { tempCandles } = draft.chartsById[id];
            if (!tempCandles || tempCandles.length <= 0) return;
            const last = tempCandles[tempCandles.length - 1];
            if (last && last.time === candle.time) {
                tempCandles[tempCandles.length - 1] = candle;
            } else {
                tempCandles.push(candle);
            }
            const targetData: CandleType[] = tempCandles
                .slice(-50)
                .map((ele) => ({
                    time: Number(ele.time),
                    open: ele.open,
                    high: ele.high,
                    low: ele.low,
                    close: ele.close,
                    volume: 0,
                }));
            liveAggData = convertTimeframeLive(targetData, targetTime);
        });
        return liveAggData;
    },
});

// updateHistoryByChartId: (id, candlesArr) => {
//     if (!id) return;
//     set((state) => {
//          const chart = state.chartsById[id];
//         if (!chart) return;
//         state.chartsById[id].candles.unshift(...candlesArr);
//         // state.chartsById[id].candles = [...candlesArr];
//         state.chartsById[id].lastUpdate = candlesArr[0].time;
//         console.log('update');
//         console.log(state.chartsById[id].lastUpdate);
//     });
// },
