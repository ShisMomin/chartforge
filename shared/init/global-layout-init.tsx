'use client';
import { ReactNode, useEffect } from 'react';
import { useStore } from '@/store/store';
import type { ChartLayout } from '@/schemas';

interface Props {
    children: ReactNode;
    initialLayout: ChartLayout;
}

export default function LayoutInit({ children, initialLayout }: Props) {
    const { setInitLayout, clearLayout } = useStore();
    useEffect(() => {
        setInitLayout(initialLayout);
        return () => {
            clearLayout();
        };
    }, [initialLayout, setInitLayout, clearLayout]);

    return <>{children}</>;
}
