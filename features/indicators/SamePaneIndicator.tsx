'use client';
import { useChartDataEngine } from '@/shared/providers/chart-data-engine-provider';
import { selectChartIndicatorByChartId } from '@/store/selectors/indicatorsDataSelectors';
import { useStore } from '@/store/store';
import { Time } from 'lightweight-charts';
import { PaneLegend } from '@shismomin/lwc-plugin-pracplugin';
import CustomLineSeries from '../../shared/components/chart-components/series/CustomLineSeries';

type Props = {
    indicatorIds: string[];
    legendApi: PaneLegend;
};
export default function SamePaneIndicator({ indicatorIds, legendApi }: Props) {
    const { chartId } = useChartDataEngine();
    const indicatorData = useStore(selectChartIndicatorByChartId(chartId));
    return indicatorIds.map((id) => {
        const indData = indicatorData[id];
        if (!indData?.result || !indData?.registry) return [];

        const { plotConfig } = indData.registry;
        const { result } = indData;
        return plotConfig.map((plotData, index) => {
            const rawSeries = result[plotData.id];
            if (!rawSeries) return null;
            // console.log('rawSeries');
            const data =
                rawSeries.map((d) => {
                    return {
                        time: d.time as Time,
                        value: d.value,
                    };
                }) ?? [];

            return (
                <CustomLineSeries
                    key={`${id}-${plotData.id}`}
                    data={data}
                    legend={legendApi}
                    options={{
                        color: plotData.color,
                        lineWidth: 2,
                        priceLineVisible: false,
                        crosshairMarkerVisible: false,
                    }}
                    plotData={plotData}
                    addLabel={`${index === 0 ? indData.registry.shortName : ''}`}
                />
            );
        });
    });
}
