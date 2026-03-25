'use client';
import { useChartRefs } from '@/shared/providers/chart-refs-provider';
import { Chart } from '@shismomin/lightweight-charts-react-components';
import { ReactNode, useEffect, useRef } from 'react';
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
    },
};
type CustomChartProps = {
    children: ReactNode;
};

const getMode = (width: number) => {
    if (width <= 150) return 'mini';
    if (width <= 300) return 'mobile';
    if (width <= 500) return 'tablet';
    return 'desktop';
};
export default function CustomChart({ children }: CustomChartProps) {
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const { chartRef: chartApiRef, initChartInstance } = useChartRefs();
    useEffect(
        function () {
            if (!chartContainerRef.current) return;

            const chartContainer = chartContainerRef.current;

            let currentMode = '';

            const observer = new ResizeObserver((entries) => {
                const { width } = entries[0].contentRect;
                const chartApi = chartApiRef.current;
                if (!chartApi) return;
                const newMode = getMode(width);
                if (newMode === currentMode) return;
                if (newMode === 'mini') {
                    chartApi.applyOptions({
                        layout: { fontSize: 9 },
                        rightPriceScale: { visible: false },
                    });
                }
                if (newMode === 'mobile') {
                    chartApi.applyOptions({
                        layout: { fontSize: 9 },
                        rightPriceScale: { visible: true },
                    });
                }

                if (newMode === 'tablet') {
                    chartApi.applyOptions({
                        layout: { fontSize: 9 },
                        rightPriceScale: { visible: true },
                    });
                }

                if (newMode === 'desktop') {
                    chartApi.applyOptions({
                        layout: { fontSize: 12 },
                        rightPriceScale: { visible: true },
                    });
                }

                currentMode = newMode;
            });

            observer.observe(chartContainer);

            return () => observer.disconnect();
        },
        [chartApiRef],
    );

    return (
        <Chart
            onInit={initChartInstance}
            options={chartOptions}
            ref={chartContainerRef}
            containerProps={{ style: { width: '100%', height: '100%' } }}
        >
            {children}
        </Chart>
    );
}
