'use client';
import { selectActiveChartTimeframe } from '@/store/selectors/chartDataSelectors';
import { useStore } from '@/store/store';

export default function TimeframeButton() {
    // const interval = '1m';
    const interval = useStore(selectActiveChartTimeframe);
    return (
        <button className="flex items-center justify-center h-7 px-2 rounded cursor-pointer transition-colors duration-100 border-none text-lg font-medium p-0 min-w-10 ">
            {interval}
        </button>
    );
}
