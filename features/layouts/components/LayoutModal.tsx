'use client';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type LayoutModalProps = {
    source: ReactNode;
    children: ReactNode;
    modalWidth?: number;
};

type Position = {
    top: number;
    left: number;
};

export default function LayoutModal({
    source,
    children,
    modalWidth = 200,
}: LayoutModalProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [pos, setPos] = useState<Position>({ top: 0, left: 0 });
    const btnRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const toggle = () => {
        if (!btnRef.current) return;
        const rect = btnRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;

        // Right-align modal with button
        let left = rect.right - modalWidth;

        // Clamp to viewport
        if (left < 8) left = 8;
        if (left + modalWidth > viewportWidth - 8)
            left = viewportWidth - modalWidth - 8;

        setPos({
            top: rect.bottom + 10, // 10px gap
            left,
        });

        setOpen((v) => !v);
    };
    // useEffect(() => {
    //     const handler = (e: MouseEvent) => {
    //         const target = e.target as HTMLElement | null;
    //         if (!target) return;
    //         const clickedInput = target.closest('input, textarea, select');
    //         if (
    //             btnRef.current &&
    //             !btnRef.current.contains(target) &&
    //             !clickedInput
    //         ) {
    //             setOpen(false);
    //         }
    //     };
    //     document.addEventListener('mousedown', handler);
    //     return () => document.removeEventListener('mousedown', handler);
    // }, []);

    useEffect(() => {
        if (!open) return;

        const handler = (e: MouseEvent) => {
            const target = e.target as Node;
            if (
                !modalRef.current ||
                !btnRef.current ||
                btnRef.current.contains(target)
            )
                return;

            if (!modalRef.current.contains(target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);
    return (
        <>
            <div
                ref={btnRef}
                onClick={toggle}
                className="flex items-center px-1.5 rounded-md hover:bg-hover relative cursor-pointer"
            >
                {source}
            </div>

            {/* Popover */}
            {open &&
                createPortal(
                    <div
                        ref={modalRef}
                        style={{
                            position: 'fixed',
                            top: pos.top,
                            left: pos.left,
                            width: modalWidth,
                        }}
                        className="z-50 rounded-md border border-panel-border bg-background shadow-lg animate-scaleFade"
                    >
                        {children}
                    </div>,
                    document.body,
                )}
        </>
    );
}
// export default function LayoutModal({
//     source,
//     children,
//     modalWidth = 200,
// }: LayoutModalProps) {
//     const [open, setOpen] = useState<boolean>(false);
//     const [pos, setPos] = useState<Position>({ top: 0, left: 0 });
//     const btnRef = useRef<HTMLButtonElement | null>(null);
//     const toggle = () => {
//         if (!btnRef.current) return;
//         const rect = btnRef.current.getBoundingClientRect();
//         const viewportWidth = window.innerWidth;

//         // Right-align modal with button
//         let left = rect.right - modalWidth;

//         // Clamp to viewport
//         if (left < 8) left = 8;
//         if (left + modalWidth > viewportWidth - 8)
//             left = viewportWidth - modalWidth - 8;

//         setPos({
//             top: rect.bottom + 10, // 10px gap
//             left,
//         });

//         setOpen((v) => !v);
//     };
//     useEffect(() => {
//         const handler = (e: MouseEvent) => {
//             const target = e.target as HTMLElement | null;
//             if (!target) return;
//             const clickedInput = target.closest('input, textarea, select');
//             if (
//                 btnRef.current &&
//                 !btnRef.current.contains(target) &&
//                 !clickedInput
//             ) {
//                 setOpen(false);
//             }
//         };
//         document.addEventListener('mousedown', handler);
//         return () => document.removeEventListener('mousedown', handler);
//     }, []);

//     return (
//         <>
//             <button
//                 ref={btnRef}
//                 onClick={toggle}
//                 className="p-1.5 rounded-md hover:bg-hover relative cursor-pointer"
//             >
//                 {source}
//             </button>

//             {/* Popover */}
//             {open &&
//                 createPortal(
//                     <div
//                         style={{
//                             position: 'fixed',
//                             top: pos.top,
//                             left: pos.left,
//                             width: modalWidth,
//                         }}
//                         className="z-50 rounded-md border border-panel-border bg-background shadow-lg animate-scaleFade"
//                     >
//                         {children}
//                     </div>,
//                     document.body,
//                 )}
//         </>
//     );
// }
