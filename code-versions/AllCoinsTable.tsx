import CoinIcon from '@/shared/components/ui/CoinIcon';
import { Ticker } from '@/shared/types/common';
import React, { useEffect } from 'react';
import { TableVirtuoso } from 'react-virtuoso';

type Props = {
    coinsInfoList: Ticker[];
};
function formatValues(price: string | number) {
    const num = Number(price);

    if (num >= 1000)
        return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
    if (num >= 1) return num.toFixed(2);
    if (num >= 0.01) return num.toFixed(4);
    if (num >= 0.0001) return num.toFixed(6);

    return num.toPrecision(2); // ultra small coins
}

const SymbolCell = React.memo(function SymbolCell({
    symbol,
}: {
    symbol: string;
}) {
    return (
        <td
            className="border border-panel-border px-2 text-center bg-background"
            style={{
                width: 150,
                position: 'sticky',
                left: 0,
            }}
        >
            {symbol}
        </td>
    );
});

const ValueCell = React.memo(function ValueCell({
    value,
    styleBasedOnValue,
}: {
    value: number | string;
    styleBasedOnValue: (currValue: string | number) => string;
}) {
    const formatedValue = formatValues(value);
    return (
        <td
            className={`border border-panel-border  text-center  p-2 text-sm sm:text-md sm:p-3 font-bold ${styleBasedOnValue(formatedValue)}`}
        >
            {formatedValue}
        </td>
    );
});

export default function AllCoinsTable({ coinsInfoList }: Props) {
    return (
        <div className="w-full h-full ">
            <TableVirtuoso
                style={{ height: '100%' }}
                data={coinsInfoList}
                components={{
                    Table: ({ style, ...props }) => (
                        <table
                            {...props}
                            className="border border-panel-border border-separate border-spacing-0"
                            style={{
                                ...style,
                                width: '100%',
                                minWidth: 800,
                            }}
                        />
                    ),
                    TableRow: (props) => (
                        <tr
                            {...props}
                            className="cursor-pointer hover:bg-hover/30"
                        />
                    ),
                }}
                computeItemKey={(index, item) => item.symbol}
                fixedHeaderContent={() => (
                    <tr>
                        <th
                            className="border border-panel-border bg-background text-gray-400 text-sm py-1 sm:text-lg sm:py-2"
                            style={{
                                width: 180,
                                position: 'sticky',
                                left: 0,
                                zIndex: 10,
                            }}
                        >
                            Symbol
                        </th>
                        <th
                            className="border border-panel-border bg-background text-gray-400 py-1 text-sm sm:text-lg"
                            // style={{ background: 'black' }}
                        >
                            Price
                        </th>
                        <th
                            className="border border-panel-border bg-background text-gray-400 py-1 sm:text-lg sm:py-2"
                            // style={{ background: 'black' }}
                        >
                            24h %
                        </th>
                        <th
                            className="border border-panel-border bg-background text-gray-400 py-1 sm:text-lg sm:py-2"
                            // style={{ background: 'black' }}
                        >
                            24h Change
                        </th>
                        <th
                            className="border border-panel-border bg-background text-gray-400 py-1 sm:text-lg sm:py-2"
                            // style={{ background: 'black' }}
                        >
                            24h Volume
                        </th>
                    </tr>
                )}
                itemContent={(index, c) => {
                    // const price = formatValues(c.lastPrice);
                    // const _24_percent = formatValues(c.priceChangePercent);
                    // const priceChange = formatValues(c.priceChange);
                    // const volume = formatValues(c.quoteVolume);
                    return (
                        <>
                            <SymbolCell symbol={c.symbol} />

                            <ValueCell
                                value={c.lastPrice}
                                styleBasedOnValue={(value) => {
                                    return 'text-green-500';
                                }}
                            />
                            <ValueCell
                                value={c.priceChangePercent}
                                styleBasedOnValue={(value) => {
                                    return Number(value) < 0
                                        ? 'text-red-500'
                                        : 'text-green-500';
                                }}
                            />
                            <ValueCell
                                value={c.priceChange}
                                styleBasedOnValue={(value) => {
                                    return Number(value) < 0
                                        ? 'text-red-500'
                                        : 'text-green-500';
                                }}
                            />
                            <ValueCell
                                value={c.quoteVolume}
                                styleBasedOnValue={(value) => {
                                    return 'text-green-500';
                                }}
                            />
                        </>
                    );
                }}
            />
        </div>
    );
}

// export default function AllCoinsTable({ coinsInfoList }: Props) {
//     return (
//         <div className="w-full h-full ">
//             <TableVirtuoso
//                 style={{ height: '100%' }}
//                 data={coinsInfoList}
//                 components={{
//                     Table: ({ style, ...props }) => (
//                         <table
//                             {...props}
//                             className="border border-panel-border border-separate border-spacing-0"
//                             style={{
//                                 ...style,
//                                 width: '100%',
//                                 minWidth: 800,
//                             }}
//                         />
//                     ),
//                     TableRow: (props) => (
//                         <tr
//                             {...props}
//                             className="cursor-pointer hover:bg-hover/30"
//                         />
//                     ),
//                 }}
//                 computeItemKey={(index, item) => item.symbol}
//                 fixedHeaderContent={() => (
//                     <tr>
//                         <th
//                             className="border border-panel-border bg-background text-gray-400 text-sm py-1 sm:text-lg sm:py-2"
//                             style={{
//                                 width: 180,
//                                 position: 'sticky',
//                                 left: 0,
//                                 zIndex: 10,
//                             }}
//                         >
//                             Symbol
//                         </th>
//                         <th
//                             className="border border-panel-border bg-background text-gray-400 py-1 text-sm sm:text-lg"
//                             // style={{ background: 'black' }}
//                         >
//                             Price
//                         </th>
//                         <th
//                             className="border border-panel-border bg-background text-gray-400 py-1 sm:text-lg sm:py-2"
//                             // style={{ background: 'black' }}
//                         >
//                             24h %
//                         </th>
//                         <th
//                             className="border border-panel-border bg-background text-gray-400 py-1 sm:text-lg sm:py-2"
//                             // style={{ background: 'black' }}
//                         >
//                             24h Change
//                         </th>
//                         <th
//                             className="border border-panel-border bg-background text-gray-400 py-1 sm:text-lg sm:py-2"
//                             // style={{ background: 'black' }}
//                         >
//                             24h Volume
//                         </th>
//                     </tr>
//                 )}
//                 itemContent={(index, c) => {
//                     const price = formatValues(c.lastPrice);
//                     const _24_percent = formatValues(c.priceChangePercent);
//                     const priceChange = formatValues(c.priceChange);
//                     const volume = formatValues(c.quoteVolume);
//                     return (
//                         <>
//                             <td
//                                 className="border border-panel-border px-2 text-center bg-background  text-sm sm:text-md"
//                                 style={{
//                                     width: 150,
//                                     // background: 'black',
//                                     position: 'sticky',
//                                     left: 0,
//                                 }}
//                             >
//                                 <div className="flex gap-6 flex-1 font-bold">
//                                     {/* <CoinIcon symbol={c.symbol} /> */}
//                                     {c.symbol}
//                                 </div>
//                                 {/* <SymbolCell key={c.symbol} symbol={c.symbol} /> */}
//                             </td>
//                             <td className="border border-panel-border  text-center  p-2 text-sm sm:text-md sm:p-3 font-bold text-green-500">
//                                 {price}
//                             </td>
//                             <td
//                                 className={`border border-panel-border p-2 text-center  text-sm sm:text-md sm:p-3 font-bold ${Number(_24_percent) < 0 ? 'text-red-500' : 'text-green-500'}`}
//                             >
//                                 {_24_percent}
//                             </td>
//                             <td
//                                 className={`border border-panel-border p-2 text-center  text-sm sm:text-md sm:p-3 font-bold
//                                  ${
//                                      Number(priceChange) < 0
//                                          ? 'text-red-500'
//                                          : 'text-green-500'
//                                  }`}
//                             >
//                                 {priceChange}
//                             </td>
//                             <td
//                                 className={`border border-panel-border p-2 text-center text-sm sm:text-md sm:p-3 text-green-500 font-bold`}
//                             >
//                                 {volume}
//                             </td>
//                         </>
//                     );
//                 }}
//             />
//         </div>
//     );
// }
