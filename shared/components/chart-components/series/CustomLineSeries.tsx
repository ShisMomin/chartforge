import {
    LineSeries,
    SeriesApiRef,
} from '@shismomin/lightweight-charts-react-components';
import {
    DeepPartial,
    LineStyleOptions,
    SeriesOptionsCommon,
    Time,
} from 'lightweight-charts';
import { CrosshairListener, PaneLegend } from 'lwc-plugin-pracplugin';
import { PlotConfig } from 'oakscriptjs';
import React, { useEffect, useRef } from 'react';
type LineSeriesData = {
    time: Time;
    value: number;
};
interface Props {
    data: LineSeriesData[];
    options?: DeepPartial<LineStyleOptions & SeriesOptionsCommon> | undefined;
    legend: PaneLegend;
    plotData: PlotConfig;
    addLabel?: string;
}
export default function CustomLineSeries({
    data,
    options,
    legend,
    plotData,
    addLabel = '',
}: Props) {
    const seriesRef = useRef<SeriesApiRef<'Line'> | null>(null);
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!seriesRef.current) return;
            const series = seriesRef.current.api();
            legend.addLegendItem({
                id: `${plotData.id}-${plotData.title}`,
                textColor: plotData.color,
                label: addLabel,
                value: '∅',
            });
            const crosshairRef = new CrosshairListener(legend, [
                {
                    id: `${plotData.id}-${plotData.title}`,
                    label: addLabel,
                    value: '∅',
                },
            ]);
            series?.attachPrimitive(crosshairRef);
        }, 150);
        return () => {
            legend.removeLegendItem(`${plotData.id}-${plotData.title}`);
            clearTimeout(timeoutId);
        };
    }, [legend, plotData.id, plotData.color, plotData.title, addLabel]);
    return <LineSeries ref={seriesRef} data={data} options={options} />;
}
