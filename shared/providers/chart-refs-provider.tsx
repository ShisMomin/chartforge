import { IChartApi } from 'lightweight-charts';
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useRef,
} from 'react';

type ChartRefsContextValues = {
    chartRef: React.MutableRefObject<IChartApi | null>;
    initChartInstance: (instance: IChartApi) => void;
};

const ChartRefsContext = createContext<ChartRefsContextValues | null>(null);

type Props = {
    children: ReactNode;
};

export default function ChartRefsProvider({ children }: Props) {
    const chartRef = useRef<IChartApi | null>(null);
    const initChartInstance = useCallback((instance: IChartApi) => {
        chartRef.current = instance;
    }, []);

    return (
        <ChartRefsContext.Provider
            value={{
                chartRef,
                initChartInstance,
            }}
        >
            {children}
        </ChartRefsContext.Provider>
    );
}

function useChartRefs() {
    const context = useContext(ChartRefsContext);
    if (!context)
        throw new Error(
            'ChartRefs context was used outside of ChartRefsProveder',
        );
    return context;
}

export { ChartRefsProvider, useChartRefs };
