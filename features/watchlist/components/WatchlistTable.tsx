'use client';
import { BinanceTickerEvent } from '@/lib/binance/BinanceSocket';
import { useRemoveWatchlist } from '@/shared/components/hooks/useRemoveWatchlist';
import CoinIcon from '@/shared/components/ui/CoinIcon';
import Table from '@/shared/components/ui/Table';
import { useBinanceSocket } from '@/shared/providers/binance-socket-provider';
import { Ticker } from '@/shared/types/common';
import { useCallback, useEffect, useRef, useState } from 'react';

function formatPrice(price: string | number) {
    const num = Number(price);

    if (num >= 1000)
        return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
    if (num >= 1) return num.toFixed(2);
    if (num >= 0.01) return num.toFixed(4);
    if (num >= 0.0001) return num.toFixed(6);

    return num.toPrecision(2); // ultra small coins
}
function createCoinsMap<T extends Ticker>(coins: T[]) {
    const map = new Map<string, T>();
    for (const coin of coins) {
        map.set(coin.symbol, coin);
    }
    return map;
}
export default function WatchlistTable({
    data,
    isEditable,
}: {
    data: Ticker[];
    isEditable: boolean;
}) {
    const { mutate: removeSymbol } = useRemoveWatchlist();
    const coinsRef = useRef(createCoinsMap(data));
    // const symbolsRef = useRef(data.map((coin) => coin.symbol));
    const [finalData, setFinalData] = useState(data);
    const { socket } = useBinanceSocket();
    const onTickerData = useCallback(function (e: BinanceTickerEvent) {
        // console.log(e);
        const symbol = e.s;
        const existing = coinsRef.current.get(symbol);
        if (!existing) return;

        coinsRef.current.set(symbol, {
            ...existing,
            lastPrice: e.c,
            priceChangePercent: e.P,
            quoteVolume: e.q,
        });
    }, []);
    useEffect(
        function () {
            if (!socket) return;
            // const symbols = symbolsRef.current;

            const symbols = data.map((c) => c.symbol);
            socket.subscribeTicker(symbols);
            socket.addTickerHandler(onTickerData);
            return () => {
                socket.unsubscribeTicker(symbols);
                socket.removeTickerHandler(onTickerData);
            };
        },
        [data, socket, onTickerData],
    );
    useEffect(() => {
        coinsRef.current = createCoinsMap(data);
        setFinalData(data);
    }, [data]);
    useEffect(() => {
        const interval = setInterval(() => {
            const coinsArray = Array.from(coinsRef.current.values());
            setFinalData(coinsArray);
        }, 250);

        return () => clearInterval(interval);
    }, [data]);
    const tableRowRenderFn = (c: Ticker) => {
        const price = formatPrice(c.lastPrice);
        const percent = Number(c.priceChangePercent);
        return (
            <Table.Row key={c.symbol}>
                <div>
                    <CoinIcon symbol={c.symbol} />
                </div>
                <div className="font-bold">{c.symbol}</div>
                <div className="font-bold">{`$${price.toLocaleString()}`}</div>

                <div
                    className={`font-bold ${percent >= 0 ? 'text-green-500' : 'text-red-500'}`}
                >{`${percent.toFixed(2)}%`}</div>

                {isEditable && (
                    <button
                        className="px-2 py-1 text-xs md:text-sm  text-gray-400 hover:text-red-500 transition cursor-pointer"
                        onClick={() => removeSymbol(c.symbol)}
                    >
                        Remove
                    </button>
                )}
            </Table.Row>
        );
    };

    return (
        <Table columns="1fr 2fr 1fr 1fr 1fr" label={'Watchlist'} scroll={true}>
            <Table.Header>
                <div></div>
                <div>Symbol</div>
                <div>Price</div>
                <div>{'24h %'}</div>
                {isEditable && <div></div>}
                <div></div>
            </Table.Header>
            {data && <Table.Body data={finalData} render={tableRowRenderFn} />}
        </Table>
    );
}
