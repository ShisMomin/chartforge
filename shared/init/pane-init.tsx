'use client';
import { ReactNode, useEffect } from 'react';
import { useStore } from '@/store/store';
import type { ChartLayout } from '@/schemas';

interface Props {
    children: ReactNode;
    initialLayout: ChartLayout;
}

export default function PaneInit({ children, initialLayout }: Props) {
    const { setInitPane, clearPaneData } = useStore();
    useEffect(() => {
        setInitPane(initialLayout.charts);
        return () => {
            clearPaneData();
        };
    }, [initialLayout, setInitPane, clearPaneData]);

    return <>{children}</>;
}
