import { supabaseAdmin } from '../../lib/supabaseAdmin'

export async function getServerSideProps({ params }){
  const code = params.code
  const { data } = await supabaseAdmin
    .from('links')
    .select('original_url, is_active, expires_at, max_clicks, click_count')
    .or(`short_code.eq.${code},custom_slug.eq.${code}`)
    .limit(1)
    .maybeSingle()

  if(!data || !data.original_url || !data.is_active){
    return { notFound: true }
  }

  if(data.expires_at && new Date(data.expires_at) < new Date()){
    return { notFound: true }
  }

  await supabaseAdmin.rpc('increment_click', { p_link_code: code })

  return {
    redirect: {
      destination: data.original_url,
      permanent: false
    }
  }
}

export default function RedirectPage(){ return null }
