import { IndicatorResult } from '@/store/slices/indicatorSlice';
import { IndicatorRegistryEntry } from 'lightweight-charts-indicators';
import { Bar } from 'oakscriptjs';

export function finalIndicatorData(
    bars: Bar[],
    registry: IndicatorRegistryEntry,
    from: number = 0,
    to: number,
) {
    const result = registry.calculate(bars, registry.defaultInputs);
    if (!result || !result.plots) return null;
    const plots = result.plots as Record<string, IndicatorResult[]>;
    const slicedPlots: Record<string, IndicatorResult[]> = {};
    Object.entries(plots).forEach(([key, value]) => {
        const newArr = value
            .slice(from, to)
            .filter((ele) => Number.isFinite(ele.value));

        slicedPlots[key] = newArr;
    });

    return slicedPlots;
}
