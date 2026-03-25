'use client';
import { ReactNode, useEffect } from 'react';
import { useStore } from '@/store/store';
import type { ChartLayout } from '@/schemas';

interface Props {
    children: ReactNode;
    initialLayout: ChartLayout;
}

export default function IndicatorDataInit({ children, initialLayout }: Props) {
    const { setInitIndicatorData, clearIndicatorData } = useStore();
    useEffect(() => {
        for (const chartData of initialLayout.charts) {
            setInitIndicatorData(chartData.chartId, chartData.indicators);
        }
        return () => {
            clearIndicatorData();
        };
    }, [initialLayout, setInitIndicatorData, clearIndicatorData]);

    return <>{children}</>;
}
