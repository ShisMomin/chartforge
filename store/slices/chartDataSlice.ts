import { type ChartConfig, type ChartLayout } from '@/schemas';
import { type StateCreator } from 'zustand';
import { type RootState } from '@/store/types';
import { convertTimeframeLive } from '@/lib/aggregation';
import { CandleType, TimeFrameType } from '@/shared/types/common';

interface ChartCandlestickData {
    candles: CandleType[];
    cacheCandles: CandleType[];
    tempCandles?: CandleType[];
}
interface ChartState {
    prevLoading: boolean;
    initLoading: boolean;
    firstHistoryTime: number | null;
}
type FullChartInfo = ChartConfig & ChartCandlestickData & ChartState;
export interface ChartsDataSlice {
    chartsById: Record<string, FullChartInfo>;
    activeChartId: string | null;
    syncIndicator: boolean;
    syncSymbol: boolean;
    setInitChartData: (charts: ChartLayout['charts'], symbol?: string) => void;
    clearInitChartData: () => void;
    setActiveChartId: (id: string | null) => void;
    setActiveChartSymbol: (sym: string) => void;
    setAllChartsSymbol: (sym: string) => void;
    setActiveChartTimeframe: (timeframe: TimeFrameType) => void;
    // addIndicatorToActiveChart: (indicatorId: string) => void;
    // removeIndicatorToActiveChart: (indicatorId: string) => void;
    setInitLoadingByChartId: (id: string, loading: boolean) => void;
    setPrevLoadingByChartId: (id: string, loading: boolean) => void;
    setInitCandlesByChartId: (id: string, candlesArr: CandleType[]) => void;
    setTempCandlesByChartId: (id: string, candlesArr: CandleType[]) => void;
    setCacheCandlesByChartId: (id: string, candlesArr: CandleType[]) => void;
    setSyncIndicator: (value: boolean) => void;
    setSyncSymbol: (value: boolean) => void;
    updateHistoryByChartId: (id: string, candlesArr: CandleType[]) => void;
    updateLiveCandleByChartId: (id: string, candle: CandleType) => void;
    updateLiveTempCandlesByChartId: (
        id: string,
        targetTime: TimeFrameType,
        candle: CandleType,
    ) => CandleType | null;
}

export const creatChartDataSlice: StateCreator<
    RootState,
    [['zustand/immer', never]],
    [],
    ChartsDataSlice
> = (set, get) => ({
    chartsById: {},
    activeChartId: null,
    syncIndicator: false,
    syncSymbol: false,
    setInitChartData: (charts, sym = '') => {
        set((draft) => {
            draft.activeChartId = charts[0].chartId;
            draft.chartsById = charts.reduce<Record<string, FullChartInfo>>(
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
                    acc[chart.chartId].symbol =
                        sym.length > 0 ? sym : acc[chart.chartId].symbol;
                    return acc;
                },
                {},
            );
        });
    },
    clearInitChartData: () => {
        set((draft) => {
            draft.chartsById = {};
        });
    },
    setActiveChartId: (id) => {
        if (!id) return;
        set((draft) => {
            draft.activeChartId = id;
        });
    },
    setActiveChartSymbol: (sym) => {
        if (!sym) return;
        set((draft) => {
            const actId = draft.activeChartId;
            if (!actId) return;
            draft.chartsById[actId].symbol = sym;
        });
    },
    setAllChartsSymbol: (sym) => {
        const state = get();
        const chartIds = state.layout?.chartIds;
        if (!sym || !chartIds || chartIds.length <= 0) return;
        set((draft) => {
            for (const chartId of chartIds) {
                draft.chartsById[chartId].symbol = sym;
            }
        });
    },
    setActiveChartTimeframe: (timeframe) => {
        if (!timeframe) return;
        set((draft) => {
            const actId = draft.activeChartId;
            if (!actId) return;
            draft.chartsById[actId].timeframe = timeframe;
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
        set((draft) => {
            if (!draft.chartsById[id]) return;
            draft.chartsById[id].initLoading = loading;
        });
    },
    setPrevLoadingByChartId: (id, loading) => {
        if (!id) return;
        set((draft) => {
            draft.chartsById[id].prevLoading = loading;
        });
    },
    setInitCandlesByChartId: (id, candlesArr) => {
        if (!id) return;
        set((draft) => {
            const chart = draft.chartsById[id];
            if (!chart) return;
            // if (!draft.chartsById[id]) return;
            chart.candles = [...candlesArr];
            chart.firstHistoryTime = candlesArr[0].time;
            // console.log(candlesArr);
            // console.log(chart.firstHistoryTime);
        });
    },
    setTempCandlesByChartId: (id, candlesArr) => {
        if (!id) return;
        set((draft) => {
            const chart = draft.chartsById[id];
            if (!chart) return;
            // if (!draft.chartsById[id]) return;
            chart.tempCandles = [...candlesArr];
        });
    },
    setCacheCandlesByChartId: (id, candlesArr) => {
        if (!id) return;
        set((draft) => {
            if (!draft.chartsById[id]) return;
            draft.chartsById[id].cacheCandles = [...candlesArr];
            if (candlesArr.length <= 0) {
                draft.chartsById[id].firstHistoryTime = null;
            }
        });
    },
    setSyncIndicator: (value) => {
        set((draft) => {
            draft.syncIndicator = value;
        });
    },
    setSyncSymbol: (value) => {
        set((draft) => {
            draft.syncSymbol = value;
        });
    },
    updateHistoryByChartId: (id, candlesArr) => {
        if (!id) return;
        set((draft) => {
            const chart = draft.chartsById[id];
            if (!chart) return;
            chart.candles.unshift(...candlesArr);
            // state.chartsById[id].candles = [...candlesArr];
            draft.chartsById[id].firstHistoryTime = candlesArr[0].time;
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
        let liveAggData: CandleType | null = null;
        set((draft) => {
            const { tempCandles } = draft.chartsById[id];
            if (!tempCandles || tempCandles.length <= 0) return;
            const last = tempCandles[tempCandles.length - 1];
            if (last && last.time === candle.time) {
                tempCandles[tempCandles.length - 1] = candle;
            } else {
                tempCandles.push(candle);
            }
            const targetData: CandleType[] = tempCandles.slice(-50);
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
