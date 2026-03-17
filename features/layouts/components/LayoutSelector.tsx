'use client';
import { type ChartGrid } from '@/shared/types/common';
import GridChartIcon from '../../../shared/components/ui/GridChartIcon';
import { redirect, useParams } from 'next/navigation';

type LayoutSelectorProps = { layouts: ChartGrid[] };

function getLable(numRows: number, numCols: number) {
    return `${numRows} × ${numCols}`;
}
export default function LayoutSelector({ layouts }: LayoutSelectorProps) {
    const params = useParams();
    const layoutId = Number(params.layoutId);
    if (Number.isNaN(layoutId)) {
        throw new Error('Invalid layoutId');
    }
    return (
        <>
            <div className="px-3 py-2 text-sm">Select layout</div>
            <div className="flex flex-col gap-2 p-2">
                {layouts.map(({ id, numRows, numCols }) => {
                    const active = layoutId === id;
                    const label = getLable(numRows, numCols);
                    return (
                        <button
                            key={label}
                            className={`flex items-center justify-between
                              px-2 py-1.5 rounded-md text-sm cursor-pointer
                              transition
                              ${active ? 'bg-active' : 'hover:bg-hover'}`}
                            onClick={() =>
                                redirect(`/chart/${id}/${params.symbol}`)
                            }
                        >
                            <span className="w-10 text-left">{label}</span>

                            <GridChartIcon
                                rows={numRows}
                                cols={numCols}
                                size={28}
                            />
                        </button>
                    );
                })}
            </div>
        </>
    );
}
