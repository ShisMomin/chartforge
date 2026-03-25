import { Webhook } from 'svix';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

import { clerkClient, WebhookEvent } from '@clerk/nextjs/server';

async function validateRequest(request: Request) {
    const payloadString = await request.text(); // important: must be text
    const svixHeaders = {
        'svix-id': request.headers.get('svix-id')!,
        'svix-timestamp': request.headers.get('svix-timestamp')!,
        'svix-signature': request.headers.get('svix-signature')!,
    };

    const wh = new Webhook(webhookSecret);
    return wh.verify(payloadString, svixHeaders) as WebhookEvent;
}
const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || ``;
export async function POST(request: Request) {
    try {
        const payload = await validateRequest(request);
        console.log(payload.type);
        switch (payload.type) {
            case 'user.created':
            case 'user.updated': {
                const { id, email_addresses } = payload.data;
                if (!id) break;

                const { data } = await supabaseAdmin
                    .from('users')
                    .upsert(
                        {
                            clerk_id: id,
                            email: email_addresses?.[0]?.email_address,
                        },
                        { onConflict: 'clerk_id' },
                    )
                    .select()
                    .single();
                if (data) {
                    const client = await clerkClient();
                    await client.users.updateUser(id, {
                        publicMetadata: {
                            dbUserId: data.id,
                        },
                    });
                }

                break;
            }

            case 'user.deleted': {
                const { id } = payload.data;
                if (!id) break;

                await supabaseAdmin.from('users').delete().eq('clerk_id', id);

                break;
            }
        }
        return NextResponse.json({ success: true });
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
        }
        return new Response('Invalid signature', { status: 400 });
    }
}
