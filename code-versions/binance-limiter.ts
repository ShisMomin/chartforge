import { supabase } from '@/lib/supabase';

const LIMIT = 1200;
const WINDOW_MS = 60_000;
const BINANCE_ROW_ID = 1;

export async function canCallBinance(): Promise<boolean> {
    const now = Date.now();
    // Step 1: Read current state
    const { data, error } = await supabase
        .from('binance_rate_limit')
        .select('remaining, reset_at')
        .eq('id', BINANCE_ROW_ID)
        .single();
    if (error || !data) return false;
    const remaining = data.remaining ?? 0;
    const resetAt = data.reset_at ? new Date(data.reset_at).getTime() : 0;
    // Reset window
    if (now > resetAt) {
        const { error: resetError } = await supabase
            .from('binance_rate_limit')
            .update({
                remaining: LIMIT - 1,
                reset_at: new Date(now + WINDOW_MS).toISOString(),
            })
            .eq('id', BINANCE_ROW_ID);
        return !resetError;
    }
    // Block if exhausted
    if (remaining <= 0) return false;

    // 🔽 Atomic decrement
    const { error: decrementError } = await supabase.rpc(
        'decrement_binance_remaining',
        { row_id: BINANCE_ROW_ID },
    );
    return !decrementError;
}
