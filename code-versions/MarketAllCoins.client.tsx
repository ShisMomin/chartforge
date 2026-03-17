'use client';
import { Ticker } from '@/shared/types/common';
import { useCallback, useEffect, useRef, useState } from 'react';
import FilterSection from './FilterSection';
import AllCoinsTable from './AllCoinsTable';
import { BinanceTickerEvent } from '@/lib/binance/BinanceSocket';
import { useBinanceSocket } from '@/shared/providers/binance-socket-provider';

interface Props {
    initialData: Ticker[];
    activeQuoteCurrencies: string[];
}
// const orderValues = {
//     lastPrice: 'Price',
//     priceChangePercent: '24h Change',
//     priceChange: 'Price Change',
//     quoteVolume: '24h Volume',
// };
// const orderValues = {
//     Price: 'lastPrice',
//     '24hChange': 'priceChangePercent',
//     'Price Change': 'priceChange',
//     '24h Volume': 'quoteVolume',
// };
type OrderKey = keyof Ticker;
export const orderValues = {
    price: { label: 'Price', value: 'lastPrice' },
    change24h: { label: '24h Change', value: 'priceChangePercent' },
    priceChange: { label: 'Price Change', value: 'priceChange' },
    volume24h: { label: '24h Volume', value: 'quoteVolume' },
} as const;

function createCoinsMap<T extends Ticker>(coins: T[]) {
    return new Map(coins.map((coin) => [coin.symbol, coin]));
}
export default function MarketAllCoinsClient({
    initialData,
    activeQuoteCurrencies,
}: Props) {
    const coinsRef = useRef(createCoinsMap(initialData));
    // const symbolsRef = useRef(initialData.map((coin) => coin.symbol));
    const { socket } = useBinanceSocket();
    const [quoteCurrency, setQuoteCurrency] = useState('All');
    const [sortOrderType, setSortOrderType] = useState('DESC');
    const [orderValue, setOrderValue] = useState<OrderKey>('lastPrice');
    const [orderLable, setOrderLable] = useState('Price');
    const [finalCoinsList, setFinalCoinsList] = useState(initialData);
    const onTickerData = useCallback(function (
        allSymbolTick: BinanceTickerEvent[],
    ) {
        for (const tick of allSymbolTick) {
            const symbol = tick.s;
            const existing = coinsRef.current.get(symbol);
            if (!existing) break;
            coinsRef.current.set(symbol, {
                ...existing,
                lastPrice: tick.c,
                priceChangePercent: tick.P,
                priceChange: tick.p,
                quoteVolume: tick.q,
            });
        }
    }, []);

    function handleQuoteCurrency(item: string) {
        setQuoteCurrency(item);
    }
    function handleSortOrderType(value: string) {
        setSortOrderType(value);
    }
    // function handleSortOrderValues(value: string) {
    //     const orderObjects = Object.values(orderValues);
    //     for (const orderObject of orderObjects) {
    //         if (orderObject.label === value) {
    //             setOrderValue(orderObject.value);
    //             setOrderLable(value);
    //         }
    //     }
    //     // setOrderValue();
    // }

    function handleSortOrderValues(value: string) {
        const entry = Object.values(orderValues).find((o) => o.label === value);

        if (!entry) return;

        setOrderValue(entry.value);
        setOrderLable(entry.label);
    }

    useEffect(
        function () {
            if (!socket) return;
            // const symbols = symbolsRef.current;
            // console.log(symbols);
            // socket.subscribeTicker(symbols);
            socket.subscribeAllTicker();

            socket.addAllTickerHandler(onTickerData);
            return () => {
                // socket.unsubscribeTicker(symbols);
                socket.unsubscribeAllTicker();
                socket.removeAllTickerHandler(onTickerData);
            };
        },
        [socket, onTickerData],
    );
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         let list = Array.from(coinsRef.current.values());

    //         if (quoteCurrency !== 'All') {
    //             list = list.filter((t) => t.symbol.endsWith(quoteCurrency));
    //         }
    //         const sorted: Ticker[] = [...list].sort((a, b) =>
    //             sortOrderType === 'ASC'
    //                 ? Number(a[orderValue]) - Number(b[orderValue])
    //                 : Number(b[orderValue]) - Number(a[orderValue]),
    //         );
    //         setFinalCoinsList(sorted);
    //     }, 1000);

    //     return () => clearInterval(interval);
    // }, [sortOrderType, orderValue, quoteCurrency]);
    useEffect(() => {
        const interval = setInterval(() => {
            let list = Array.from(coinsRef.current.values());

            if (quoteCurrency !== 'All') {
                list = list.filter((t) => t.symbol.endsWith(quoteCurrency));
            }

            const sorted: Ticker[] = [...list].sort((a, b) =>
                sortOrderType === 'ASC'
                    ? Number(a[orderValue]) - Number(b[orderValue])
                    : Number(b[orderValue]) - Number(a[orderValue]),
            );

            setFinalCoinsList((prev) => {
                const same =
                    prev.length === sorted.length &&
                    prev.every((c, i) => c.symbol === sorted[i].symbol);

                return same ? prev : sorted;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [sortOrderType, orderValue, quoteCurrency]);

    return (
        <div className="h-full w-full flex flex-col gap-2">
            <FilterSection
                activeQuoteCurrencies={activeQuoteCurrencies}
                quoteCurrency={quoteCurrency}
                handleQuoteCurrency={handleQuoteCurrency}
                sortOrderType={sortOrderType}
                handleSortOrderType={handleSortOrderType}
                activeOrderValueLable={orderLable}
                sortOrderValues={Object.values(orderValues).map((o) => o.label)}
                handleSortOrderValues={handleSortOrderValues}
            />
            <AllCoinsTable coinsInfoList={finalCoinsList} />
        </div>
    );
}

// return (
//     <div className="h-full">
//         <div className="flext p-4">
//             <div className="relative">
//                 <button
//                     className="px-2 py-1 bg-card border border-panel-border rounded-md text-sm"
//                     onClick={() => setQuoteOpen((pre) => !pre)}
//                 >
//                     {quoteCurrency} ▼
//                 </button>

//                 {quoteOpen && (
//                     <div
//                         className={` absolute mt-2 w-40 bg-card border border-panel-border rounded-md shadow-lg z-40 transform transition-all duration-200 ease-out ${quoteOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
//                     >
//                         <div className="max-h-60 overflow-auto">
//                             {activeQuoteCurrencies.map((currency) => (
//                                 <div
//                                     key={currency}
//                                     onClick={() => setQuoteCurrency(currency)}
//                                     className={`px-3 py-2  cursor-pointer ${currency === quoteCurrency ? 'bg-active' : 'hover:bg-hover'}`}
//                                 >
//                                     {currency}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//         <Table columns="1fr 1fr 1fr 1fr 1fr" scroll={true}>
//             <Table.Header>
//                 <div></div>
//                 <div>Symbol</div>
//                 <div>Price</div>
//                 <div>24h %</div>
//                 <div>volume</div>
//             </Table.Header>
//             <Table.Body data={usdt_pairs} render={renderRow}></Table.Body>
//             {/* {usdt_pairs.map((c) => {
//                     const price = formatPrice(c.lastPrice);
//                     const percent = formatPrice(Number(c.priceChangePercent));
//                     const volume = formatPrice(Number(c.quoteVolume));
//                     return (
//                         <Table.Row key={c.symbol}>
//                             <div>
//                                 <CoinIcon symbol={c.symbol} />
//                             </div>

//                             <div>{c.symbol}</div>
//                             <div>{`$${price}`}</div>
//                             <div>{`$${percent}`}</div>
//                             <div>{`$${volume}`}</div>
//                         </Table.Row>
//                     );
//                 })} */}
//         </Table>
//     </div>
// );
{
    /* <label htmlFor="quote">Quote Asset</label>
                    <select
                        className=" appearance-none bg-card bord border-panel-border text-sm px-3 py-2 pr-5 rounded-md cursor-pointer transition hover:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        id="quote"
                        name="quote"
                    >
                        {activeQuoteCurrencies.map((currency) => {
                            return (
                                <option
                                    className="cursor-pointer hover:bg-hover"
                                    key={currency}
                                    value={currency}
                                >
                                    {currency}
                                </option>
                            );
                        })}
                    </select> */
}
