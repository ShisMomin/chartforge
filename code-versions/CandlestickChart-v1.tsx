'use client';
import { debounce } from 'lodash';
import Spinner from '@/shared/components/ui/Spinner';
import { useChartDataEngine } from '@/shared/providers/chart-data-engine-provider';
import {
    CandlestickData,
    LogicalRangeChangeEventHandler,
} from 'lightweight-charts';
import {
    CandlestickSeries,
    Chart,
    Pane,
    PriceScale,
    TimeScale,
    WatermarkText,
} from 'lightweight-charts-react-components';
import { useCallback, useMemo, useState } from 'react';
import { useStore } from '@/store/store';
import {
    selectActiveChartId,
    selectChartDataByChartId,
} from '@/store/selectors/chartDataSelectors';
import Indicator from '../indicators/indicator';
import { selectChartIndicatorIdsByChartId } from '@/store/selectors/indicatorsDataSelectors';
import { useShallow } from 'zustand/shallow';

const chartOptions = {
    // width: 200,
    // height: 500,
    autoSize: true,
    // PriceScale: {
    //     borderColor: '#485c7b',
    // },
    layout: {
        attributionLogo: false,
        fontFamily: 'Roboto',
        textColor: '#7882a5',
        background: {
            color: 'transparent',
        },
        panes: {
            separatorColor: '#484444ff',
            // enableResize: false,
        },
        // textColor: 'blue',
    },
    grid: {
        vertLines: {
            visible: false,
        },
        horzLines: {
            visible: false,
        },
    },
    crosshair: {
        mode: 0,
        vertLine: {
            style: 3,
            color: 'gray',
        },
        horzLine: {
            style: 3,
            color: 'gray',
        },
    },
    localization: {
        locale: 'en-IN',
        timeFormatter: (time: number) => {
            const date = new Date(time * 1000);
            return date.toLocaleString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            });
        },
        // priceFormatter: (price) => price.toFixed(0),
    },
};
// return <Chart options={chartOptions}></Chart>;

const EMPTY_CANDLES: CandlestickData[] = [];

export default function CandlestickChart() {
    const { initChartInstance, fetchMoreData } = useChartDataEngine();
    const { setActiveChartId } = useStore();
    const { chartId } = useChartDataEngine();
    const chartData = useStore(selectChartDataByChartId(chartId));
    const activeChartId = useStore(selectActiveChartId);
    const indicatorIds = useStore(
        useShallow(selectChartIndicatorIdsByChartId(chartId)),
    );
    const candles = chartData.candles ?? EMPTY_CANDLES;
    const chartCandles = useMemo(
        () => candles.map((c) => ({ ...c })),
        [candles],
    );
    const debouncedFetchMore = useMemo(
        () =>
            debounce(() => {
                fetchMoreData();
            }, 150),
        [fetchMoreData],
    );

    const onVisibleLogicalRangeChange: LogicalRangeChangeEventHandler =
        useCallback(
            (r) => {
                if (chartData.prevLoading || !r) return;
                if (r.from < 5) {
                    debouncedFetchMore();
                }
            },
            [debouncedFetchMore, chartData.prevLoading],
        );
    if (!chartData || chartData.initLoading) return <Spinner />;
    return (
        <div
            className={`w-full h-full min-h-0 min-w-0 flex ${activeChartId === chartId ? 'border-2 border-active-border' : ''}`}
            onClick={() =>
                setActiveChartId(chartId === activeChartId ? null : chartId)
            }
        >
            <Chart
                onInit={initChartInstance}
                options={chartOptions}
                containerProps={{ style: { width: '100%', height: '100%' } }}
            >
                <Pane>
                    {/* <LineSeries data={data} /> */}
                    <CandlestickSeries data={chartCandles} />
                    <TimeScale
                        onVisibleLogicalRangeChange={
                            onVisibleLogicalRangeChange
                        }
                    />
                    <PriceScale
                        id="right"
                        options={{
                            scaleMargins: {
                                top: 0.3,
                                bottom: 0.2,
                            },
                        }}
                    />

                    <WatermarkText
                        visible={chartData.prevLoading}
                        lines={[
                            {
                                text: 'Loading more data...',
                                color: `#7E89AC`,
                                fontSize: 20,
                            },
                        ]}
                    />
                </Pane>

                {indicatorIds.map((id) => {
                    return <Indicator indicatorId={id} key={id} />;
                })}
            </Chart>
        </div>
    );
}

// export default function CandlestickChart() {
//     return (
//         // <div className="w-full h-full ">
//         <div className="w-full h-full flex">
//             <Chart
//                 options={chartOptions}
//                 containerProps={{ style: { flexGrow: '1' } }}
//             >
//                 <LineSeries data={data}></LineSeries>
//             </Chart>
//         </div>
//     );
// }
