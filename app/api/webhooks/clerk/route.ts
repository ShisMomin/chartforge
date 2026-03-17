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
// if (payload.type === 'user.created') {
//     const { id, email_addresses } = payload.data;
//     console.log('type', payload.type);
//     const { data, error } = await supabaseAdmin.from('users').upsert(
//         {
//             clerk_id: id,
//             email: email_addresses[0].email_address,
//         },
//         { onConflict: 'clerk_id' },
//     );
//     console.log('DATA:', data);
//     console.log('ERROR:', error);
// }
// if (payload.type === 'user.deleted') {
//     const { id } = payload.data;

//     const { error } = await supabaseAdmin
//         .from('users')
//         .delete()
//         .eq('clerk_id', id);

//     console.log('DELETE ERROR:', error);
// }
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
// export async function POST(req: Request) {
//     const payload = await req.text();
//     const headerPayload = headers();
//     const svix_id = headerPayload.get('svix-id');
//     const svix_timestamp = headerPayload.get('svix-timestamp');
//     const svix_signature = headerPayload.get('svix-signature');
//     if (!svix_id || !svix_timestamp || !svix_signature) {
//         return new Response('Missing svix headers', { status: 400 });
//     }
//     const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

//     let evt;
//     try {
//         evt = wh.verify(payload, {
//             'svix-id': svix_id,
//             'svix-timestamp': svix_timestamp,
//             'svix-signature': svix_signature,
//         });
//     } catch (err) {
//         return new Response('Invalid signature', { status: 400 });
//     }
//     if (evt.type === 'user.created') {
//         const { id, email_addresses } = evt.data as any;
//         await supabase.from('users').upsert(
//             {
//                 clerk_id: id,
//                 email: email_addresses[0].email_address,
//             },
//             { onConflict: 'clerk_id' },
//         );
//     }
//     return NextResponse.json({ success: true });
// }
