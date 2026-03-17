import React, { ReactNode } from 'react';
interface Props {
    active: boolean;
    children: ReactNode;
    onButtonClick?: () => void;
}
export default function Button({ active, children, onButtonClick }: Props) {
    return (
        <button
            className={`px-5 py-2 text-sm rounded-md hover:bg-muted transition ${active ? 'bg-active' : 'hover:bg-hover bg-panel'} cursor-pointer`}
            onClick={() => {
                onButtonClick?.();
            }}
        >
            {children}
        </button>
    );
}
