import { getChartLayout } from '@/lib/data-service';
import Spinner from '@/shared/components/ui/Spinner';
import BinanceSocketProvider from '@/shared/providers/binance-socket-provider';
import ChartDataProvider from '@/shared/providers/chart-data-provider';
import LayoutProvider from '@/shared/providers/global-layout-provider';
import IndicatorDataProvider from '@/shared/providers/indicator-data-provider';
import PaneProvider from '@/shared/providers/pane-provider';
import { notFound } from 'next/navigation';
import { ReactNode, Suspense } from 'react';

export default async function layout({
    params,
    children,
}: {
    children: ReactNode;
    params: Promise<{ layoutId: string; symbol: string }>;
}) {
    const { layoutId, symbol } = await params;
    if (!symbol || !layoutId) return notFound();
    const layoutData = await getChartLayout(layoutId);
    console.log(symbol);
    return (
        <Suspense fallback={<Spinner />}>
            <LayoutProvider initialLayout={layoutData}>
                <ChartDataProvider initialLayout={layoutData} symbol={symbol}>
                    <IndicatorDataProvider initialLayout={layoutData}>
                        <PaneProvider initialLayout={layoutData}>
                            <BinanceSocketProvider>
                                {children}
                            </BinanceSocketProvider>
                        </PaneProvider>
                    </IndicatorDataProvider>
                </ChartDataProvider>
            </LayoutProvider>
        </Suspense>
    );
    return <div>layout</div>;
}
