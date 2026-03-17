import { useChartDataEngine } from '@/shared/providers/chart-data-engine-provider';
import { selectChartIndicatorByChartId } from '@/store/selectors/indicatorsDataSelectors';
import { useStore } from '@/store/store';
import { Time } from 'lightweight-charts';
import { LineSeries, Pane } from 'lightweight-charts-react-components';

type Props = {
    indicatorId: string;
};
export default function Indicator({ indicatorId }: Props) {
    const { chartId } = useChartDataEngine();
    const chartIndicators = useStore(selectChartIndicatorByChartId(chartId));
    if (!chartIndicators) return null;
    const { registry, result } = chartIndicators[indicatorId];
    // console.log(result);
    if (!registry || !result) return null;
    const { plotConfig } = registry;
    // console.log(plotConfig);
    return (
        <Pane>
            {plotConfig.map((indData) => {
                const data = result[indData.id].map((d) => {
                    return {
                        time: d.time as Time,
                        value: d.value,
                    };
                });
                return (
                    <LineSeries
                        data={data}
                        key={indData.title}
                        options={{
                            color: indData.color,
                            lineWidth: 2,
                        }}
                    />
                );
            })}
        </Pane>
    );
}
