import { type RootState } from '@/store/types';

export const selectPaneByChartId = (chartId: string) => (state: RootState) =>
    state.paneByChartId[chartId];
