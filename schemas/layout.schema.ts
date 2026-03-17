import { z } from 'zod';
import { ChartSchema } from './chart.schema';
// import { IndicatorRegistryEntry } from 'lightweight-charts-indicators';

export const ChartLayoutSchema = z.object({
    numRows: z.number().int().positive(),
    numCols: z.number().int().positive(),
    charts: z.array(ChartSchema),
});

export type ChartLayout = z.infer<typeof ChartLayoutSchema>;

// export type ChartLayout = Omit<
//     z.infer<typeof ChartLayoutSchema>,
//     'indicators'
// > & {
//     indicators: IndicatorRegistryEntry[];
// };
