'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Markets', href: '/markets' },
    { name: 'Terminal', href: '/terminal' },
    { name: 'Watchlist', href: '/watchlist' },
];
const avatarAppearance = {
    elements: {
        avatarBox: {
            height: '32px',
            width: '32px',
        },
    },
};

function getLinkClass(active: boolean) {
    return `relative text-base font-medium text-muted-foreground transition-colors duration-200  after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 ${active ? 'after:w-full' : 'hover:after:w-full'}`;
}
export default function NavDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, isSignedIn, isLoaded } = useUser();
    const pathName = usePathname();
    return (
        <div className="z-100">
            <div className="h-full flex items-center ">
                <button
                    aria-label="Toggle menu"
                    aria-expanded={isOpen}
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="flex flex-col gap-1.25 cursor-pointer"
                >
                    <span
                        className={`block w-6 h-0.5 bg-foreground transition-all ${
                            isOpen ? 'rotate-45 translate-y-2' : ''
                        }`}
                    />
                    <span
                        className={`block w-6 h-0.5 bg-foreground transition-all ${
                            isOpen ? 'opacity-0' : ''
                        }`}
                    />
                    <span
                        className={`block w-6 h-0.5 bg-foreground transition-all ${
                            isOpen ? '-rotate-45 -translate-y-1.5' : ''
                        }`}
                    />
                </button>
            </div>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40"
                    onClick={() => setIsOpen(false)}
                />
            )}
            <div
                className={`fixed top-0 right-0 h-screen w-72 bg-panel border-l border-border transform transition-transform duration-300 ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <ul className="flex flex-col gap-6 px-8 py-15">
                    {isSignedIn && (
                        <li className="flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-foreground">
                                    {user?.fullName}
                                </span>
                                <UserButton appearance={avatarAppearance} />
                            </div>
                            <div className="border-t border-border" />
                        </li>
                    )}

                    {navLinks.map((link) => {
                        const isActive =
                            link.href === '/'
                                ? pathName === '/'
                                : pathName.startsWith(link.href);
                        return (
                            <li key={link.name}>
                                <Link
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={getLinkClass(isActive)}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        );
                    })}

                    {!isSignedIn && isLoaded && (
                        <li className="flex flex-col gap-3 mt-6">
                            <Link
                                href="/sign-in"
                                onClick={() => setIsOpen(false)}
                                className="px-5 py-2 rounded-xl border border-border text-center"
                            >
                                Sign In
                            </Link>

                            <Link
                                href="/sign-up"
                                onClick={() => setIsOpen(false)}
                                className="px-5 py-2 rounded-xl bg-blue-600 text-white text-center"
                            >
                                Sign Up
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}
