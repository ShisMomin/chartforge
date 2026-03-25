'use client';
import CandlestickChart from '@/features/layouts/charts/CandlestickChart';
import ChartDataEngineProvider from '@/shared/providers/chart-data-engine-provider';
import { useStore } from '@/store/store';
import { selectLayout } from '@/store/selectors/layoutSelectors';
import ChartRefsProvider from '@/shared/providers/chart-refs-provider';

export default function LayoutCharts() {
    const layoutData = useStore(selectLayout);
    // const layoutData = useAppSelector((store) => store.layout.layout);
    if (!layoutData) return null;

    const { chartIds } = layoutData;
    return (
        <>
            {chartIds.map((id) => (
                <ChartDataEngineProvider chartId={id} key={id}>
                    <div className="w-full h-full min-h-0 min-w-0">
                        <ChartRefsProvider>
                            <CandlestickChart />
                        </ChartRefsProvider>
                    </div>
                </ChartDataEngineProvider>
            ))}
        </>
    );
}
