'use client';
import CustomChart from '../../../shared/components/chart-components/chart/CustomChart';
import MainChart from './MainChart';
import Spinner from '@/shared/components/ui/Spinner';
import { useStore } from '@/store/store';
import { useChartDataEngine } from '@/shared/providers/chart-data-engine-provider';
import { selectPaneByChartId } from '@/store/selectors/paneSelectors';
import NewPaneIndicator from '../../indicators/NewPaneIndicator';
import {
    selectActiveChartId,
    selectChartDataByChartId,
} from '@/store/selectors/chartDataSelectors';

export default function CandlestickChart() {
    const { chartId, initChartInstance } = useChartDataEngine();
    const chartData = useStore(selectChartDataByChartId(chartId));
    const paneData = useStore(selectPaneByChartId(chartId));
    const { setActiveChartId } = useStore();
    const activeChartId = useStore(selectActiveChartId);

    if (chartData.initLoading) return <Spinner />;
    return (
        <div
            className={`w-full h-full min-h-0 min-w-0 flex ${activeChartId === chartId ? 'border-2 border-active-border' : ''}`}
            onClick={() =>
                setActiveChartId(chartId === activeChartId ? null : chartId)
            }
        >
            <CustomChart initChartInstance={initChartInstance}>
                {paneData.map((pData) => {
                    if (pData.paneId === 'main') {
                        return (
                            <MainChart
                                indicatorIds={pData.indicatorIds}
                                stretchFactor={pData.stretchFactor}
                                key={pData.paneId}
                            />
                        );
                    }
                    return (
                        pData.indicatorIds.length > 0 && (
                            <NewPaneIndicator
                                indicatorIds={pData.indicatorIds}
                                stretchFactor={pData.stretchFactor}
                                key={`${pData.paneId}`}
                                // key={chartData.timeframe}
                            />
                        )
                    );
                })}
            </CustomChart>
        </div>
    );
}
