import {
    Pane,
    PaneApiRef,
} from '@shismomin/lightweight-charts-react-components';
import { PaneLegend } from 'lwc-plugin-pracplugin';
import { ReactNode, useEffect, useRef } from 'react';

type CustomPaneProps = {
    legendApi: PaneLegend;
    stretchFactor: number;
    children: ReactNode;
};
export default function CustomPane({
    legendApi,
    stretchFactor,
    children,
}: CustomPaneProps) {
    const paneRef = useRef<PaneApiRef>(null);
    useEffect(() => {
        const timeoutId = setTimeout(function () {
            if (!paneRef.current) return;
            const paneApi = paneRef.current;
            const pane = paneApi?.api();
            const legend = legendApi;
            pane?.attachPrimitive(legend);
        }, 150);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [legendApi]);
    return (
        <Pane ref={paneRef} stretchFactor={stretchFactor}>
            {children}
        </Pane>
    );
}
