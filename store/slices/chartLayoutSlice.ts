import { type StateCreator } from 'zustand';
import { type ChartConfig, type ChartLayout } from '@/schemas';
import { type RootState } from '@/store/types';
export interface Layout {
    numRows: number;
    numCols: number;
    chartIds: string[];
}

export interface LayoutState {
    layout: Layout | null;
    chartsById: Record<string, ChartConfig>;
    activeChartId: string | null;
}

export interface ChartLayoutSlice {
    layout: Layout | null;
    setInitLayout: (chartLayout: ChartLayout) => void;
    clearLayout: () => void;
}

export const createChartLayoutSlice: StateCreator<
    RootState,
    [['zustand/immer', never]],
    [],
    ChartLayoutSlice
> = (set) => ({
    layout: null,
    setInitLayout: (chartLayout) => {
        set((draft) => {
            const { numRows, numCols, charts } = chartLayout;
            draft.layout = {
                numRows,
                numCols,
                chartIds: charts.map((c) => c.chartId),
            };
        });
    },
    clearLayout: () => {
        set((draft) => {
            draft.layout = null;
        });
    },
});
