'use client';
import { selectActiveChartSymbol } from '@/store/selectors/chartDataSelectors';
import { useStore } from '@/store/store';
import { MagnifyingGlassIcon } from '@heroicons/react/16/solid';

type SearchButtonProps = {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
};
export default function SearchButton({ onClick }: SearchButtonProps) {
    // const activeChartId = useAppSelector((state) => state.layout.activeChartId);
    // const symbol = useAppSelector((state) => {
    //     if (!activeChartId) return null;

    //     return state.layout.chartsById[activeChartId]?.symbol ?? null;
    // });

    const symbol = useStore(selectActiveChartSymbol);
    return (
        <button
            className="px-2 py-2 min-w-40 rounded-xl flex items-center justify-center gap-2 text-xl cursor-pointer hover:bg-hover"
            onClick={onClick}
        >
            <MagnifyingGlassIcon className=" h-5 w-5" />
            {/* Search */}
            {symbol ? symbol : 'Search'}
        </button>
    );
}
