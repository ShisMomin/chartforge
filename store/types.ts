import { ChartLayoutSlice } from '@/store/slices/chartLayoutSlice';
import { ChartsDataSlice } from '@/store/slices/chartDataSlice';
import { IndicatorSlice } from '@/store/slices/indicatorSlice';
import { PaneSlice } from '@/store/slices/paneSlice';

export type RootState = ChartLayoutSlice &
    ChartsDataSlice &
    IndicatorSlice &
    PaneSlice;
