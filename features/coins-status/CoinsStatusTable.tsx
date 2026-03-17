'use client';
import { BinanceTickerEvent } from '@/lib/binance/BinanceSocket';
import CoinIcon from '@/shared/components/ui/CoinIcon';
import Table from '@/shared/components/ui/Table';
import { useBinanceSocket } from '@/shared/providers/binance-socket-provider';
import { Ticker } from '@/shared/types/common';
import { useCallback, useEffect, useRef, useState } from 'react';
type CoinsStatusTableProps = {
    label: string;
    topCoins: Ticker[];
    typeOfTable?: string;
};
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
export default function CoinsStatusTable({
    label,
    topCoins,
    typeOfTable = 'topGainers',
}: CoinsStatusTableProps) {
    const coinsRef = useRef(createCoinsMap(topCoins));
    const symbolsRef = useRef(topCoins.map((coin) => coin.symbol));
    const [sortedCoins, setSortedCoins] = useState(topCoins);
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
            const symbols = symbolsRef.current;
            socket.subscribeTicker(symbols);
            socket.addTickerHandler(onTickerData);
            return () => {
                socket.unsubscribeTicker(symbols);
                socket.removeTickerHandler(onTickerData);
            };
        },
        [topCoins, socket, onTickerData],
    );
    useEffect(() => {
        const interval = setInterval(() => {
            const coinsArray = Array.from(coinsRef.current.values());

            let sorted: Ticker[] = [];
            if (typeOfTable === 'topGainers') {
                sorted = [...coinsArray].sort(
                    (a, b) =>
                        Number(b.priceChangePercent) -
                        Number(a.priceChangePercent),
                );
            }
            if (typeOfTable === 'topLosers') {
                sorted = [...coinsArray].sort(
                    (a, b) =>
                        Number(a.priceChangePercent) -
                        Number(b.priceChangePercent),
                );
            }
            if (typeOfTable === 'topVolumes') {
                sorted = [...coinsArray].sort(
                    (a, b) => Number(b.quoteVolume) - Number(a.quoteVolume),
                );
            }
            if (typeOfTable === 'topHotCoins') {
                sorted = [...coinsArray].sort(
                    (a, b) =>
                        Number(b.priceChangePercent) -
                        Number(a.priceChangePercent),
                );
            }
            setSortedCoins(sorted);
        }, 1000);

        return () => clearInterval(interval);
    }, [typeOfTable]);
    return (
        <Table columns="1fr 2fr 1fr 1fr" label={label}>
            <Table.Header>
                <div></div>
                <div>Symbol</div>
                <div>Price</div>
                <div>{typeOfTable === 'topVolumes' ? 'volume' : '24h %'}</div>
            </Table.Header>
            {sortedCoins.map((c) => {
                const price = formatPrice(c.lastPrice);
                const percent = Number(c.priceChangePercent);
                const volume = Number(c.quoteVolume);
                return (
                    <Table.Row key={c.symbol}>
                        <div>
                            <CoinIcon symbol={c.symbol} />
                        </div>
                        <div className="font-bold">{c.symbol}</div>
                        <div className="font-bold">{`$${price.toLocaleString()}`}</div>
                        {typeOfTable === 'topVolumes' ? (
                            <div className="font-bold text-green-500">{`${volume.toFixed(2)}`}</div>
                        ) : (
                            <div
                                className={`font-bold ${percent >= 0 ? 'text-green-500' : 'text-red-500'}`}
                            >{`${percent.toFixed(2)}%`}</div>
                        )}
                    </Table.Row>
                );
            })}
            {/* <Table.Body data={sortedCoins} render={renderRow}></Table.Body> */}
        </Table>
    );
}
