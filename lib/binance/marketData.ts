import { AppConfig } from '@/app-config';
import {
    BinanceKline,
    CandlestickDataResponse,
    CandleType,
    TimeFrameType,
} from '@/shared/types/common';
import { convertTimeframe } from '../aggregation';

interface FetchProp {
    symbol: string;
    interval: TimeFrameType;
    limit?: number;
    endTime?: string | number;
}

function normalizeTimestamp(ts: number | string | null) {
    if (!ts) return;
    const num = Number(ts);

    if (num > 1e12) {
        return num; // already ms
    }

    return num * 1000; // convert seconds → ms
}
function getEndTime(time: string | number | null): number {
    const nor_timestamp = normalizeTimestamp(time);
    if (nor_timestamp) {
        return nor_timestamp - 1; // Number(time) * 1000 candle present on the chart. we need to fetch the data from it's previous so we will add -1
    }
    return Date.now();
}
async function fetchCandlestickData({
    symbol,
    interval,
    limit = 1000,
    endTime = '',
}: FetchProp): Promise<CandlestickDataResponse> {
    let lastTime = getEndTime(endTime);
    const candles: CandleType[] = [];
    const MAX_REQUESTS = 10;
    let requestCount = 0;

    while (candles.length < 1000 && requestCount < MAX_REQUESTS) {
        requestCount++;

        try {
            const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}&endTime=${lastTime}`;

            const res = await fetch(url);

            if (!res.ok) {
                console.error(`Binance API error: ${res.status}`);
                break;
            }

            const data: BinanceKline[] = await res.json();

            if (data.length === 0) break;

            lastTime = data[0][0] - 1;

            const filterData: CandleType[] = data
                .filter((k) => k[8] > 0)
                .map((k) => ({
                    time: Math.floor(k[0]),
                    open: Number(k[1]),
                    high: Number(k[2]),
                    low: Number(k[3]),
                    close: Number(k[4]),
                    volume: Number(k[5]),
                }));

            candles.unshift(...filterData);
        } catch (err) {
            console.error('Error fetching candles:', err);
            break;
        }
    }

    const formattedCandles: CandleType[] = candles.map((k) => ({
        time: Math.floor(k.time / 1000),
        open: k.open,
        high: k.high,
        low: k.low,
        close: k.close,
        volume: k.volume,
    }));

    const finalData =
        formattedCandles.length > 100
            ? formattedCandles.slice(100)
            : formattedCandles;

    const cacheData =
        formattedCandles.length > 100 ? formattedCandles.slice(0, 100) : [];
    return {
        finalData,
        cacheData,
        tempData: [],
    };
}

async function fetchAggCandlestickData({
    symbol,
    interval,
    limit = 1000,
    endTime = '',
}: FetchProp): Promise<CandlestickDataResponse | null> {
    let lastTime = getEndTime(endTime);
    const candles: CandleType[] = [];
    const MAX_REQUESTS = 10;
    let requestCount = 0;
    const validTargetInterval = AppConfig.isValidInterval(interval)
        ? interval
        : null;
    const sourceInterval = AppConfig.getSourceInterval(validTargetInterval);
    if (!symbol || !sourceInterval || !interval) {
        return null;
    }
    while (candles.length <= 4000 && requestCount < MAX_REQUESTS) {
        requestCount++;
        try {
            const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${sourceInterval}&limit=${limit}&endTime=${lastTime}`;

            const res = await fetch(url);

            if (!res.ok) {
                console.error(`Binance API error: ${res.status}`);
                break;
            }

            const data: BinanceKline[] = await res.json();

            if (data.length === 0) break;

            lastTime = data[0][0] - 1;

            const filterData: CandleType[] = data
                .filter((k) => k[8] > 0)
                .map((k) => ({
                    time: Math.floor(k[0]),
                    open: Number(k[1]),
                    high: Number(k[2]),
                    low: Number(k[3]),
                    close: Number(k[4]),
                    volume: Number(k[5]),
                }));

            candles.unshift(...filterData);
        } catch (err) {
            console.error('Error fetching candles:', err);
            break;
        }
    }
    if (endTime === '') {
        // Fetch the most recent candles again to ensure we didn't miss any updates
        // while loading historical data (prevents gaps or stale tail candles).
        const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${sourceInterval}&limit=${50}`;
        const res = await fetch(url);

        if (!res.ok) {
            console.error(`Binance API error: ${res.status}`);
        }

        const data: BinanceKline[] = await res.json();
        const filterData: CandleType[] = data
            .filter((k) => k[8] > 0)
            .map((k) => ({
                time: Math.floor(k[0]),
                open: Number(k[1]),
                high: Number(k[2]),
                low: Number(k[3]),
                close: Number(k[4]),
                volume: Number(k[5]),
            }));

        const lastTime = candles.at(-1)?.time;
        if (lastTime) {
            const newCandles = filterData.filter((c) => c.time > lastTime);
            candles.push(...newCandles);
        }
    }
    const aggData = convertTimeframe(candles, validTargetInterval);
    const formattedCandles: CandleType[] = aggData.map((k) => ({
        time: Math.floor(k.time / 1000), //converts milliseconds in seconds
        open: k.open,
        high: k.high,
        low: k.low,
        close: k.close,
        volume: k.volume,
    }));
    const finalData =
        formattedCandles.length > 100
            ? formattedCandles.slice(100, formattedCandles.length)
            : formattedCandles;
    const cacheData =
        formattedCandles.length > 100 ? formattedCandles.slice(0, 100) : [];
    return {
        finalData,
        cacheData,
        tempData: candles,
    };
}
export { fetchCandlestickData, fetchAggCandlestickData };
