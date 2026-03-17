import { type RootState } from '@/store/types';

export const selectActiveChartId = (state: RootState) => state.activeChartId;
export const selectActiveChartSymbol = (state: RootState) => {
    const id = state.activeChartId;
    if (!id) return null;
    return state.chartsById[id]?.symbol ?? null;
};
export const selectActiveChartTimeframe = (state: RootState) => {
    const id = state.activeChartId;
    if (!id) return null;
    return state.chartsById[id]?.timeframe ?? null;
};
export const selectSyncSymbolAndIndicator = (state: RootState) => {
    return {
        syncIndicator: state.syncIndicator,
        syncSymbol: state.syncSymbol,
    };
};
// export const selectActiveChartIndicatorIds = (state: RootState) => {
//     const id = state.activeChartId;
//     if (!id) return [];
//     return state.chartsById[id]?.indicators ?? [];
// };
// export const selectLastUpdateByChartId =
//     (chartId: string) => (state: RootState) => {
//         return state.chartsById[chartId]?.lastUpdate;
//     };
export const selectLastUpdateByChartId =
    (chartId: string) => (state: RootState) => {
        return state.chartsById[chartId]?.firstHistoryTime;
    };
export const selectSymbolByChartId =
    (chartId: string) => (state: RootState) => {
        return state.chartsById[chartId]?.symbol;
    };
export const selectTimeframeByChartId =
    (chartId: string) => (state: RootState) => {
        return state.chartsById[chartId]?.timeframe;
    };
export const selectChartDataByChartId =
    (chartId: string) => (state: RootState) => {
        return state.chartsById[chartId];
    };

export const selectIndicatorsIdsByChartId =
    (chartId: string) => (state: RootState) => {
        return state.chartsById[chartId].indicators;
    };
