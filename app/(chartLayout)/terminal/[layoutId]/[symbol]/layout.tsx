import LayoutHeader from '@/features/layouts/components/LayoutHeader';
import { getChartLayout } from '@/lib/data-service';
import BinanceSocketProvider from '@/shared/providers/binance-socket-provider';
import ChartDataInit from '@/shared/init/chart-data-init';
import LayoutInit from '@/shared/init/global-layout-init';
import IndicatorDataInit from '@/shared/init/indicator-data-init';
import PaneInit from '@/shared/init/pane-init';
import { notFound } from 'next/navigation';
import { ReactNode, Suspense } from 'react';
import LayoutLoading from '../../loading';

export const metadata = {
    title: 'Chart Terminal',
};
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
    // console.log(symbol);
    return (
        <BinanceSocketProvider>
            {/* <div className="flex flex-col h-screen min-h-0"> */}
            <div className="flex flex-col h-full">
                <LayoutHeader />
                <div className="flex-1 min-h-0 min-w-0">
                    {
                        <Suspense fallback={<LayoutLoading />}>
                            <LayoutInit initialLayout={layoutData}>
                                <ChartDataInit
                                    initialLayout={layoutData}
                                    symbol={symbol}
                                >
                                    <IndicatorDataInit
                                        initialLayout={layoutData}
                                    >
                                        <PaneInit initialLayout={layoutData}>
                                            {children}
                                        </PaneInit>
                                    </IndicatorDataInit>
                                </ChartDataInit>
                            </LayoutInit>
                        </Suspense>
                    }
                </div>
            </div>
        </BinanceSocketProvider>
    );
}
