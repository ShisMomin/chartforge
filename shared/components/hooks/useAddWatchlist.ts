'use client';

import { Ticker } from '@/shared/types/common';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useAddWatchlist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (symbol: string) => {
            const res = await fetch('/api/watchlist', {
                method: 'POST',
                body: JSON.stringify({ symbol }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                throw new Error('Failed to add symbol');
            }

            return res.json();
        },
        onMutate: async (symbol) => {
            await queryClient.cancelQueries({ queryKey: ['watchlist'] });

            const previousData = queryClient.getQueryData(['watchlist']);

            queryClient.setQueryData(['watchlist'], (old: Ticker[] = []) => [
                {
                    symbol,
                    lastPrice: 0,
                    priceChangePercent: 0,
                },
                ...old,
            ]);

            return { previousData };
        },
        onError: (err, symbol, context) => {
            queryClient.setQueryData(['watchlist'], context?.previousData);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['watchlist'] });
        },
        // onSuccess: () => {
        //     queryClient.invalidateQueries({ queryKey: ['watchlist'] });
        // },
    });
}
