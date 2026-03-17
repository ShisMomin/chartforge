import { ChartLayout } from '@/schemas';

export type TimeFrameType =
    | '1s'
    | '5s'
    | '10s'
    | '15s'
    | '30s'
    | '1m'
    | '2m'
    | '3m'
    | '5m'
    | '10m'
    | '15m'
    | '30m'
    | '45m'
    | '1h'
    | '2h'
    | '3h'
    | '4h'
    | '8h'
    | '12h'
    | '1d'
    | '2d'
    | '3d'
    | '1w'
    | '2w'
    | '1M';

// export type Intervals = string[];
export type TimeFrame = {
    label: string;
    value: TimeFrameType;
    type: 'Seconds' | 'Minutes' | 'Hours' | 'Days';
};
export type TimeFrames = TimeFrame[];
export type Indicators = string[];
export type Layout = {
    label: string;
    rows: number;
    cols: number;
};

type WithId<T> = T & { id: number };
export type ChartGrid = WithId<Pick<ChartLayout, 'numRows' | 'numCols'>>;
export type BinanceKline = [
    number, // open time
    string, // open
    string, // high
    string, // low
    string, // close
    string, // volume
    number, // close time
    string, // quote asset volume
    number, // number of trades
    string, // taker buy base asset volume
    string, // taker buy quote asset volume
    string, // ignore
];

export type CandleType = {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
};

export type CandlestickDataResponse = {
    finalData: CandleType[];
    cacheData: CandleType[];
    tempData: CandleType[];
};
export interface Ticker {
    symbol: string;
    lastPrice: string;
    priceChange: string;
    priceChangePercent: string;
    quoteVolume: string;
}
type BinanceSymbol = {
    symbol: string;
    status: string;
    baseAsset: string;
    quoteAsset: string;
};

export interface ExchangeInfoResponse {
    symbols: BinanceSymbol[];
}
