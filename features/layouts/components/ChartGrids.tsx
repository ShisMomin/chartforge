'use client';
import { selectLayout } from '@/store/selectors/layoutSelectors';
import { useStore } from '@/store/store';
import { ReactNode } from 'react';
type Props = {
    children: ReactNode;
};

export default function ChartGrids({ children }: Props) {
    // const layoutData = useAppSelector((store) => store.layout.layout);
    const layoutData = useStore(selectLayout);
    if (!layoutData) return null;

    const { numRows, numCols } = layoutData;

    return (
        <div
            className="grid w-full h-full min-h-0 min-w-0 gap-px"
            style={{
                gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${numRows}, minmax(0, 1fr))`,
            }}
        >
            {children}
        </div>
    );
}

// export default function ChartGrids({ children }: Props) {
//     const layoutData = useAppSelector((store) => store.layout.layout);

//     if (!layoutData) return null;
//     const { numRows, numCols } = layoutData;

//     return (
//         <div
//             className="grid h-full w-full gap-px"
//             style={{
//                 gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))`,
//                 gridTemplateRows: `repeat(${numRows}, minmax(0, 1fr))`,
//             }}
//         >
//             {children}
//         </div>
//     );
// }
