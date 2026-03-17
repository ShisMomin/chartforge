import { useChartDataEngine } from '@/shared/providers/chart-data-engine-provider';
import { selectActiveChartId } from '@/store/selectors/chartDataSelectors';
import { useStore } from '@/store/store';
import { Chart } from '@shismomin/lightweight-charts-react-components';
import { IChartApi } from 'lightweight-charts';
import { ReactNode } from 'react';
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
type CustomChartProps = {
    children: ReactNode;
    initChartInstance?: (chart: IChartApi) => void; // better than Function
};

export default function CustomChart({
    children,
    initChartInstance,
}: CustomChartProps) {
    // const { setActiveChartId } = useStore();
    // const { chartId, initChartInstance } = useChartDataEngine();
    // const activeChartId = useStore(selectActiveChartId);

    return (
        // <div
        //     className={`w-full h-full min-h-0 min-w-0 flex ${activeChartId === chartId ? 'border-2 border-active-border' : ''}`}
        //     onClick={() =>
        //         setActiveChartId(chartId === activeChartId ? null : chartId)
        //     }
        // >
        <Chart
            onInit={initChartInstance}
            options={chartOptions}
            containerProps={{ style: { width: '100%', height: '100%' } }}
        >
            {children}
        </Chart>
        // </div>
    );
}
