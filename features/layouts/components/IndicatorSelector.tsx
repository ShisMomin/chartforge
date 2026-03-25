'use client';
import {
    indicatorRegistry,
    type IndicatorRegistryEntry,
} from 'lightweight-charts-indicators';
import { useMemo, useState } from 'react';
import { useStore } from '@/store/store';
import { selectActiveChartIndicatorIds } from '@/store/selectors/indicatorsDataSelectors';
import { useShallow } from 'zustand/shallow';
import { selectSyncSymbolAndIndicator } from '@/store/selectors/chartDataSelectors';

export default function IndicatorSelector() {
    const [query, setQuery] = useState('');
    const {
        addIndicatorByActiveChartId,
        removeIndicatorByActiveChartId,
        addIndicatorOnPaneByActiveChartId,
        removeIndicatorFromPaneByActiveChartId,
        removeIndicatorFromAllChartPanes,
        removeIndicatorFromAllCharts,
        addIndicatorOnAllChartPanes,
        addIndicatorOnAllChart,
    } = useStore();
    const activeIndicatorIds = useStore(
        useShallow(selectActiveChartIndicatorIds),
    );
    const { syncIndicator } = useStore(
        useShallow(selectSyncSymbolAndIndicator),
    );
    // Filter indicators based on search query
    const filtered: IndicatorRegistryEntry[] = useMemo(() => {
        if (!query.trim()) {
            return indicatorRegistry; // Show all if query is empty
        }

        const searchTerm = query.toLowerCase();

        return indicatorRegistry.filter(
            (indicator) =>
                indicator.name.toLowerCase().includes(searchTerm) ||
                indicator.id.toLowerCase().includes(searchTerm) ||
                indicator.category.toLowerCase().includes(searchTerm) ||
                indicator.shortName.toLowerCase().includes(searchTerm),
        );
    }, [query]);
    function handleClick(
        indicRegistry: IndicatorRegistryEntry,
        isIndiActive: boolean,
    ) {
        if (!syncIndicator) {
            if (isIndiActive)
                if (removeIndicatorFromPaneByActiveChartId(indicRegistry))
                    return removeIndicatorByActiveChartId(indicRegistry);
            if (addIndicatorOnPaneByActiveChartId(indicRegistry))
                return addIndicatorByActiveChartId(indicRegistry);
        } else {
            if (isIndiActive)
                if (removeIndicatorFromAllChartPanes(indicRegistry))
                    return removeIndicatorFromAllCharts(indicRegistry);
            if (addIndicatorOnAllChartPanes(indicRegistry))
                return addIndicatorOnAllChart(indicRegistry);
        }
    }
    return (
        <>
            <span className="px-3 py-2 text-sm">Select indicator</span>
            <div className="flex flex-col gap-2 p-2 min-h-50">
                <div className="px-3 py-2">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg
                     border border-emerald-400/60 text-sm
                     placeholder-gray-400
                     focus:outline-none focus:ring-1 focus:ring-emerald-400"
                        type="text"
                        placeholder="Search indicator"
                    />
                </div>

                {/* List */}
                <div className="max-h-56 overflow-y-auto px-1">
                    {filtered.length === 0 && (
                        <div className="px-3 py-2 text-sm text-gray-500">
                            No indicators found
                        </div>
                    )}

                    {filtered.map((indicator) => {
                        const indiActive = activeIndicatorIds.includes(
                            indicator.id,
                        );
                        return (
                            <button
                                key={indicator.id}
                                className={`w-full flex items-center
                            px-3 py-2 rounded-md text-sm
                            transition cursor-pointer my-1 ${indiActive ? 'bg-active' : 'hover:bg-hover'}`}
                                onClick={() =>
                                    handleClick(indicator, indiActive)
                                }
                            >
                                {indicator.shortName}
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
