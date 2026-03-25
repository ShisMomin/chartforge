'use client';

import { ReactNode, useEffect } from 'react';
import { useStore } from '@/store/store';
import type { ChartLayout } from '@/schemas';

interface Props {
    children: ReactNode;
    initialLayout: ChartLayout;
    symbol: string;
}

export default function ChartDataInit({
    children,
    initialLayout,
    symbol,
}: Props) {
    const { setInitChartData, clearInitChartData } = useStore();
    useEffect(() => {
        // console.log('called');
        setInitChartData(initialLayout.charts, symbol);
        return () => {
            clearInitChartData();
            // console.log('called in clear');
        };
    }, [initialLayout, setInitChartData, symbol, clearInitChartData]);

    return <>{children}</>;
}
