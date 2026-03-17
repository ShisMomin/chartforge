'use client';
import { MagnifyingGlassIcon } from '@heroicons/react/16/solid';
import Modal from './Modal';
import { ReactElement, useEffect, useMemo, useState } from 'react';
import Spinner from './Spinner';
import { useStore } from '@/store/store';
import { selectSyncSymbolAndIndicator } from '@/store/selectors/chartDataSelectors';
import { useShallow } from 'zustand/shallow';
import CoinIcon from './CoinIcon';
import Link from 'next/link';
import { Ticker } from '@/shared/types/common';
import { StarIcon } from '@heroicons/react/24/solid';
type SymbolList = {
    symbol: string;
    base: string;
    quote: string;
}[];
type BinanceSymbol = {
    symbol: string;
    status: string;
    baseAsset: string;
    quoteAsset: string;
};
type ExchangeInfoResponse = {
    symbols: BinanceSymbol[];
};
type SearchSymProps = {
    onCloseModal?: () => void;
    isRedirect: boolean;
    watchlist: boolean;
    watchlistAddFn?: (symbol: string) => void;
    watchlistData: Ticker[];
};
function SearchSym({
    onCloseModal,
    isRedirect = false,
    watchlist,
    watchlistAddFn,
    watchlistData,
}: SearchSymProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [symbols, setSymbols] = useState<SymbolList>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { setActiveChartSymbol, setAllChartsSymbol } = useStore();
    const { syncSymbol } = useStore(useShallow(selectSyncSymbolAndIndicator));
    useEffect(function () {
        const abortController = new AbortController();
        async function loadData() {
            try {
                setIsLoading(true);
                const response = await fetch(
                    'https://api.binance.com/api/v3/exchangeInfo',
                    {
                        signal: abortController.signal,
                    },
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch exchange info');
                }
                const data: ExchangeInfoResponse = await response.json();
                const pairs = data.symbols
                    .filter((s) => s.status === 'TRADING')
                    .map((s) => ({
                        symbol: s.symbol,
                        base: s.baseAsset,
                        quote: s.quoteAsset,
                    }));
                setSymbols(pairs);
                setIsLoading(false);
            } catch (error) {
                if (
                    error instanceof DOMException &&
                    error.name === 'AbortError'
                ) {
                    return;
                }
                console.error('Error fetching symbols:', error);
            }
        }
        loadData();
        return () => {
            abortController.abort();
        };
    }, []);

    const filteredSymbols = useMemo(() => {
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            return symbols
                .filter(
                    (s) =>
                        s.symbol.toLowerCase().includes(lower) ||
                        s.base.toLowerCase().includes(lower),
                )
                .slice(0, 50);
        }
        return symbols.slice(0, 50);
    }, [searchTerm, symbols]);

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Search Header */}
            <div className="flex items-center px-4 md:px-6 py-3 border-b border-search">
                <div className="flex items-center gap-2 flex-1 h-10 px-3 rounded-md bg-search border border-transparent focus-within:border-blue-500 transition max-w-130">
                    <MagnifyingGlassIcon className="h-5 w-5 text-muted-foreground" />

                    <input
                        type="text"
                        placeholder="Search symbol..."
                        className="flex-1 bg-transparent outline-none text-sm"
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value.toUpperCase())
                        }
                    />
                </div>
            </div>

            {isLoading ? (
                <Spinner />
            ) : (
                <>
                    {/* Table Header */}
                    <div className="flex items-center px-4 md:px-6 py-2 text-xs font-medium uppercase border-b border-search text-muted-foreground">
                        <span className="flex-1">Symbol</span>

                        {/* Hide description on small screens */}
                        {!watchlist ? (
                            <>
                                <span className="flex-1 hidden md:block">
                                    Description
                                </span>

                                <span className="w-24 text-right">
                                    Exchange
                                </span>
                            </>
                        ) : (
                            <span className="w-24 text-right">status</span>
                        )}
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredSymbols.map((s) => {
                            const isInWatchlist = watchlistData?.some(
                                (coin) => coin.symbol === s.symbol,
                            );
                            return isRedirect ? (
                                <Link
                                    key={s.symbol}
                                    className="flex items-center px-4 md:px-6 py-3 border-b border-search hover:bg-hover cursor-pointer transition"
                                    href={`/chart/4/${s.symbol}`}
                                >
                                    {/* Symbol */}
                                    <div className="flex-1 font-medium flex gap-2">
                                        <span>
                                            <CoinIcon symbol={s.symbol} />
                                        </span>
                                        <span>{s.base}</span>
                                        <span className="text-primary ml-1">
                                            {s.quote}
                                        </span>
                                    </div>

                                    {!watchlist ? (
                                        <>
                                            {/* Description */}
                                            <div className="flex-1 text-muted-foreground text-sm hidden md:block">
                                                {s.base} / {s.quote}
                                            </div>

                                            {/* Exchange */}
                                            <div className="w-24 text-right text-sm text-muted-foreground">
                                                BINANCE
                                            </div>
                                        </>
                                    ) : (
                                        <button
                                            disabled={isInWatchlist}
                                            className={`p-2 transition ${
                                                isInWatchlist
                                                    ? 'text-yellow-400 cursor-not-allowed'
                                                    : 'text-gray-400 hover:text-yellow-400'
                                            }`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (!isInWatchlist) {
                                                    watchlistAddFn?.(s.symbol);
                                                }
                                            }}
                                        >
                                            <StarIcon className="w-6 h-6" />
                                        </button>
                                    )}
                                </Link>
                            ) : (
                                <div
                                    key={s.symbol}
                                    onClick={() => {
                                        onCloseModal?.();
                                        if (!syncSymbol) {
                                            setActiveChartSymbol(s.symbol);
                                        } else {
                                            setAllChartsSymbol(s.symbol);
                                        }
                                    }}
                                    className="flex items-center px-4 md:px-6 py-3 border-b border-search hover:bg-hover cursor-pointer transition"
                                >
                                    {/* Symbol */}
                                    <div className="flex-1 font-medium flex gap-2">
                                        <span>
                                            <CoinIcon symbol={s.symbol} />
                                        </span>
                                        <span>{s.base}</span>
                                        <span className="text-primary ml-1">
                                            {s.quote}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <div className="flex-1 text-muted-foreground text-sm hidden md:block">
                                        {s.base} / {s.quote}
                                    </div>

                                    {/* Exchange */}
                                    <div className="w-24 text-right text-sm text-muted-foreground">
                                        BINANCE
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}

//  {isLoading ? (
//                 <Spinner />
//             ) : (
//                 <>
//                     {/* {list header } */}
//                     <div className="flex py-2 px-4 border-b-2 border-t-2 border-search ">
//                         <span className="flex-1">Symbol</span>
//                         <span className="flex-1">Description</span>
//                         <span className="w-20 text-right">Exchange</span>
//                     </div>

//                     <div className="flex-1 overflow-y-auto">
//                         {filteredSymbols.map((s) => (
//                             <div
//                                 className="flex items-center px-4 py-2 border-b border-search hover:bg-hover cursor-pointer"
//                                 key={s.symbol}
//                                 onClick={() => onCloseModal?.()}
//                             >
//                                 <div className="flex-1 font-medium">
//                                     <span className="">{s.base}</span>
//                                     <span className="text-primary-400 ml-1">
//                                         {s.quote}
//                                     </span>
//                                 </div>
//                                 <div className="flex-1 text-primary-400 font-[13px]">
//                                     {s.base} / {s.quote}
//                                 </div>
//                                 <div className="w-20 text-right">BINANCE</div>
//                             </div>
//                         ))}
//                     </div>
//                 </>
//             )}

//   <div className="flex items-center px-4 py-2 border-b border-search hover:bg-hover">
//                             <div className="flex-1 font-medium">
//                                 <span className="">BTC</span>
//                                 <span className="text-primary-400 ml-1">
//                                     USDT
//                                 </span>
//                             </div>
//                             <div className="flex-1 text-primary-400 font-[13px]">
//                                 BTC / USDT
//                             </div>
//                             <div className="w-20 text-right">BINANCE</div>
//                         </div>
export default function SearchSymbol({
    children,
    isRedirect = false,
    watchlist = false,
    watchlistAddFn,
    watchlistData = [],
}: {
    children: ReactElement<{ onClick: () => void }>;
    isRedirect?: boolean;
    watchlist?: boolean;
    watchlistAddFn?: (symbol: string) => void;
    watchlistData?: Ticker[];
}) {
    return (
        <Modal>
            <Modal.Open opens="search">{children}</Modal.Open>
            <Modal.Window name="search">
                <SearchSym
                    isRedirect={isRedirect}
                    watchlist={watchlist}
                    watchlistAddFn={watchlistAddFn}
                    watchlistData={watchlistData}
                />
            </Modal.Window>
        </Modal>
    );
}
