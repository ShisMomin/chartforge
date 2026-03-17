'use client';

import { ReactNode, useEffect } from 'react';
import { useStore } from '@/store/store';
import type { ChartLayout } from '@/schemas';

interface Props {
    children: ReactNode;
    initialLayout: ChartLayout;
    symbol: string;
}

export default function ChartDataProvider({
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
// export default function ChartDataProvider({
//     children,
//     initialLayout,
//     symbol,
// }: Props) {
//     const { setInitChartData, clearInitChartData } = useStore();
//     const initialized = useRef(false);
//     // const searchParams = useSearchParams();

//     // // const symbol = searchParams.get('symbol') ?? '';
//     // console.log(symbol);
//     useEffect(() => {
//         if (initialized.current) return;
//         console.log('called');
//         setInitChartData(initialLayout.charts, symbol);
//         initialized.current = true;
//         return () => {
//             clearInitChartData();
//             console.log('called in clear');
//         };
//     }, [initialLayout, setInitChartData, symbol, clearInitChartData]);

//     return <>{children}</>;
// }
