'use client';
import { ReactNode, useEffect } from 'react';
import { useStore } from '@/store/store';
import type { ChartLayout } from '@/schemas';

interface Props {
    children: ReactNode;
    initialLayout: ChartLayout;
}

export default function PaneProvider({ children, initialLayout }: Props) {
    const { setInitPane, clearPaneData } = useStore();
    useEffect(() => {
        setInitPane(initialLayout.charts);
        return () => {
            clearPaneData();
        };
    }, [initialLayout, setInitPane, clearPaneData]);

    return <>{children}</>;
}
// export default function PaneProvider({ children, initialLayout }: Props) {
//     const { setInitPane } = useStore();
//     const initialized = useRef(false);
//     useEffect(() => {
//         if (initialized.current) return;
//         setInitPane(initialLayout.charts);
//         initialized.current = true;
//     }, [initialLayout, setInitPane]);

//     return <>{children}</>;
// }
