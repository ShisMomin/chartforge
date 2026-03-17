'use client';
import { createSupabaseClerkClient } from '@/lib/supabaseClerkClient';
import { useAuth, useUser } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';

const symbols = [
    'BTCUSDT',
    'ETHUSDT',
    'SOLUSDT',
    'BNBUSDT',
    'XRPUSDT',
    'ADAUSDT',
    'DOGEUSDT',
];

// export default function AddWatchlist() {
//     const { user } = useUser();
//     const dbUserId = user?.publicMetadata?.dbUserId;
//     const addSymbol = async (symbol: string) => {
//         const { error } = await supabase.from('watchlists').insert({
//             user_id:dbUserId,
//             symbol,
//         });
//         console.log(error);
//     };

//     return (
//         <div>
//             {symbols.map((symbol) => (
//                 <button
//                     className="p-2 bg-panel border text-foreground m-2 cursor-pointer hover:bg-hover"
//                     key={symbol}
//                     onClick={() => addSymbol(symbol)}
//                 >
//                     Add {symbol}
//                 </button>
//             ))}
//         </div>
//     );
// }

export default function AddWatchlist() {
    const { user } = useUser();
    const { getToken } = useAuth();

    const dbUserId = user?.publicMetadata?.dbUserId as string | undefined;
    const addSymbol = async (symbol: string) => {
        const token = await getToken({ template: 'supabase' });
        const supabase = createSupabaseClerkClient(token!);
        if (!dbUserId) return;
        const { error } = await supabase.from('watchlists').insert({
            symbol,
        });
        console.log(error);
        // const { data } = await supabase.rpc('show_jwt');
        // console.log(data);
    };

    return (
        <div>
            {symbols.map((symbol) => (
                <button
                    className="p-2 bg-panel border text-foreground m-2 cursor-pointer hover:bg-hover"
                    key={symbol}
                    onClick={() => addSymbol(symbol)}
                >
                    Add {symbol}
                </button>
            ))}
        </div>
    );
}
