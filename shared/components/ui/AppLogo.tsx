import Link from 'next/link';
import React from 'react';

export default function AppLogo() {
    return (
        <Link href="/" className="flex items-center gap-2 group">
            {/* Icon */}
            <div className="relative flex items-end gap-0.5 h-6">
                <span className="w-0.75 h-4 bg-emerald-500 rounded-sm"></span>
                <span className="w-0.75 h-6 bg-red-500 rounded-sm"></span>
                <span className="w-0.75 h-5 bg-emerald-500 rounded-sm"></span>

                {/* forge glow */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary blur-md opacity-60 group-hover:opacity-100 transition"></div>
            </div>

            {/* Text */}
            <span className="text-2xl md:text-3xl font-bold tracking-tight">
                Chart<span className="text-primary">Forge</span>
            </span>
        </Link>
    );
}
