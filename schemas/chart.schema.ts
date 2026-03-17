// import { IndicatorRegistryEntry } from 'lightweight-charts-indicators';
import { z } from 'zod';
import { type TimeFrameType } from '@/shared/types/common';

export const TimeframeSchema = z.custom<TimeFrameType>(
    (val) =>
        typeof val === 'string' &&
        [
            '1s',
            '5s',
            '10s',
            '15s',
            '30s',
            '1m',
            '2m',
            '3m',
            '5m',
            '10m',
            '15m',
            '30m',
            '45m',
            '1h',
            '2h',
            '3h',
            '4h',
            '8h',
            '12h',
            '1d',
            '2d',
            '3d',
            '1w',
            '2w',
            '1M',
        ].includes(val),
);
export const ChartSchema = z.object({
    chartId: z.string().uuid(),
    symbol: z.string().min(1),
    // timeframe: z.string().min(1),
    timeframe: TimeframeSchema,
    indicators: z.array(z.string()).default([]),
});

export type ChartConfig = z.infer<typeof ChartSchema>;

// export type ChartConfig = Omit<z.infer<typeof ChartSchema>, 'indicators'> & {
//     indicators: IndicatorRegistryEntry[];
// };
