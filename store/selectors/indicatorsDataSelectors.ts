import { type RootState } from '@/store/types';

export const selectIndicatorByChartAndIndiId =
    ({ chartId, indId }: { chartId: string; indId: string }) =>
    (state: RootState) => {
        const chartIndicator = state.indicatorsByChartId[chartId];
        if (!chartId || !indId || !chartIndicator || !chartIndicator[indId])
            return null;
        return chartIndicator[indId];
    };
export const selectChartIndicatorIdsByChartId =
    (chartId: string) => (state: RootState) => {
        if (!chartId || !state.indicatorsByChartId[chartId]) return [];
        return Object.keys(state.indicatorsByChartId[chartId]) ?? [];
    };
export const selectActiveChartIndicatorIds = (state: RootState) => {
    const id = state.activeChartId;
    if (!id) return [];
    return Object.keys(state.indicatorsByChartId[id]) ?? [];
};

export const selectChartIndicatorByChartId =
    (chartId: string) => (state: RootState) => {
        if (!chartId || !state.indicatorsByChartId[chartId]) return {};
        return state.indicatorsByChartId[chartId];
    };
