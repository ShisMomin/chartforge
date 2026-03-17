import React from 'react';

export default function AddWatchlistButton({
    onClick,
}: {
    onClick?: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition cursor-pointer"
        >
            Add Symbol
        </button>
    );
}
