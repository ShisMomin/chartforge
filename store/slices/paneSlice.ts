import { StateCreator } from 'zustand';
import { RootState } from '../types';
import { ChartLayout } from '@/schemas';
import {
    indicatorRegistry,
    IndicatorRegistryEntry,
} from 'lightweight-charts-indicators';

interface PaneConfig {
    paneId: string;
    indicatorIds: string[];
    stretchFactor: number;
}

export interface PaneSlice {
    paneByChartId: Record<string, PaneConfig[]>;
    setInitPane: (charts: ChartLayout['charts']) => void;
    clearPaneData: () => void;
    addIndicatorOnPaneByActiveChartId: (
        registry: IndicatorRegistryEntry,
    ) => boolean;
    addIndicatorOnAllChartPanes: (registry: IndicatorRegistryEntry) => boolean;
    removeIndicatorOnPaneByActiveChartId: (
        registry: IndicatorRegistryEntry,
    ) => boolean;
    removeIndicatorFromAllChartPanes: (
        registry: IndicatorRegistryEntry,
    ) => boolean;
    removeAllIndicatorFromAllChartPanes: () => boolean;
}
function getInitialPaneData(numOfPanes: number, ids: string[]): PaneConfig[] {
    const mainPaneIndicatorIds: string[] = [];
    const otherIndicatorIds: string[] = [];
    for (let i = 0; i < ids.length; i++) {
        const registry = indicatorRegistry.find((ind) => ind.id === ids[i]);
        if (!registry) continue;
        if (registry.metadata.overlay) mainPaneIndicatorIds.push(ids[i]);
        if (!registry.metadata.overlay) otherIndicatorIds.push(ids[i]);
    }
    return Array.from({ length: numOfPanes }, (_, index) => {
        const indicatorIds =
            index === 0
                ? mainPaneIndicatorIds
                : otherIndicatorIds.length > index
                  ? [otherIndicatorIds[index - 1]]
                  : [];
        return {
            paneId: index === 0 ? 'main' : `pane-${index}`,
            indicatorIds,
            stretchFactor: index === 0 ? 2 : indicatorIds.length > 0 ? 0.5 : 0,
        };
    });
}
export const createPaneSlice: StateCreator<
    RootState,
    [['zustand/immer', never]],
    [],
    PaneSlice
> = (set) => ({
    paneByChartId: {},
    setInitPane: (charts) => {
        set((state) => {
            state.paneByChartId = charts.reduce<Record<string, PaneConfig[]>>(
                (acc, chart) => {
                    acc[chart.chartId] = getInitialPaneData(
                        10,
                        chart.indicators,
                    );
                    return acc;
                },
                {},
            );
        });
    },
    clearPaneData: () => {
        set((state) => {
            state.paneByChartId = {};
        });
    },
    addIndicatorOnPaneByActiveChartId: (registry) => {
        let isAdded = false;
        set((state) => {
            const chartId = state.activeChartId;
            if (!chartId) return;
            const chartPanes = state.paneByChartId[chartId];
            for (let i = 0; i < chartPanes.length; i++) {
                if (
                    registry.metadata.overlay &&
                    chartPanes[i].paneId === 'main'
                ) {
                    chartPanes[i].indicatorIds.push(registry.id);
                    isAdded = true;
                    break;
                }
                if (
                    !registry.metadata.overlay &&
                    chartPanes[i].paneId !== 'main' &&
                    chartPanes[i].indicatorIds.length <= 0
                ) {
                    chartPanes[i].indicatorIds.push(registry.id);
                    chartPanes[i].stretchFactor = 0.5;
                    isAdded = true;
                    break;
                }
            }
        });
        return isAdded;
    },
    addIndicatorOnAllChartPanes: (registry) => {
        let isAdded = false;
        set((state) => {
            const chartIds = state.layout?.chartIds;
            if (!chartIds || chartIds.length <= 0) return;

            for (const chartId of chartIds) {
                const chartPanes = state.paneByChartId[chartId];
                for (let i = 0; i < chartPanes.length; i++) {
                    if (
                        registry.metadata.overlay &&
                        chartPanes[i].paneId === 'main'
                    ) {
                        chartPanes[i].indicatorIds.push(registry.id);
                        isAdded = true;
                        break;
                    }
                    if (
                        !registry.metadata.overlay &&
                        chartPanes[i].paneId !== 'main' &&
                        chartPanes[i].indicatorIds.length <= 0
                    ) {
                        chartPanes[i].indicatorIds.push(registry.id);
                        chartPanes[i].stretchFactor = 0.5;
                        isAdded = true;
                        break;
                    }
                }
            }
        });
        return isAdded;
    },
    removeIndicatorOnPaneByActiveChartId: (registry) => {
        let isRemoved = false;
        set((state) => {
            const chartId = state.activeChartId;
            if (!chartId) return;
            const chartPanes = state.paneByChartId[chartId];
            for (let i = 0; i < chartPanes.length; i++) {
                if (
                    registry.metadata.overlay &&
                    chartPanes[i].paneId === 'main' &&
                    chartPanes[i].indicatorIds.includes(registry.id)
                ) {
                    chartPanes[i].indicatorIds = chartPanes[
                        i
                    ].indicatorIds.filter((indId) => indId !== registry.id);
                    isRemoved = true;
                    break;
                }
                if (
                    !registry.metadata.overlay &&
                    chartPanes[i].paneId !== 'main' &&
                    chartPanes[i].indicatorIds.length > 0 &&
                    chartPanes[i].indicatorIds.includes(registry.id)
                ) {
                    chartPanes[i].indicatorIds = chartPanes[
                        i
                    ].indicatorIds.filter((indId) => indId !== registry.id);
                    chartPanes[i].stretchFactor = 0;
                    isRemoved = true;
                    break;
                }
            }
        });
        return isRemoved;
    },
    removeIndicatorFromAllChartPanes: (registry) => {
        let isRemoved = false;
        set((state) => {
            const chartIds = state.layout?.chartIds;
            if (!chartIds || chartIds.length <= 0) return;
            for (const chartId of chartIds) {
                const chartPanes = state.paneByChartId[chartId];
                for (let i = 0; i < chartPanes.length; i++) {
                    if (
                        registry.metadata.overlay &&
                        chartPanes[i].paneId === 'main' &&
                        chartPanes[i].indicatorIds.includes(registry.id)
                    ) {
                        chartPanes[i].indicatorIds = chartPanes[
                            i
                        ].indicatorIds.filter((indId) => indId !== registry.id);
                        isRemoved = true;
                        break;
                    }
                    if (
                        !registry.metadata.overlay &&
                        chartPanes[i].paneId !== 'main' &&
                        chartPanes[i].indicatorIds.length > 0 &&
                        chartPanes[i].indicatorIds.includes(registry.id)
                    ) {
                        chartPanes[i].indicatorIds = chartPanes[
                            i
                        ].indicatorIds.filter((indId) => indId !== registry.id);
                        chartPanes[i].stretchFactor = 0;
                        isRemoved = true;
                        break;
                    }
                }
            }
        });
        return isRemoved;
    },
    removeAllIndicatorFromAllChartPanes: () => {
        let isRemoved = false;
        set((state) => {
            const chartIds = state.layout?.chartIds;
            if (!chartIds || chartIds.length <= 0) return;
            isRemoved = true;
            for (const chartId of chartIds) {
                const chartPanes = state.paneByChartId[chartId];
                for (let i = 0; i < chartPanes.length; i++) {
                    if (
                        chartPanes[i].paneId === 'main' &&
                        chartPanes[i].indicatorIds.length > 0
                    ) {
                        chartPanes[i].indicatorIds = [];
                    }
                    if (
                        chartPanes[i].paneId !== 'main' &&
                        chartPanes[i].indicatorIds.length > 0
                    ) {
                        chartPanes[i].indicatorIds = [];
                        chartPanes[i].stretchFactor = 0;
                    }
                }
            }
        });
        return isRemoved;
    },
});
