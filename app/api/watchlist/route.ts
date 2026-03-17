import { createSupabaseClerkClient } from '@/lib/supabaseClerkClient';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const { userId, getToken } = await auth();

        // console.log(userId);
        if (!userId) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 },
            );
        }

        const token = await getToken({ template: 'supabase' });
        const supabase = createSupabaseClerkClient(token!);
        const { data } = await supabase
            .from('watchlists')
            .select('symbol')
            .order('created_at', { ascending: false });

        return NextResponse.json(data);
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}
export async function POST(req: Request) {
    try {
        const { userId, getToken } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 },
            );
        }
        const { symbol } = await req.json();
        const token = await getToken({ template: 'supabase' });
        const supabase = createSupabaseClerkClient(token!);
        const { data } = await supabase
            .from('watchlists')
            .insert({ symbol })
            .select();

        return NextResponse.json(data);
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}

export async function DELETE(req: Request) {
    try {
        const { symbol } = await req.json();

        const { userId, getToken } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 },
            );
        }

        const token = await getToken({ template: 'supabase' });
        const supabase = createSupabaseClerkClient(token!);

        await supabase.from('watchlists').delete().eq('symbol', symbol);
        return NextResponse.json({ success: true });
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}
