import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { RootState } from '@/store/types';
import { createChartLayoutSlice } from '@/store/slices/chartLayoutSlice';
import { creatChartDataSlice } from '@/store/slices/chartDataSlice';
import { createIndicatorDataSlice } from './slices/indicatorSlice';
import { createPaneSlice } from './slices/paneSlice';
export const useStore = create<RootState>()(
    immer((...args) => ({
        ...createChartLayoutSlice(...args),
        ...creatChartDataSlice(...args),
        ...createIndicatorDataSlice(...args),
        ...createPaneSlice(...args),
    })),
);
