import { useChartDataEngine } from '@/shared/providers/chart-data-engine-provider';
import { selectChartDataByChartId } from '@/store/selectors/chartDataSelectors';
import { useStore } from '@/store/store';
import {
    CandlestickData,
    LogicalRangeChangeEventHandler,
    Time,
} from 'lightweight-charts';
import {
    PriceScale,
    TimeScale,
    TimeScaleApiRef,
    WatermarkText,
} from '@shismomin/lightweight-charts-react-components';
import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PaneLegend } from '@shismomin/lwc-plugin-pracplugin';
import CustomCandlestickSeries from '../../../shared/components/chart-components/series/CustomCandlestickSeries';
import SamePaneIndicator from '../../indicators/SamePaneIndicator';
import CustomPane from '@/shared/components/chart-components/panes/CustomPane';

type Props = {
    indicatorIds: string[];
    stretchFactor: number;
};

const EMPTY_CANDLES: CandlestickData[] = [];

/////////////////////////////////////

export default function MainChart({ indicatorIds, stretchFactor }: Props) {
    const { chartId, fetchMoreData } = useChartDataEngine();
    const timeScaleRef = useRef<TimeScaleApiRef>(null);
    const chartData = useStore(selectChartDataByChartId(chartId));
    const candles = chartData.candles ?? EMPTY_CANDLES;
    const prevLoadingRef = useRef(chartData.prevLoading);
    const [legendApi, setLegendApi] = useState<PaneLegend>(new PaneLegend());
    useEffect(
        function () {
            prevLoadingRef.current = chartData.prevLoading;
        },
        [chartData.prevLoading],
    );
    const chartCandles: CandlestickData[] = useMemo(
        () =>
            candles.map((c) => ({
                time: c.time as Time,
                open: c.open,
                high: c.high,
                low: c.low,
                close: c.close,
            })),
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
                if (prevLoadingRef.current || !r) return;
                if (r.from < 5) {
                    debouncedFetchMore();
                }
            },
            [debouncedFetchMore],
        );

    return (
        <CustomPane legendApi={legendApi} stretchFactor={stretchFactor}>
            <CustomCandlestickSeries
                data={chartCandles}
                options={{
                    priceLineVisible: false,
                }}
                legendApi={legendApi}
            />
            {indicatorIds.length > 0 && (
                <SamePaneIndicator
                    indicatorIds={indicatorIds}
                    legendApi={legendApi}
                />
            )}
            <TimeScale
                ref={timeScaleRef}
                onVisibleLogicalRangeChange={onVisibleLogicalRangeChange}
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
                        color: `#20f710`,
                        fontSize: 20,
                    },
                ]}
            />
        </CustomPane>
    );
}
