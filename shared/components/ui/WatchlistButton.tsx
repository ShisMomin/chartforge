import { ListBulletIcon } from '@heroicons/react/24/solid';
import React from 'react';

export default function WatchlistButton() {
    return (
        <button className="rounded-xl flex items-center min-w-30 justify-center gap-2 text-xl cursor-pointer">
            <ListBulletIcon className="w-5 h-5 text-gray-300" />
            Watchlist
        </button>
    );
}
