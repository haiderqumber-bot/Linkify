import { supabaseAdmin } from '../../../lib/supabaseAdmin'
import rateLimit from '../../../lib/rateLimit'
import isUrl from 'is-url'
import { randomSlug } from '../../../lib/slug'

export default async function handler(req, res){
  await rateLimit(req, res)
  if(req.method !== 'POST') return res.status(405).end()

  const authHeader = req.headers.authorization || ''
  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: userErr } = await supabaseAdmin.auth.getUser(token)
  if(userErr || !user) return res.status(401).json({ error: 'Unauthorized' })

  const { original_url, custom_slug, expires_at, max_clicks } = req.body
  if(!original_url || !isUrl(original_url)) return res.status(400).json({ error: 'Invalid URL' })

  const forbidden = ['localhost', '127.0.0.1', '::1']
  for(const f of forbidden){ if(original_url.includes(f)) return res.status(400).json({ error: 'Invalid destination' }) }

  let short_code = custom_slug ? custom_slug.replace(/[^a-zA-Z0-9-_]/g,'') : randomSlug(6)

  let tries = 0
  while(true){
    const { data:exists } = await supabaseAdmin.from('links').select('id').or(`short_code.eq.${short_code},custom_slug.eq.${short_code}`).limit(1)
    if(!exists || exists.length === 0) break
    short_code = randomSlug(8)
    if(++tries > 5) break
  }

  const payload = {
    original_url,
    short_code,
    custom_slug: custom_slug || null,
    owner_id: user.id,
    expires_at: expires_at || null,
    max_clicks: max_clicks || null,
    is_active: true
  }

  const { data, error } = await supabaseAdmin.from('links').insert([payload]).select().single()
  if(error) return res.status(500).json({ error: error.message })

  return res.status(201).json({ short_url: `${process.env.BASE_URL}/r/${short_code}`, link: data })
}
