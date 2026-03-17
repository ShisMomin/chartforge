import {
    CandlestickSeries,
    SeriesApiRef,
} from '@shismomin/lightweight-charts-react-components';
import {
    CandlestickData,
    CandlestickStyleOptions,
    DeepPartial,
    SeriesOptionsCommon,
    Time,
} from 'lightweight-charts';
import { CrosshairListener, PaneLegend } from 'lwc-plugin-pracplugin';
import { useEffect, useRef } from 'react';

interface Props {
    data: CandlestickData<Time>[];
    options?:
        | DeepPartial<CandlestickStyleOptions & SeriesOptionsCommon>
        | undefined;
    legendApi: PaneLegend;
}

export default function CustomCandlestickSeries({
    data,
    options,
    legendApi,
}: Props) {
    const candleSeriesRef = useRef<SeriesApiRef<'Candlestick'> | null>(null);
    useEffect(
        function () {
            const id = setTimeout(function () {
                if (!candleSeriesRef.current) return;
                legendApi?.addLegendItem({
                    id: 'open',
                    label: 'O',
                    value: '∅',
                    textColor: 'blue',
                });
                legendApi?.addLegendItem({
                    id: 'high',
                    label: 'H',
                    value: '∅',
                    textColor: 'blue',
                });
                legendApi?.addLegendItem({
                    id: 'low',
                    label: 'L',
                    value: '∅',
                    textColor: 'blue',
                });
                legendApi?.addLegendItem({
                    id: 'close',
                    label: 'C',
                    value: '∅',
                    textColor: 'blue',
                });
                legendApi?.addLegendItem({
                    id: 'percentage',
                    label: '',
                    value: '∅',
                    textColor: 'blue',
                });
                const candleSeries = candleSeriesRef.current.api();
                const legend = legendApi;
                const crosshairListener = new CrosshairListener(legend, [
                    {
                        id: 'open',
                        label: 'O',
                        value: '∅',
                    },
                    {
                        id: 'high',
                        label: 'H',
                        value: '∅',
                    },
                    {
                        id: 'low',
                        label: 'L',
                        value: '∅',
                    },
                    {
                        id: 'close',
                        label: 'C',
                        value: '∅',
                    },
                    {
                        id: 'percentage',
                        label: '',
                        value: '∅',
                    },
                ]);
                candleSeries?.attachPrimitive(crosshairListener);
            }, 150);
            return () => {
                clearTimeout(id);
            };
        },
        [legendApi],
    );
    return (
        <CandlestickSeries
            ref={candleSeriesRef}
            data={data}
            options={options}
        />
    );
}
