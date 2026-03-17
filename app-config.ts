import {
    type Indicators,
    type Layout,
    type TimeFrames,
    TimeFrameType,
} from '@/shared/types/common';
abstract class AppConfig {
    protected static supportedIntervals: TimeFrameType[] = [
        '1s',
        '5s',
        '10s',
        '15s',
        '30s',
        '1m',
        '2m',
        '3m',
        '5m',
        '10m',
        '15m',
        '30m',
        '1h',
        '2h',
        '4h',
        '8h',
        '12h',
        '1d',
        '2d',
        '3d',
        '1w',
        '2w',
        '1M',
    ];
    protected static supportedTimeframes: TimeFrames = [
        // Seconds
        { label: '1 second', value: '1s', type: 'Seconds' },
        { label: '5 seconds', value: '5s', type: 'Seconds' },
        { label: '10 seconds', value: '10s', type: 'Seconds' },
        { label: '15 seconds', value: '15s', type: 'Seconds' },
        { label: '30 seconds', value: '30s', type: 'Seconds' },
        // Minutes
        { label: '1 minute', value: '1m', type: 'Minutes' },
        { label: '2 minutes', value: '2m', type: 'Minutes' },
        { label: '3 minutes', value: '3m', type: 'Minutes' },
        { label: '5 minutes', value: '5m', type: 'Minutes' },
        { label: '10 minutes', value: '10m', type: 'Minutes' },
        { label: '15 minutes', value: '15m', type: 'Minutes' },
        { label: '30 minutes', value: '30m', type: 'Minutes' },
        // Hours
        { label: '1 hour', value: '1h', type: 'Hours' },
        { label: '2 hours', value: '2h', type: 'Hours' },
        { label: '4 hours', value: '4h', type: 'Hours' },
        { label: '8 hours', value: '8h', type: 'Hours' },
        { label: '12 hours', value: '12h', type: 'Hours' },
        // Days/Weeks/Months
        { label: '1 day', value: '1d', type: 'Days' },
        { label: '2 day', value: '2d', type: 'Days' },
        { label: '3 day', value: '3d', type: 'Days' },
        { label: '1 week', value: '1w', type: 'Days' },
        { label: '2 week', value: '2w', type: 'Days' },
        { label: '1 month', value: '1M', type: 'Days' },
    ];
    protected static aggIntervalMap: Partial<
        Record<TimeFrameType, TimeFrameType>
    > = {
        '5s': '1s',
        '10s': '1s',
        '15s': '1s',
        '30s': '1s',
        '2m': '1m',
        '10m': '5m',
        '2d': '1d',
        '2w': '1w',
    };
    protected static supportedIndicators: Indicators = [];
    protected static supportedLayouts: Layout[] = [
        { label: '1', rows: 1, cols: 1 },
        { label: '1 × 2', rows: 1, cols: 2 },
        { label: '2 × 2', rows: 2, cols: 2 },
        { label: '2 × 3', rows: 2, cols: 3 },
        { label: '2 × 4', rows: 2, cols: 4 },
    ];
    static get getSupportedIntervals(): TimeFrameType[] {
        return this.supportedIntervals;
    }
    static get getSupportedTimeFrames(): TimeFrames {
        return this.supportedTimeframes;
    }
    static get getSupportedIndicators(): Indicators {
        return this.supportedIndicators;
    }
    static get getSupportedLayouts(): Layout[] {
        return this.supportedLayouts;
    }
    static getSourceInterval(
        targetInterval: TimeFrameType | null,
    ): TimeFrameType | null {
        if (!targetInterval || !this.aggIntervalMap[targetInterval])
            return null;
        return this.aggIntervalMap[targetInterval];
    }
    static isValidInterval(value: string | null): value is TimeFrameType {
        if (!value) return false;
        return this.supportedIntervals.includes(value as TimeFrameType);
    }
    static isAggInterval(value: string) {
        const keys = Object.keys(this.aggIntervalMap);
        return keys.includes(value);
    }
}

export { AppConfig };
