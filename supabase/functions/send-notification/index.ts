// Animal Joy — send-notification Edge Function
//
// How to deploy (no terminal needed):
// 1. In the Supabase Dashboard, go to "Edge Functions" in the left sidebar.
// 2. Open the existing "send-notification" function (or create it if it
//    doesn't exist yet: "Deploy a new function" -> "Via Editor", name it
//    exactly: send-notification).
// 3. Delete ALL the code currently there and paste this entire file in its place.
// 4. Click Deploy.
// 5. Under Edge Functions -> send-notification -> Secrets, make sure these exist:
//      RESEND_API_KEY = <your Resend API key from resend.com>
//      SENDER_EMAIL   = onboarding@resend.dev
//    (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are already available
//    automatically, you don't need to add those yourself.)
//
// What it does: checks that whoever called it is an admin (via the
// profiles.is_admin flag), then emails every registered user's address
// with the title/body sent from the admin panel.
//
// NOTE: this version adds CORS headers. Without them, the browser blocks
// the request before it even reaches this function.

import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization') || ''
    const jwt = authHeader.replace('Bearer ', '')

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const senderEmail = Deno.env.get('SENDER_EMAIL') || 'onboarding@resend.dev'

    const admin = createClient(supabaseUrl, serviceRoleKey)

    const {
      data: { user },
    } = await admin.auth.getUser(jwt)
    if (!user) {
      return new Response(JSON.stringify({ error: 'Not signed in' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data: profile } = await admin.from('profiles').select('is_admin').eq('id', user.id).single()
    if (!profile?.is_admin) {
      return new Response(JSON.stringify({ error: 'Admins only' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { title, body } = await req.json()
    if (!title || !body) {
      return new Response(JSON.stringify({ error: 'Missing title or body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data: profiles } = await admin.from('profiles').select('email').not('email', 'is', null)
    const emails = (profiles || []).map((p) => p.email).filter(Boolean)

    if (emails.length === 0) {
      return new Response(JSON.stringify({ sent: 0, message: 'No registered users yet' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const chunks = []
    for (let i = 0; i < emails.length; i += 100) chunks.push(emails.slice(i, i + 100))

    let sent = 0
    let lastErrorText = ''
    for (const chunk of chunks) {
      const payload = chunk.map((to) => ({
        from: senderEmail,
        to,
        subject: title,
        html: `<p>${body.replace(/\n/g, '<br/>')}</p>`,
      }))

      const res = await fetch('https://api.resend.com/emails/batch', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        sent += chunk.length
      } else {
        lastErrorText = await res.text()
      }
    }

    return new Response(JSON.stringify({ sent, total: emails.length, lastErrorText }), {
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
