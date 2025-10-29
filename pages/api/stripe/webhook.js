import Stripe from 'stripe'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'
import getRawBody from 'raw-body'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' })
export const config = { api: { bodyParser: false } }

export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).end()
  const buf = await getRawBody(req)
  const sig = req.headers['stripe-signature']
  let event
  try{
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch(err){
    console.error('Stripe webhook error', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if(event.type === 'checkout.session.completed'){
    const session = event.data.object
    const userId = session.metadata?.user_id
    if(userId){
      await supabaseAdmin.from('users').update({ plan: 'pro' }).eq('id', userId)
    }
  }

  res.json({ received: true })
}
