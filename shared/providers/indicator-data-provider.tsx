'use client';
import { ReactNode, useEffect } from 'react';
import { useStore } from '@/store/store';
import type { ChartLayout } from '@/schemas';

interface Props {
    children: ReactNode;
    initialLayout: ChartLayout;
}

export default function IndicatorDataProvider({
    children,
    initialLayout,
}: Props) {
    const { setInitIndicatorData, clearIndicatorData } = useStore();
    useEffect(() => {
        // console.log('called indicator effect');
        for (const chartData of initialLayout.charts) {
            setInitIndicatorData(chartData.chartId, chartData.indicators);
        }
        return () => {
            clearIndicatorData();
        };
        // initialized.current = true;
    }, [initialLayout, setInitIndicatorData, clearIndicatorData]);

    return <>{children}</>;
}
// export default function IndicatorDataProvider({
//     children,
//     initialLayout,
// }: Props) {
//     const { setInitIndicatorData } = useStore();
//     const initialized = useRef(false);
//     useEffect(() => {
//         if (initialized.current) return;
//         for (const chartData of initialLayout.charts) {
//             setInitIndicatorData(chartData.chartId, chartData.indicators);
//         }
//         initialized.current = true;
//     }, [initialLayout, setInitIndicatorData]);

//     return <>{children}</>;
// }
