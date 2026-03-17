'use client';
import { ReactNode, useEffect } from 'react';
import { useStore } from '@/store/store';
import type { ChartLayout } from '@/schemas';

interface Props {
    children: ReactNode;
    initialLayout: ChartLayout;
}

export default function LayoutProvider({ children, initialLayout }: Props) {
    const { setInitLayout, clearLayout } = useStore();
    // useEffect(() => {
    //     dispatch(setLayout(initialLayout));
    // }, [dispatch, initialLayout]);
    useEffect(() => {
        // console.log('called');
        setInitLayout(initialLayout);
        return () => {
            clearLayout();
        };
    }, [initialLayout, setInitLayout, clearLayout]);

    return <>{children}</>;
}

// export default function LayoutProvider({ children, initialLayout }: Props) {
//     const { setInitLayout, clearLayout } = useStore();
//     const initialized = useRef(false);
//     // useEffect(() => {
//     //     dispatch(setLayout(initialLayout));
//     // }, [dispatch, initialLayout]);
//     useEffect(() => {
//         console.log('called');
//         if (initialized.current) return;
//         setInitLayout(initialLayout);
//         initialized.current = true;
//         return () => {
//             clearLayout();
//             console.log('clear called');
//         };
//     }, [initialLayout, setInitLayout, clearLayout]);

//     return <>{children}</>;
// }
// export default function LayoutProvider({ children, initialLayout }: Props) {
//     const dispatch = useAppDispatch();
//     const initialized = useRef(false);
//     // useEffect(() => {
//     //     dispatch(setLayout(initialLayout));
//     // }, [dispatch, initialLayout]);
//     useEffect(() => {
//         if (initialized.current) return;
//         dispatch(setLayout(initialLayout));
//         initialized.current = true;
//     }, [dispatch, initialLayout]);

//     return <>{children}</>;
// }
