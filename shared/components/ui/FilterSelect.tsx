import { ChevronDownIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';

type Props = {
    selectedItem: string;
    itemList: string[];
    onSelectionChangeHandler?: (item: string) => void;
};
export default function FilterSelect({
    selectedItem,
    itemList,
    onSelectionChangeHandler,
}: Props) {
    const [isSelectOpen, setIsSelectOpen] = useState(false);

    return (
        <>
            <button
                className="flex items-center gap-2 px-2 py-1 bg-btnbg border border-panel-border rounded-md text-sm hover:bg-hover transition-colors cursor-pointer"
                onClick={() => setIsSelectOpen((pre) => !pre)}
            >
                {selectedItem}
                <ChevronDownIcon
                    className={`w-4 h-4 transition-transform duration-200 ${
                        isSelectOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                />
            </button>

            {isSelectOpen && (
                <div
                    className={` absolute mt-3 w-20 bg-card border border-panel-border rounded-md shadow-lg z-40 transform transition-all duration-200 ease-out ${isSelectOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
                >
                    <div className="max-h-60 overflow-auto">
                        {itemList.map((item) => (
                            <div
                                key={item}
                                onClick={() => onSelectionChangeHandler?.(item)}
                                className={`px-3 py-2  cursor-pointer ${item === selectedItem ? 'bg-active' : 'hover:bg-hover'}`}
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
