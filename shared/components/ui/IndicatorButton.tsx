import { ChartBarIcon } from '@heroicons/react/24/solid';

export default function IndicatorButton() {
    return (
        <button className="rounded-xl flex items-center min-w-40 justify-center gap-2 text-xl cursor-pointer">
            <ChartBarIcon className=" h-5 w-5" />
            Indicators
        </button>
    );
}
