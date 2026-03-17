import { CandleType, TimeFrameType } from '@/shared/types/common';
// import { CandlestickData, Time } from 'lightweight-charts';

type Twf = Record<TimeFrameType, number>;
const tfw: Twf = {
    '1s': 1 * 1000,
    '5s': 5 * 1000,
    '10s': 10 * 1000,
    '15s': 15 * 1000,
    '30s': 30 * 1000,
    '1m': 1 * 60 * 1000,
    '2m': 2 * 60 * 1000,
    '3m': 3 * 60 * 1000,
    '5m': 5 * 60 * 1000,
    '10m': 10 * 60 * 1000,
    '15m': 15 * 60 * 1000,
    '30m': 30 * 60 * 1000,
    '45m': 45 * 60 * 1000,
    '1h': 1 * 60 * 60 * 1000,
    '2h': 2 * 60 * 60 * 1000,
    '3h': 3 * 60 * 60 * 1000,
    '4h': 4 * 60 * 60 * 1000,
    '8h': 8 * 60 * 60 * 1000,
    '12h': 12 * 60 * 60 * 1000,
    '1d': 1 * 24 * 60 * 60 * 1000,
    '2d': 2 * 24 * 60 * 60 * 1000,
    '3d': 3 * 24 * 60 * 60 * 1000,
    '1w': 7 * 24 * 60 * 60 * 1000,
    '2w': 2 * 7 * 24 * 60 * 60 * 1000,
    '1M': 30 * 24 * 60 * 60 * 1000,
};

// type TimeFrameType = keyof typeof tfw;
const getAlignedTime = (timestamp: number, timeframe: TimeFrameType) => {
    const interval = tfw[timeframe];
    if (!interval) throw new Error(`Unsupported timeframe: ${timeframe}`);

    const date = new Date(timestamp);
    const year = date.getUTCFullYear();
    const yearStart = Date.UTC(year, 0, 1);
    switch (timeframe) {
        case '2d':
            // Calculate days since year start
            const daysSinceYearStart = Math.floor(
                (timestamp - yearStart) / tfw['1d'],
            );
            // 2d alignment (groups days 0-1, 2-3, etc.)
            const twoDayGroup = Math.floor(daysSinceYearStart / 2);
            return yearStart + twoDayGroup * tfw['2d'];

        case '2w':
            // Calculate weeks since year start
            const weeksSinceYearStart = Math.floor(
                (timestamp - yearStart) / tfw['1w'],
            );
            const twoWeekGroup = Math.floor(weeksSinceYearStart / 2);
            return yearStart + twoWeekGroup * tfw['2w'];

        default:
            return Math.floor(timestamp / tfw[timeframe]) * tfw[timeframe];
    }
};

export const convertTimeframe = (
    candles: CandleType[],
    targetTimeframe: TimeFrameType | null,
) => {
    if (!targetTimeframe) return candles;
    const result: CandleType[] = [];
    const currentKline: Partial<CandleType> = {};

    // Find first aligned candle
    const index = candles.findIndex(
        (candle) =>
            getAlignedTime(candle.time, targetTimeframe) === candle.time,
    );
    const newCandles = candles.slice(index === -1 ? 0 : index);

    for (let i = 0; i < newCandles.length; i++) {
        if (i === 0) {
            currentKline.time = getAlignedTime(
                newCandles[i].time,
                targetTimeframe,
            );
            currentKline.open = newCandles[i].open;
            currentKline.high = newCandles[i].high;
            currentKline.low = newCandles[i].low;
            currentKline.close = newCandles[i].close;
            currentKline.volume = newCandles[i].volume;
            continue;
        }

        if (newCandles[i].time < currentKline.time! + tfw[targetTimeframe]) {
            // Update the current candle values
            currentKline.high = Math.max(
                currentKline.high!,
                newCandles[i].high,
            );
            currentKline.low = Math.min(currentKline.low!, newCandles[i].low);
            currentKline.close = newCandles[i].close;
            currentKline.volume! += newCandles[i].volume; // Fixed: was candles[i]
            continue;
        }

        // When a new timeframe starts
        if (newCandles[i].time >= currentKline.time! + tfw[targetTimeframe]) {
            result.push({ ...currentKline } as CandleType);
            currentKline.time = getAlignedTime(
                newCandles[i].time,
                targetTimeframe,
            );
            currentKline.open = newCandles[i].open;
            currentKline.high = newCandles[i].high;
            currentKline.low = newCandles[i].low;
            currentKline.close = newCandles[i].close;
            currentKline.volume = newCandles[i].volume;
        }
    }

    // Push the last candle after the loop ends
    if (Object.keys(currentKline).length > 0) {
        result.push({ ...currentKline } as CandleType);
    }

    return result;
};

export const convertTimeframeLive = (
    candles: CandleType[],
    targetTimeframe: TimeFrameType | null,
): CandleType | null => {
    const len = candles.length;
    if (!targetTimeframe || len <= 0) return null;

    const result: CandleType[] = [];
    const currentKline: Partial<CandleType> = {};

    // Find first aligned candle
    const index = candles.findIndex(
        (candle) =>
            getAlignedTime(candle.time, targetTimeframe) === candle.time,
    );
    const newCandles = candles.slice(index === -1 ? 0 : index);

    for (let i = 0; i < newCandles.length; i++) {
        if (i === 0) {
            currentKline.time = getAlignedTime(
                newCandles[i].time,
                targetTimeframe,
            );
            currentKline.open = newCandles[i].open;
            currentKline.high = newCandles[i].high;
            currentKline.low = newCandles[i].low;
            currentKline.close = newCandles[i].close;
            currentKline.volume = newCandles[i].volume;
            continue;
        }

        if (newCandles[i].time < currentKline.time! + tfw[targetTimeframe]) {
            // Update the current candle values
            currentKline.high = Math.max(
                currentKline.high!,
                newCandles[i].high,
            );
            currentKline.low = Math.min(currentKline.low!, newCandles[i].low);
            currentKline.close = newCandles[i].close;
            currentKline.volume! += newCandles[i].volume; // Fixed: was candles[i]
            continue;
        }

        // When a new timeframe starts
        if (newCandles[i].time >= currentKline.time! + tfw[targetTimeframe]) {
            result.push({ ...currentKline } as CandleType);
            currentKline.time = getAlignedTime(
                newCandles[i].time,
                targetTimeframe,
            );
            currentKline.open = newCandles[i].open;
            currentKline.high = newCandles[i].high;
            currentKline.low = newCandles[i].low;
            currentKline.close = newCandles[i].close;
            currentKline.volume = newCandles[i].volume;
        }
    }
    if (Object.keys(currentKline).length > 0 && currentKline.time) {
        return {
            time: Math.floor(currentKline.time / 1000),
            open: currentKline.open ?? 0,
            high: currentKline.high ?? 0,
            low: currentKline.low ?? 0,
            close: currentKline.close ?? 0,
            volume: currentKline.volume ?? 0,
        };
    }
    return null;
};

// export const convertTimeframeLive = (
//     candles: CandleType[],
//     targetTimeframe: TimeFrameType | null,
// ): CandlestickData | null => {
//     const len = candles.length;
//     if (!targetTimeframe || len <= 0) return null;
//     const currentKline: Partial<CandleType> = {};

//     const alignedTime = getAlignedTime(candles[len - 1].time, targetTimeframe);
//     console.log(new Date(alignedTime));
//     console.log(new Date(candles[len - 1].time));
//     console.log(new Date(candles[len - 2].time));
//     console.log(alignedTime);
//     console.log(candles.length);
//     const startInd = candles.findIndex((ele) => ele.time === alignedTime);
//     console.log(startInd);
//     currentKline.time = alignedTime;
//     currentKline.open = candles[startInd].open;
//     currentKline.high = candles[startInd].high;
//     currentKline.low = candles[startInd].low;
//     currentKline.close = candles[startInd].close;
//     currentKline.volume = candles[startInd].volume;
//     for (let i = startInd + 1; i < candles.length; i++) {
//         currentKline.high = Math.max(currentKline.high!, candles[i].high);
//         currentKline.low = Math.min(currentKline.low!, candles[i].low);
//         currentKline.close = candles[i].close;
//         currentKline.volume! += candles[i].volume;
//     }

//     return {
//         time: Math.floor(currentKline.time / 1000) as Time,
//         open: currentKline.open ?? 0,
//         high: currentKline.high ?? 0,
//         low: currentKline.low ?? 0,
//         close: currentKline.close ?? 0,
//     };
// };
