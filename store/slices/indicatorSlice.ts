import {
    indicatorRegistry,
    type IndicatorRegistryEntry,
} from 'lightweight-charts-indicators';
import { StateCreator } from 'zustand';
import { RootState } from '../types';
// import { CandlestickData } from 'lightweight-charts';
import { Bar } from 'oakscriptjs';
import { finalIndicatorData } from '@/lib/indicatorCalculation';
import { CandleType } from '@/shared/types/common';

export type IndicatorResult = {
    time: number;
    value: number;
    color?: string;
};
interface IndicatorData {
    registry: IndicatorRegistryEntry;
    result: Record<string, IndicatorResult[]> | null;
}

type GetBarsReturnType = {
    barsData: Bar[];
    from: number;
    to: number;
};
function getBars(
    cacheCandles: CandleType[],
    candles: CandleType[],
    presentCandles: CandleType[] = [],
): GetBarsReturnType {
    if (
        cacheCandles.length <= 0 &&
        candles.length <= 0 &&
        presentCandles.length <= 0
    ) {
        return {
            barsData: [],
            from: 0,
            to: 0,
        };
    }
    const from = cacheCandles.length;
    const to =
        from + (candles.length > 0 ? candles.length : presentCandles.length);
    // const to = from + candles.length;
    const barsData = [...cacheCandles, ...candles, ...presentCandles];
    // const data = [...cacheCandles, ...candles];
    // const barsData = data.map((d) => {
    //     return {
    //         time: Number(d.time),
    //         open: d.open,
    //         high: d.high,
    //         low: d.low,
    //         close: d.close,
    //     };
    // });
    return { barsData, from, to };
}

type IndicatorWithId = Record<string, IndicatorData>;
export interface IndicatorSlice {
    indicatorsByChartId: Record<string, IndicatorWithId>;

    setInitIndicatorData: (chartId: string, indicatorIds: string[]) => void;
    clearIndicatorData: () => void;
    addIndicatorByActiveChartId: (
        indicatorRegistry: IndicatorRegistryEntry,
    ) => void;
    addIndicatorOnAllChart: (indicatorRegistry: IndicatorRegistryEntry) => void;
    removeIndicatorByActiveChartId: (
        indicatorRegistry: IndicatorRegistryEntry,
    ) => void;
    removeIndicatorFromAllCharts: (
        indicatorRegistry: IndicatorRegistryEntry,
    ) => void;
    removeAllIndicatorFromAllCharts: () => boolean;
    setIndicatorByChartAndIndicatorId: (
        chartId: string,
        indicRegistry: IndicatorRegistryEntry,
        cacheCandles: CandleType[],
        candles: CandleType[],
    ) => void;
    updateIndicatorHistoryByChartAndIndicatorId: (
        chartId: string,
        indicRegistry: IndicatorRegistryEntry,
        cacheCandles: CandleType[],
        candles: CandleType[],
    ) => void;
    updateLiveIndicatorByChartAndIndicatorId: (
        chartId: string,
        indicRegistry: IndicatorRegistryEntry,
        candle: CandleType,
    ) => void;
}

export const createIndicatorDataSlice: StateCreator<
    RootState,
    [['zustand/immer', never]],
    [],
    IndicatorSlice
> = (set, get) => ({
    indicatorsByChartId: {},
    setInitIndicatorData: (chartId, indicatorIds) => {
        set((state) => {
            state.indicatorsByChartId[chartId] =
                indicatorIds.reduce<IndicatorWithId>((acc, id) => {
                    const registry = indicatorRegistry.find(
                        (ind) => ind.id === id,
                    );
                    if (!registry) return acc; // safety

                    acc[id] = {
                        registry,
                        result: null,
                    };
                    return acc;
                }, {});
        });
    },
    clearIndicatorData: () => {
        set((state) => {
            state.indicatorsByChartId = {};
        });
    },
    addIndicatorByActiveChartId: (indicRegistry) => {
        const state = get();
        const actId = state.activeChartId;
        if (!actId) return;
        const chartData = state.chartsById[actId];
        const { initLoading, prevLoading, cacheCandles, candles } = chartData;
        if (initLoading || prevLoading) return;
        const { barsData: bars, from, to } = getBars(cacheCandles, candles);
        const result = finalIndicatorData(
            bars,
            indicRegistry,
            // cacheCandles.length > 0 ? cacheCandles.length : 0,
            from,
            to,
        );
        if (!result) return;
        set((draft) => {
            // const actId = state.activeChartId;
            // if (!actId) return;
            // const chartData = state.chartsById[actId];
            // const { initLoading, prevLoading, cacheCandles, candles } =
            //     chartData;
            // if (initLoading || prevLoading) return;
            /////////////////////////////////////
            // const bars = getBars(cacheCandles, candles);
            // const result = finalIndicatorData(
            //     bars,
            //     indicRegistry,
            //     cacheCandles.length > 0 ? cacheCandles.length : 0,
            // );
            /////////////////////////////////////////
            // const { barsData: bars, from, to } = getBars(cacheCandles, candles);
            // const result = finalIndicatorData(
            //     bars,
            //     indicRegistry,
            //     // cacheCandles.length > 0 ? cacheCandles.length : 0,
            //     from,
            //     to,
            // );
            draft.indicatorsByChartId[actId][indicRegistry.id] = {
                registry: { ...indicRegistry },
                result,
                //  finalIndicatorData(
                //     bars,
                //     indicatorRegistry,
                //     cacheCandles.length > 0 ? cacheCandles.length : 0,
                // ),
            };
        });
    },
    addIndicatorOnAllChart: (indicRegistry) => {
        const state = get();
        const chartIds = state.layout?.chartIds;
        const allChartIdsResult: Record<
            string,
            Record<string, IndicatorResult[]> | null
        > = {};
        if (!chartIds || chartIds.length <= 0) return;
        for (const chartId of chartIds) {
            const chartData = state.chartsById[chartId];
            const { initLoading, prevLoading, cacheCandles, candles } =
                chartData;
            if (initLoading || prevLoading) continue;
            const { barsData: bars, from, to } = getBars(cacheCandles, candles);
            const result = finalIndicatorData(bars, indicRegistry, from, to);
            if (!result) continue;
            allChartIdsResult[chartId] = { ...result };
        }
        set((draft) => {
            for (const chartId of chartIds) {
                if (allChartIdsResult[chartId]) {
                    draft.indicatorsByChartId[chartId][indicRegistry.id] = {
                        registry: { ...indicRegistry },
                        result: allChartIdsResult[chartId],
                    };
                }
            }
        });
    },
    removeIndicatorByActiveChartId: (indicRegistry) => {
        set((state) => {
            const actId = state.activeChartId;
            if (!actId) return;
            delete state.indicatorsByChartId[actId]?.[indicRegistry.id];
        });
    },
    removeIndicatorFromAllCharts: (indicRegistry) => {
        set((draft) => {
            const chartIds = draft.layout?.chartIds;
            if (!chartIds || chartIds.length <= 0) return;
            for (const chartId of chartIds) {
                delete draft.indicatorsByChartId[chartId]?.[indicRegistry.id];
            }
        });
    },
    removeAllIndicatorFromAllCharts: () => {
        let isRemoved = false;
        set((state) => {
            const chartIds = state.layout?.chartIds;
            if (!chartIds || chartIds.length <= 0) return;
            isRemoved = true;
            for (const chartId of chartIds) {
                const allIndicatorIds = Object.keys(
                    state.indicatorsByChartId[chartId],
                );
                if (allIndicatorIds.length <= 0) continue;
                for (const indId of allIndicatorIds) {
                    delete state.indicatorsByChartId[chartId]?.[indId];
                }
            }
        });
        return isRemoved;
    },
    setIndicatorByChartAndIndicatorId: (
        chartId,
        indicRegistry,
        cacheCandles,
        candles,
    ) => {
        if (!chartId || !indicRegistry) return;
        const { barsData: bars, from, to } = getBars(cacheCandles, candles);
        const result = finalIndicatorData(
            bars,
            indicRegistry,
            // cacheCandles.length > 0 ? cacheCandles.length : 0,
            from,
            to,
        );
        if (!result) return;
        set((draft) => {
            // if (!chartId || !indicRegistry) return;
            // const { barsData: bars, from, to } = getBars(cacheCandles, candles);
            // const result = finalIndicatorData(
            //     bars,
            //     indicRegistry,
            //     // cacheCandles.length > 0 ? cacheCandles.length : 0,
            //     from,
            //     to,
            // );
            draft.indicatorsByChartId[chartId][indicRegistry.id] = {
                registry: { ...indicRegistry },
                result,
            };
        });
    },
    updateIndicatorHistoryByChartAndIndicatorId: (
        chartId,
        indicRegistry,
        cacheCandles,
        candles,
    ) => {
        if (!chartId || !indicRegistry) return;
        const state = get();

        const presentData = state.chartsById[chartId].candles.slice(0, 70);

        const {
            barsData: bars,
            from,
            to,
        } = getBars(cacheCandles, candles, presentData);

        const result = finalIndicatorData(bars, indicRegistry, from, to);
        if (!result) return;
        set((draft) => {
            const plotConfig = indicRegistry.plotConfig;
            const resultData =
                draft.indicatorsByChartId[chartId][indicRegistry.id].result;
            if (!result || !resultData) return;
            for (const pConfig of plotConfig) {
                resultData[pConfig.id] = [
                    ...result[pConfig.id],
                    ...resultData[pConfig.id],
                ];
            }
        });
    },
    updateLiveIndicatorByChartAndIndicatorId: (
        chartId,
        indicRegistry,
        candle,
    ) => {
        if (!chartId || !indicRegistry) return;
        const state = get();
        const presentData = state.chartsById[chartId].candles.slice(-200);
        if (presentData[presentData.length - 1].time === candle.time) {
            presentData[presentData.length - 1] = candle;
        } else {
            presentData.push(candle);
        }
        // console.log(presentData.length);
        const { barsData: bars, from, to } = getBars([], [], presentData);
        // console.log(bars.length);
        const result = finalIndicatorData(bars, indicRegistry, from, to);
        // console.log(result);
        if (!result) return;
        set((draft) => {
            const plotConfig = indicRegistry.plotConfig;
            const resultData =
                draft.indicatorsByChartId[chartId][indicRegistry.id].result;
            if (!result || !resultData) return;
            for (const pConfig of plotConfig) {
                const lastData =
                    result[pConfig.id][result[pConfig.id].length - 1];
                if (
                    lastData.time ===
                    resultData[pConfig.id][resultData[pConfig.id].length - 1]
                        .time
                ) {
                    resultData[pConfig.id][resultData[pConfig.id].length - 1] =
                        lastData;
                } else {
                    resultData[pConfig.id].push(lastData);
                }
            }
        });
    },
});

// updateIndicatorHistoryByChartAndIndicatorId: (
//     chartId,
//     indicRegistry,
//     cacheCandles,
//     candles,
// ) => {
//     set((state) => {
//         if (!chartId || !indicRegistry) return;
//         const presentData = state.chartsById[chartId].candles.slice(0, 70);
//         console.log(presentData);
//         const {
//             barsData: bars,
//             from,
//             to,
//         } = getBars(cacheCandles, candles, presentData);
//         console.log(bars);
//         const result = finalIndicatorData(
//             bars,
//             indicRegistry,
//             from,
//             to,
//             // cacheCandles.length > 0 ? cacheCandles.length : 0,
//         );
//         console.log(result);
//         const plotConfig = indicRegistry.plotConfig;
//         const resultData =
//             state.indicatorsByChartId[chartId][indicRegistry.id].result;
//         if (!result || !resultData) return;
//         for (const pConfig of plotConfig) {
//             resultData[pConfig.id] = [
//                 ...result[pConfig.id],
//                 ...resultData[pConfig.id],
//             ];
//         }
//     });
// },
