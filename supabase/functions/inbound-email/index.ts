// Animal Joy — inbound-email Edge Function
//
// This receives a webhook from Resend every time someone sends a real email
// to your domain address (e.g. hello@animaljoystories.com), and saves it as
// a row in contact_messages so it shows up in the admin Messages page,
// exactly like a "Contact us" form submission.
//
// How to deploy:
// 1. Supabase Dashboard -> Edge Functions -> Deploy a new function -> Via Editor
//    -> name it exactly: inbound-email -> paste this file -> Deploy.
// 2. Add Secrets (Edge Functions -> inbound-email -> Secrets):
//      RESEND_API_KEY = same key as your other functions
//    (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are already available automatically)
// 3. In Resend: go to Webhooks -> Add Webhook.
//      Endpoint URL: https://YOUR-PROJECT-REF.supabase.co/functions/v1/inbound-email
//      Events to send: email.received
//    Resend will give you a "Signing secret" (starts with whsec_) — add it as
//    one more Secret here:
//      RESEND_WEBHOOK_SECRET = whsec_...
// 4. In Resend: go to your domain -> Receiving -> set the inbound address to
//    your real address (e.g. hello@animaljoystories.com) so emails sent there
//    trigger this webhook.

import { createClient } from 'npm:@supabase/supabase-js@2'
import { Webhook } from 'npm:svix@1'

Deno.serve(async (req) => {
  try {
    const payload = await req.text()
    const webhookSecret = Deno.env.get('RESEND_WEBHOOK_SECRET')

    // Verify this request genuinely came from Resend, not someone else
    // pretending to be Resend.
    if (webhookSecret) {
      try {
        const wh = new Webhook(webhookSecret)
        wh.verify(payload, {
          'svix-id': req.headers.get('svix-id') || '',
          'svix-timestamp': req.headers.get('svix-timestamp') || '',
          'svix-signature': req.headers.get('svix-signature') || '',
        })
      } catch {
        return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 401 })
      }
    }

    const event = JSON.parse(payload)
    if (event.type !== 'email.received') {
      return new Response(JSON.stringify({ skipped: true }), { status: 200 })
    }

    const emailId = event.data.email_id
    const resendApiKey = Deno.env.get('RESEND_API_KEY')

    // The webhook only gives us metadata, fetch the actual email body.
    const emailRes = await fetch(`https://api.resend.com/emails/receiving/${emailId}`, {
      headers: { Authorization: `Bearer ${resendApiKey}` },
    })
    const email = await emailRes.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL'),
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    )

    await supabase.from('contact_messages').insert({
      name: email.from || 'Unknown',
      email: email.from || 'unknown@unknown.com',
      message: email.text || email.subject || '(no content)',
      source: 'inbound_email',
    })

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})
