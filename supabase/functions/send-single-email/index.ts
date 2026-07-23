// Animal Joy — send-single-email Edge Function
//
// How to deploy (same as send-notification): Supabase Dashboard -> Edge Functions
// -> Deploy a new function -> Via Editor -> name it exactly: send-single-email
// -> paste this file -> Deploy.
//
// After deploying, add these Secrets (Edge Functions -> send-single-email -> Secrets):
//   RESEND_API_KEY   = same key you already used for send-notification
//   SENDER_EMAIL     = your real domain sender, e.g. hello@animaljoystories.com
//   INTERNAL_SECRET  = make up any long random password-like string yourself
//
// This function is NOT meant to be called from the browser, only from our own
// database trigger (via pg_net) when someone responds to a Lost & Found post.
// The X-Internal-Secret header check below is what keeps random people from
// using this function to spam emails through your Resend account.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-internal-secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const internalSecret = Deno.env.get('INTERNAL_SECRET')
    const providedSecret = req.headers.get('X-Internal-Secret')

    if (!internalSecret || providedSecret !== internalSecret) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const senderEmail = Deno.env.get('SENDER_EMAIL') || 'onboarding@resend.dev'

    const { to, subject, body } = await req.json()
    if (!to || !subject || !body) {
      return new Response(JSON.stringify({ error: 'Missing to, subject, or body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: senderEmail,
        to,
        subject,
        html: `<p>${body.replace(/\n/g, '<br/>')}</p>`,
      }),
    })

    const ok = res.ok
    const text = await res.text()

    return new Response(JSON.stringify({ sent: ok, detail: text }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
