import {
    indicatorRegistry,
    type IndicatorRegistryEntry,
} from 'lightweight-charts-indicators';
import { StateCreator } from 'zustand';
import { RootState } from '../types';
import { CandlestickData } from 'lightweight-charts';
import { Bar } from 'oakscriptjs';
import { finalIndicatorData } from '@/lib/indicatorCalculation';

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
    cacheCandles: CandlestickData[],
    candles: CandlestickData[],
    presentCandles: CandlestickData[] = [],
): GetBarsReturnType {
    if (candles.length <= 0) {
        return {
            barsData: [],
            from: 0,
            to: 0,
        };
    }
    const from = cacheCandles.length;
    const to = from + candles.length;
    const data = [...cacheCandles, ...candles, ...presentCandles];
    // const data = [...cacheCandles, ...candles];
    const barsData = data.map((d) => {
        return {
            time: Number(d.time),
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
        };
    });
    return { barsData, from, to };
}

type IndicatorWithId = Record<string, IndicatorData>;
export interface IndicatorSlice {
    indicatorsByChartId: Record<string, IndicatorWithId>;

    setInitIndicatorData: (chartId: string, indicatorIds: string[]) => void;
    addIndicatorByActiveChartId: (
        indicatorRegistry: IndicatorRegistryEntry,
    ) => void;
    removeIndicatorByActiveChartId: (
        indicatorRegistry: IndicatorRegistryEntry,
    ) => void;
    setIndicatorByChartAndIndicatorId: (
        chartId: string,
        indicRegistry: IndicatorRegistryEntry,
        cacheCandles: CandlestickData[],
        candles: CandlestickData[],
    ) => void;
    updateIndicatorHistoryByChartAndIndicatorId: (
        chartId: string,
        indicRegistry: IndicatorRegistryEntry,
        cacheCandles: CandlestickData[],
        candles: CandlestickData[],
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
    removeIndicatorByActiveChartId: (indicRegistry) => {
        set((state) => {
            const actId = state.activeChartId;
            if (!actId) return;
            delete state.indicatorsByChartId[actId]?.[indicRegistry.id];
        });
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

        const presentData = state.chartsById[chartId].candles
            .slice(0, 70)
            .map((c) => ({ ...c }));

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
