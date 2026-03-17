'use client';
import { BinanceSocket } from '@/lib/binance/BinanceSocket';
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

interface Props {
    children: ReactNode;
}
type BinanceSocketContextType = {
    socket: BinanceSocket | null;
};
const BinanceSocketContext = createContext<BinanceSocketContextType | null>(
    null,
);

export default function BinanceSocketProvider({ children }: Props) {
    const socketRef = useRef<BinanceSocket | null>(null);
    const [socket, setSocket] = useState<BinanceSocket | null>(null);
    const handleSocket = useCallback(function (sckt: BinanceSocket | null) {
        console.log(sckt);
        setSocket(sckt);
    }, []);
    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = new BinanceSocket();
        }

        const instance = socketRef.current;
        instance.addSocketOpenHandler(() => handleSocket(instance));
        instance.addSocketCloseHandler(() => handleSocket(null));
        instance.connect();
        // setTimeout(() => {
        //     setSocket(instance);
        // }, 1000);

        return () => {
            // disconnect
            instance.disconnect();
            instance.removeSocketOpenHandler();
            instance.removeSocketCloseHandler();
        };
    }, [handleSocket]);

    return (
        <BinanceSocketContext.Provider value={{ socket }}>
            {children}
        </BinanceSocketContext.Provider>
    );
}

function useBinanceSocket() {
    const context = useContext(BinanceSocketContext);
    if (!context)
        throw new Error(
            'BinanceSocket context was used outside of BinanceSocketProvider',
        );
    return context;
}

export { useBinanceSocket };
