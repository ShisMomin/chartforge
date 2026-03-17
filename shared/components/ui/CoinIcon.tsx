import { binanceCryptoIcons } from 'binance-icons';
import Image from 'next/image';
import React from 'react';

type Props = {
    symbol: string;
};
function CoinIcon({ symbol }: Props) {
    const base = symbol.replace('USDT', '').toLowerCase();
    const hasIcon = binanceCryptoIcons.has(base);
    const iconUrl = hasIcon
        ? `https://cdn.jsdelivr.net/gh/vadimmalykhin/binance-icons/crypto/${base}.svg`
        : '/generic.svg';

    return (
        <img
            src={iconUrl}
            alt={base}
            width={24}
            height={24}
            className="min-w-6 h-6 cursor-pointer"
            // loading="lazy"
        />
    );
}
export default React.memo(CoinIcon);
