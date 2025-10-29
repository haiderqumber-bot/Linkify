import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!serviceRoleKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY in env')

export const supabaseAdmin = createClient(url, serviceRoleKey, {
  auth: { persistSession: false }
})
