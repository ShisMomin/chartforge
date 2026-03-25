'use client';
import { useWatchlist } from '@/shared/components/hooks/useWatchlist';
import AddWatchlistButton from '@/shared/components/ui/AddWatchlistButton';
import React from 'react';
import WatchlistTable from './WatchlistTable';
import SearchSymbol from '@/shared/components/ui/SearchSymbol';
import { useAddWatchlist } from '@/shared/components/hooks/useAddWatchlist';
import Spinner from '@/shared/components/ui/Spinner';

export default function Watchlist({ isEditable }: { isEditable: boolean }) {
    const { data = [], isLoading } = useWatchlist();
    const { mutate } = useAddWatchlist();
    return (
        <>
            <div className="h-full flex flex-col gap-2">
                {isLoading ? (
                    <Spinner />
                ) : (
                    <>
                        {isEditable && (
                            <SearchSymbol
                                isRedirect={true}
                                watchlist={true}
                                watchlistAddFn={(symbol) => mutate(symbol)}
                                watchlistData={data}
                            >
                                <AddWatchlistButton />
                            </SearchSymbol>
                        )}

                        <WatchlistTable data={data} isEditable={isEditable} />
                    </>
                )}
            </div>
        </>
    );
}
