'use client';

import { Ticker } from '@/shared/types/common';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useRemoveWatchlist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (symbol: string) => {
            const res = await fetch('/api/watchlist', {
                method: 'DELETE',
                body: JSON.stringify({ symbol }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                throw new Error('Failed to remove symbol');
            }

            return res.json();
        },

        onMutate: async (symbol) => {
            await queryClient.cancelQueries({ queryKey: ['watchlist'] });

            const previousWatchlist = queryClient.getQueryData(['watchlist']);

            queryClient.setQueryData(['watchlist'], (old: Ticker[]) =>
                old?.filter((item) => item.symbol !== symbol),
            );

            return { previousWatchlist };
        },
        onError: (err, symbol, context) => {
            queryClient.setQueryData(['watchlist'], context?.previousWatchlist);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['watchlist'] });
        },
    });
}
