export interface BinanceKlineEvent {
    e: 'kline';
    E: number;
    s: string;
    k: {
        t: number;
        T: number;
        s: string;
        i: string;
        o: string;
        c: string;
        h: string;
        l: string;
        v: string;
        n: number;
        x: boolean;
    };
}

export interface BinanceTickerEvent {
    e: string; // event type
    E: number; // event time
    s: string; // symbol
    p: string; // price change
    P: string; // price change percent
    c: string; // last price
    q: string; // quote volume
}

export type KlineHandler = (event: BinanceKlineEvent) => void;
export type TickerHandler = (event: BinanceTickerEvent) => void;
export type AllTickerHandler = (event: BinanceTickerEvent[]) => void;
export type SocketInitHandler = () => void;

export class BinanceSocket {
    private ws: WebSocket | null = null;
    private readonly baseUrl = 'wss://stream.binance.com:9443/ws';
    private HEARTBEAT_TIMEOUT = 30 * 1000;
    private heartbeatTimeout: ReturnType<typeof setTimeout> | null = null;
    private socketOpenHandler: SocketInitHandler | null = null;
    private socketCloseHandler: SocketInitHandler | null = null;
    // private socketInitHandler: SocketInitHandler | null = null;
    private klineHandlers = new Set<KlineHandler>();
    private tickerHandlers = new Set<TickerHandler>();
    private allTickerHandlers = new Set<AllTickerHandler>();
    private reconnectAttempts = 0;
    private readonly MAX_RECONNECT = 5;
    private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    private subscriptions = new Set<string>();
    private streamRefs = new Map<string, number>();
    private requestId = 1;
    private resetHeartBeat() {
        if (this.heartbeatTimeout) {
            clearTimeout(this.heartbeatTimeout);
        }
        this.heartbeatTimeout = setTimeout(() => {
            console.log('Heartbeat timeout — reconnecting...');
            this.ws?.close();
        }, this.HEARTBEAT_TIMEOUT);
    }
    private send(payload: object) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

        this.ws.send(JSON.stringify(payload));
    }
    private klineStream(symbol: string, interval: string) {
        return `${symbol.toLowerCase()}@kline_${interval}`;
    }
    private tickerStream(symbols: string[]) {
        // return `${symbol.toLowerCase()}@ticker`;
        return symbols.map((s) => `${s.toLowerCase()}@ticker`).join('/');
    }

    connect() {
        if (this.ws || this.reconnectTimer) return;
        this.ws = new WebSocket(this.baseUrl);
        this.ws.onopen = () => {
            if (this.socketOpenHandler) this.socketOpenHandler();
            console.log('BinanceSocket connected!');
        };
        this.ws.onmessage = (event) => {
            this.resetHeartBeat();
            const data = JSON.parse(event.data);
            // console.log(data);

            if (data.e === 'kline') {
                // console.log(data.k.i);
                this.klineHandlers.forEach((cd) => cd(data));
            }
            if (data.e === '24hrTicker') {
                this.tickerHandlers.forEach((cd) => cd(data));
            }
            if (data.length) {
                this.allTickerHandlers.forEach((cd) => cd(data));
            }
        };
        this.ws.onclose = (error) => {
            console.log('BinanceSocket closed', error);
            this.ws = null;
            if (this.heartbeatTimeout) {
                clearTimeout(this.heartbeatTimeout);
                this.heartbeatTimeout = null;
            }
            if (this.reconnectAttempts >= this.MAX_RECONNECT) return;
            const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 15_000);
            this.reconnectAttempts++;
            // if (this.heartbeatTimeout) clearTimeout(this?.heartbeatTimeout);
            if (this.socketCloseHandler) this.socketCloseHandler();
            this.reconnectTimer = setTimeout(() => {
                this.reconnectTimer = null;
                this.connect();
            }, delay);
        };
    }
    disconnect() {
        this.reconnectAttempts = this.MAX_RECONNECT;
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.close();
            this.ws = null;
        }

        if (this.heartbeatTimeout) {
            clearTimeout(this.heartbeatTimeout);
            this.heartbeatTimeout = null;
        }
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
    }

    subscribeKline(symbol: string, interval: string) {
        const stream = this.klineStream(symbol, interval);
        // if (this.subscriptions.has(stream)) {
        //     return; // already subscribed at socket level
        // }
        const count = this.streamRefs.get(stream) ?? 0;
        if (count === 0) {
            if (this.ws?.readyState === WebSocket.OPEN) {
                this.send({
                    method: 'SUBSCRIBE',
                    params: [stream],
                    id: this.requestId++,
                });
            }
        }
        this.streamRefs.set(stream, count + 1);
        // this.subscriptions.add(stream);
        // if (this.ws?.readyState === WebSocket.OPEN) {
        //     this.send({
        //         method: 'SUBSCRIBE',
        //         params: [stream],
        //         id: this.requestId++,
        //     });
        // }
    }
    unsubscribeKline(symbol: string, interval: string) {
        const stream = this.klineStream(symbol, interval);
        const count = this.streamRefs.get(stream);
        if (!count) return;
        // this.subscriptions.delete(stream);
        // console.log(count);
        if (count === 1) {
            if (this.ws?.readyState === WebSocket.OPEN) {
                this.send({
                    method: 'UNSUBSCRIBE',
                    params: [stream],
                    id: this.requestId++,
                });
            }
            this.streamRefs.delete(stream);
        } else {
            this.streamRefs.set(stream, count - 1);
        }
    }

    addSocketOpenHandler(handler: SocketInitHandler) {
        this.socketOpenHandler = handler;
    }
    removeSocketOpenHandler() {
        this.socketOpenHandler = null;
    }
    addSocketCloseHandler(handler: SocketInitHandler) {
        this.socketCloseHandler = handler;
    }
    removeSocketCloseHandler() {
        this.socketCloseHandler = null;
    }

    addKlineHandler(handler: KlineHandler) {
        this.klineHandlers.add(handler);
    }
    removeKlineHandler(handler: KlineHandler) {
        this.klineHandlers.delete(handler);
    }
    subscribeTicker(symbols: string[]) {
        if (symbols.length <= 0) return;
        const stream = this.tickerStream(symbols);
        // console.log(stream);
        // console.log(this.ws?.readyState);
        const count = this.streamRefs.get(stream) ?? 0;
        if (count === 0) {
            if (this.ws?.readyState === WebSocket.OPEN) {
                this.send({
                    method: 'SUBSCRIBE',
                    params: stream.split('/'),
                    id: this.requestId++,
                });
            }
        }
        this.streamRefs.set(stream, count + 1);
    }
    unsubscribeTicker(symbols: string[]) {
        if (symbols.length <= 0) return;
        const stream = this.tickerStream(symbols);
        const count = this.streamRefs.get(stream);
        if (!count) return;
        if (count === 1) {
            if (this.ws?.readyState === WebSocket.OPEN) {
                this.send({
                    method: 'UNSUBSCRIBE',
                    params: stream.split('/'),
                    id: this.requestId++,
                });
            }
            this.streamRefs.delete(stream);
        } else {
            this.streamRefs.set(stream, count - 1);
        }
    }

    addTickerHandler(handler: TickerHandler) {
        this.tickerHandlers.add(handler);
    }
    removeTickerHandler(handler: TickerHandler) {
        this.tickerHandlers.delete(handler);
    }
    subscribeAllTicker() {
        const stream = '!ticker@arr';
        const count = this.streamRefs.get(stream) ?? 0;
        if (count === 0) {
            if (this.ws?.readyState === WebSocket.OPEN) {
                this.send({
                    method: 'SUBSCRIBE',
                    params: stream.split('/'),
                    id: this.requestId++,
                });
            }
        }
        this.streamRefs.set(stream, count + 1);
    }
    unsubscribeAllTicker() {
        const stream = '!ticker@arr';
        const count = this.streamRefs.get(stream);
        if (!count) return;
        if (count === 1) {
            if (this.ws?.readyState === WebSocket.OPEN) {
                this.send({
                    method: 'UNSUBSCRIBE',
                    params: [stream],
                    id: this.requestId++,
                });
            }
            this.streamRefs.delete(stream);
        } else {
            this.streamRefs.set(stream, count - 1);
        }
    }
    addAllTickerHandler(handler: AllTickerHandler) {
        this.allTickerHandlers.add(handler);
    }
    removeAllTickerHandler(handler: AllTickerHandler) {
        this.allTickerHandlers.delete(handler);
    }
}
