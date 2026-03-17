import { ReactNode } from 'react';
import { type Metadata } from 'next';
import { getChartLayout } from '@/lib/data-service';
import { notFound } from 'next/navigation';
import LayoutProvider from '@/shared/providers/global-layout-provider';
import LayoutHeader from '@/features/layouts/components/LayoutHeader';
import ChartDataProvider from '@/shared/providers/chart-data-provider';
import IndicatorDataProvider from '@/shared/providers/indicator-data-provider';
import PaneProvider from '@/shared/providers/pane-provider';
import BinanceSocketProvider from '@/shared/providers/binance-socket-provider';

export const metadata: Metadata = {
    title: 'Layout',
};

interface LayoutProps {
    children: ReactNode;
    // params: Promise<{ layoutId: string }>;
}

export default async function Layout({ children }: LayoutProps) {
    // const { layoutId } = await params;
    // if (!layoutId) notFound();

    // const layoutData = await getChartLayout(layoutId);
    return (
        <div className="flex flex-col h-screen min-h-0">
            <LayoutHeader />
            <div className="flex-1 min-h-0 min-w-0">{children}</div>
        </div>
        // <LayoutProvider initialLayout={layoutData}>
        //     <ChartDataProvider initialLayout={layoutData}>
        //         <IndicatorDataProvider initialLayout={layoutData}>
        //             <PaneProvider initialLayout={layoutData}>
        //                 <BinanceSocketProvider>

        //                 </BinanceSocketProvider>
        //             </PaneProvider>
        //         </IndicatorDataProvider>
        //     </ChartDataProvider>
        // </LayoutProvider>
    );
}

// export default async function Layout({ children, params }: LayoutProps) {
//     const { layoutId } = await params;
//     if (!layoutId) notFound();

//     const layoutData = await getChartLayout(layoutId);
//     return (
//         <LayoutProvider initialLayout={layoutData}>
//             <ChartDataProvider initialLayout={layoutData}>
//                 <IndicatorDataProvider initialLayout={layoutData}>
//                     <PaneProvider initialLayout={layoutData}>
//                         <BinanceSocketProvider>
//                             <div className="flex flex-col h-screen min-h-0">
//                                 <LayoutHeader />
//                                 <div className="flex-1 min-h-0 min-w-0">
//                                     {children}
//                                 </div>
//                             </div>
//                         </BinanceSocketProvider>
//                     </PaneProvider>
//                 </IndicatorDataProvider>
//             </ChartDataProvider>
//         </LayoutProvider>
//     );
// }
// export default async function Layout({ children, params }: LayoutProps) {
//     const { layoutId } = await params;
//     if (!layoutId) notFound();

//     const layoutData = await getChartLayout(layoutId);

//     return (
//         <StoreProvider>
//             <LayoutProvider initialLayout={layoutData}>
//                 <ChartDataProvider>
//                     <div className="flex flex-col h-screen min-h-0">
//                         <LayoutHeader />
//                         <div className="flex-1 min-h-0 min-w-0">{children}</div>
//                     </div>
//                 </ChartDataProvider>
//             </LayoutProvider>
//         </StoreProvider>
//     );
// }

// export default async function Layout({ children, params }: LayoutProps) {
//     const { layoutId } = await params;
//     if (!layoutId) {
//         notFound();
//     }
//     const layoutData = await getChartLayout(layoutId);
//     return (
//         <div className="flex flex-col h-screen">
//             <StoreProvider>
//                 <LayoutProvider initialLayout={layoutData}>
//                     <ChartDataProvider>
//                         <LayoutHeader />
//                         {children}
//                     </ChartDataProvider>
//                 </LayoutProvider>
//             </StoreProvider>
//         </div>
//     );
// }
