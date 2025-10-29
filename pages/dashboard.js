import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Dashboard() {
  const [session, setSession] = useState(null)
  const [links, setLinks] = useState([])

  useEffect(()=>{
    const s = supabase.auth.session()
    setSession(s)
    supabase.auth.onAuthStateChange((_event, sess) => setSession(sess))
  },[])

  useEffect(()=>{
    if(!session) return
    fetchLinks()
  },[session])

  async function fetchLinks(){
    const { data, error } = await supabase.from('links').select('*').eq('owner_id', session.user.id).order('created_at',{ascending:false})
    if(error) return console.error(error)
    setLinks(data)
  }

  async function signIn() {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'github' })
    if(error) console.error(error)
  }

  async function signOut(){
    await supabase.auth.signOut()
    setSession(null)
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl">Dashboard</h2>
      {!session ? (
        <div>
          <p className="mt-3">Please sign in to see your links.</p>
          <button onClick={signIn} className="mt-4 px-4 py-2 bg-black text-white rounded">Sign in (GitHub)</button>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-4 mt-4">
            <div>Signed in as {session.user.email || session.user.user_metadata?.email}</div>
            <button className="px-3 py-1 border rounded" onClick={signOut}>Sign Out</button>
          </div>

          <div className="mt-6">
            {links.length === 0 ? <p>No links yet</p> : (
              <table className="w-full text-left">
                <thead><tr><th>Short</th><th>Original</th><th>Clicks</th></tr></thead>
                <tbody>
                  {links.map(l=> (
                    <tr key={l.id} className="border-t">
                      <td><a className="text-blue-600" href={`/r/${l.short_code}`}>{`/r/${l.short_code}`}</a></td>
                      <td className="truncate max-w-sm">{l.original_url}</td>
                      <td>{l.click_count || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
