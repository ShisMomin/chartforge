'use client';
import Link from 'next/link';
import { useState } from 'react';
import ThemeSwitch from './ModeToggle';
import { UserButton, useUser } from '@clerk/nextjs';
import SearchSymbol from './SearchSymbol';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const navLinks = [
    { name: 'Dashboard', href: '/' },
    { name: 'Markets', href: '/markets' },
    { name: 'Chart Terminal', href: '/terminal' },
    { name: 'Watchlist', href: '/watchlist' },
];

const navLinkClass =
    'relative text-base font-medium text-muted-foreground transition-colors duration-200  after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full';

const avatarAppearance = {
    elements: {
        avatarBox: {
            height: '32px',
            width: '32px',
        },
    },
};

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    // const [searchOpen, setSearchOpen] = useState(false);
    const { user, isSignedIn, isLoaded } = useUser();

    return (
        <nav className="relative flex items-center justify-between h-14 md:h-16 w-full px-6 border-b border-border bg-panel z-50">
            {/* Logo */}
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
            {/* Desktop Nav */}
            <ul className="hidden xl:flex items-center gap-8">
                {navLinks.map((link) => (
                    <li key={link.name}>
                        <Link href={link.href} className={navLinkClass}>
                            {link.name}
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Right Section Desktop */}
            <div className="hidden xl:flex items-center gap-4">
                <SearchSymbol isRedirect={true}>
                    <button className="cursor-pointer group opacity-70 hover:opacity-100">
                        <span className="text-base opacity-70 group-hover:opacity-100">
                            <MagnifyingGlassIcon className=" h-7 w-7" />
                        </span>
                    </button>
                </SearchSymbol>
                <ThemeSwitch />

                {!isLoaded ? (
                    <div className="h-8 w-24 bg-muted animate-pulse rounded-md" />
                ) : (
                    !isSignedIn && (
                        <>
                            <Link
                                href="/sign-in"
                                className="px-5 py-1.5 text-sm font-medium rounded-xl border border-border hover:bg-hover transition-all"
                            >
                                Sign In
                            </Link>

                            <Link
                                href="/sign-up"
                                className="px-5 py-1.5 text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
                            >
                                Sign Up
                            </Link>
                        </>
                    )
                )}

                {isSignedIn && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                            {user?.fullName}
                        </span>
                        <UserButton appearance={avatarAppearance} />
                    </div>
                )}
            </div>

            {/* Mobile Right Section */}
            <div className="xl:hidden flex items-center gap-3 z-100">
                <SearchSymbol isRedirect={true}>
                    <button className="cursor-pointer group opacity-70 hover:opacity-100">
                        <span className="text-base opacity-70 group-hover:opacity-100">
                            <MagnifyingGlassIcon className=" h-7 w-7" />
                        </span>
                    </button>
                </SearchSymbol>
                <ThemeSwitch />

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

            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 xl:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Mobile Drawer */}
            <div
                className={`fixed top-0 right-0 h-screen w-72 bg-panel border-l border-border transform transition-transform duration-300 xl:hidden z-50 ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <ul className="flex flex-col gap-6 p-8">
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

                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <Link
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                // className="text-base font-medium text-foreground"
                                className={navLinkClass}
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}

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
        </nav>
    );
}
