import React, { ReactNode } from 'react';
interface Props {
    active: boolean;
    children: ReactNode;
    onButtonClick?: () => void;
}
export default function Button({ active, children, onButtonClick }: Props) {
    return (
        <button
            className={`flex items-center justify-center gap-2 px-3 md:px-5 py-2 text-xs md:text-sm rounded-md hover:bg-muted transition ${active ? 'bg-active' : 'hover:bg-hover bg-panel'} cursor-pointer`}
            onClick={() => {
                onButtonClick?.();
            }}
        >
            {children}
        </button>
    );
}
