'use client';

import { selectSyncSymbolAndIndicator } from '@/store/selectors/chartDataSelectors';
import { useStore } from '@/store/store';
import { useShallow } from 'zustand/shallow';

export default function SyncSelector() {
    const {
        setSyncSymbol,
        setSyncIndicator,
        removeAllIndicatorFromAllChartPanes,
        removeAllIndicatorFromAllCharts,
    } = useStore();
    const { syncSymbol, syncIndicator } = useStore(
        useShallow(selectSyncSymbolAndIndicator),
    );
    return (
        <div className="flex flex-row px-2 py-2 gap-2">
            <button
                onClick={() => {
                    if (
                        !syncIndicator &&
                        removeAllIndicatorFromAllChartPanes() &&
                        removeAllIndicatorFromAllCharts()
                    ) {
                        setSyncIndicator(!syncIndicator);
                    }
                    if (syncIndicator) setSyncIndicator(!syncIndicator);
                }}
                className={`rounded-2xl border-2 ${syncIndicator ? 'bg-active' : 'hover:bg-hover'} border-blue-600 cursor-pointer`}
            >
                SYNC Indicator
            </button>
            <button
                onClick={() => {
                    setSyncSymbol(!syncSymbol);
                }}
                className={`rounded-2xl border-2  ${syncSymbol ? 'bg-active' : 'hover:bg-hover'} border-blue-600 cursor-pointer`}
            >
                SYNC Symbol
            </button>
        </div>
    );
}
