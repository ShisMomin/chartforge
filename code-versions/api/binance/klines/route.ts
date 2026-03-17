import { canCallBinance } from '@/lib/binance-limiter';
import { BinanceKline, CandleType } from '@/shared/types/common';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

function normalizeTimestamp(ts: number | string | null) {
    if (!ts) return;
    const num = Number(ts);

    if (num > 1e12) {
        return num; // already ms
    }

    return num * 1000; // convert seconds → ms
}

function getEndTime(time: string | null): number {
    const nor_timestamp = normalizeTimestamp(time);
    if (nor_timestamp) {
        return nor_timestamp - 1; // Number(time) * 1000 candle present on the chart. we need to fetch the data from it's previous so we will add -1
    }
    return Date.now();
}
const BINANCE_BASE_URL = process.env.BINANCE_REST_BASE_URL;

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get('symbol');
    const interval = searchParams.get('interval');
    const limit = searchParams.get('limit') ?? '1000';
    const endTime = getEndTime(searchParams.get('endTime'));
    // console.log(searchParams.get('endTime'));
    console.log(new Date(endTime));
    if (!symbol || !interval) {
        return NextResponse.json(
            { error: 'symbol and interval are required' },
            { status: 400 },
        );
    }

    const candles: CandleType[] = [];
    let lastTime = endTime;
    const MAX_REQUESTS = 10;
    let requestCount = 0;

    while (candles.length < 1000 && requestCount < MAX_REQUESTS) {
        requestCount++;

        try {
            const allowed = await canCallBinance();
            if (!allowed) {
                return NextResponse.json(
                    { error: 'Binance rate limit exceeded' },
                    { status: 429 },
                );
            }

            const url = `${BINANCE_BASE_URL}?symbol=${symbol}&interval=${interval}&limit=${limit}&endTime=${lastTime}`;

            const res = await fetch(url, {
                next: { revalidate: 0 },
            });

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

    return NextResponse.json({
        finalData,
        cacheData,
        tempData: [],
    });
}
// export async function GET(req: Request) {
//     const { searchParams } = new URL(req.url);
//     const symbol = searchParams.get('symbol');
//     const interval = searchParams.get('interval');
//     const limit = searchParams.get('limit') ?? '1000';
//     const endTime = getEndTime(searchParams.get('endTime'));
//     if (!symbol || !interval) {
//         return NextResponse.json(
//             { error: 'symbol and interval are required' },
//             { status: 400 },
//         );
//     }

//     const candles: CandleType[] = [];
//     let lastTime = endTime;
//     try {
//         while (candles.length <= 1000) {
//             const allowed = await canCallBinance();
//             if (!allowed) {
//                 return new Response(
//                     JSON.stringify({ error: 'Binance rate limit exceeded' }),
//                     { status: 429 },
//                 );
//             }
//             const url = `${BINANCE_BASE_URL}?symbol=${symbol}&interval=${interval}&limit=${limit}&endTime=${lastTime}`;
//             const res = await fetch(url, {
//                 next: { revalidate: 0 },
//             });
//             if (!res.ok) {
//                 return NextResponse.json(
//                     { error: 'Failed to fetch data from Binance' },
//                     { status: res.status },
//                 );
//             }
//             const data: BinanceKline[] = await res.json();
//             if (data.length <= 0) break;
//             lastTime = data[0][0] - 1;
//             const filterData: CandleType[] = data
//                 .filter((k) => k[8] > 0) // filter data based on number of trades
//                 .map((k) => ({
//                     time: Math.floor(k[0]),
//                     open: Number(k[1]),
//                     high: Number(k[2]),
//                     low: Number(k[3]),
//                     close: Number(k[4]),
//                     volume: Number(k[5]),
//                 }));
//             candles.unshift(...filterData);
//         }
//         const formattedCandles: CandleType[] = candles.map((k) => ({
//             time: Math.floor(k.time / 1000), //converts milliseconds in seconds
//             open: k.open,
//             high: k.high,
//             low: k.low,
//             close: k.close,
//             volume: k.volume,
//         }));
//         const finalData =
//             formattedCandles.length > 100
//                 ? formattedCandles.slice(100, formattedCandles.length)
//                 : formattedCandles;
//         const cacheData =
//             formattedCandles.length > 100 ? formattedCandles.slice(0, 100) : [];

//         return NextResponse.json({
//             finalData,
//             cacheData,
//         });
//     } catch (err) {
//         console.log(err);
//         return NextResponse.json(
//             { error: 'Internal server error' },
//             { status: 500 },
//         );
//     }
// }
// export async function GET(req: Request) {
//     const { searchParams } = new URL(req.url);

//     const symbol = searchParams.get('symbol');
//     const interval = searchParams.get('interval');
//     const limit = searchParams.get('limit') ?? '1000';
//     const endTime = getEndTime(searchParams.get('endTime'));
//     if (!symbol || !interval) {
//         return NextResponse.json(
//             { error: 'symbol and interval are required' },
//             { status: 400 },
//         );
//     }
//     const allowed = await canCallBinance();
//     if (!allowed) {
//         return new Response(
//             JSON.stringify({ error: 'Binance rate limit exceeded' }),
//             { status: 429 },
//         );
//     }
//     const url = `${BINANCE_BASE_URL}?symbol=${symbol}&interval=${interval}&limit=${limit}&endTime=${endTime}`;
//     try {
//         const res = await fetch(url, {
//             next: { revalidate: 0 },
//         });
//         if (!res.ok) {
//             return NextResponse.json(
//                 { error: 'Failed to fetch data from Binance' },
//                 { status: res.status },
//             );
//         }
//         const data: BinanceKline[] = await res.json();
//         const formattedCandles: CandleType[] = data
//             .filter((k) => k[8] > 0) // filter data based on number of trades
//             .map((k) => ({
//                 time: Math.floor(k[0] / 1000), //converts milliseconds in seconds
//                 open: Number(k[1]),
//                 high: Number(k[2]),
//                 low: Number(k[3]),
//                 close: Number(k[4]),
//                 volume: Number(k[5]),
//             }));
//         const finalData =
//             formattedCandles.length > 100
//                 ? formattedCandles.slice(100, formattedCandles.length)
//                 : formattedCandles;
//         const cacheData =
//             formattedCandles.length > 100 ? formattedCandles.slice(0, 100) : [];

//         return NextResponse.json({
//             finalData,
//             cacheData,
//         });
//     } catch (err) {
//         console.log(err);
//         return NextResponse.json(
//             { error: 'Internal server error' },
//             { status: 500 },
//         );
//     }
// }

/////////////////////////////////////////////////////////////////////////
//    const timestamp = Date.now();
//     const date = new Date(timestamp);
//     console.log(date);
//     const res = await fetch(`https://api.binance.com/api/v3/time`, {
//         next: { revalidate: 0 },
//     });
//     const { serverTime } = await res.json();
//     const dat2 = new Date(serverTime);
//     console.log(dat2);
//     console.log(serverTime);
