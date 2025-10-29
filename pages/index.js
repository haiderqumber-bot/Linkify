import Head from 'next/head'
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [url, setUrl] = useState('')
  const [slug, setSlug] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleShorten(e){
    e && e.preventDefault()
    setMsg('')
    if(!url) return setMsg('Paste a valid URL')
    setLoading(true)

    try {
      const session = supabase.auth.session()
      const token = session?.access_token

      const body = { original_url: url, custom_slug: slug || null }
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(body)
      })

      const data = await res.json()
      if(!res.ok) throw new Error(data?.error || 'Server error')
      setMsg(`Short URL: ${data.short_url}`)
      setUrl(''); setSlug('')
    } catch(err){
      setMsg(err.message || 'Error creating link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Linkify — Shorten & Track Links</title>
        <meta name="description" content="Shorten, brand and track links — Linkify" />
      </Head>

      <div className="min-h-screen bg-slate-50 text-slate-900">
        <nav className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold">L</div>
            <div className="text-lg font-semibold">Linkify</div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/dashboard" className="text-sm px-3 py-1 border rounded">Dashboard</a>
            <a href="#pricing" className="text-sm px-3 py-1 bg-blue-600 text-white rounded">Pricing</a>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-6 py-12">
          <section className="bg-white rounded-xl p-8 shadow">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h1 className="text-3xl font-extrabold mb-3">Shorten links. Track clicks. Look pro.</h1>
                <p className="text-slate-600 mb-6">
                  Linkify converts long, messy links into short, branded links with QR codes and basic analytics — perfect for agencies, freelancers, and real estate marketers.
                </p>

                <form onSubmit={handleShorten} className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      value={url}
                      onChange={(e)=>setUrl(e.target.value)}
                      placeholder="Paste long URL (https://...)"
                      className="flex-1 p-3 border rounded"
                    />
                    <input
                      value={slug}
                      onChange={(e)=>setSlug(e.target.value)}
                      placeholder="custom-slug (optional)"
                      className="w-48 p-3 border rounded"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>
                      {loading ? 'Creating...' : 'Shorten'}
                    </button>
                    <button type="button" onClick={()=>{ setUrl(''); setSlug(''); setMsg('') }} className="px-4 py-2 border rounded">Clear</button>
                    <a href="/dashboard" className="px-4 py-2 text-sm ml-auto">Manage links</a>
                  </div>
                </form>

                {msg && <div className="mt-4 p-3 bg-slate-50 border rounded text-sm">{msg}</div>}
              </div>

              <div>
                <div className="p-6 rounded border bg-gradient-to-br from-slate-50 to-white">
                  <h3 className="font-semibold mb-2">Why Linkify?</h3>
                  <ul className="list-disc pl-5 text-slate-600 space-y-2">
                    <li>Instant short links + custom slugs</li>
                    <li>QR code generation per link</li>
                    <li>Click analytics (device, basic referrer)</li>
                    <li>Link expiry & max clicks</li>
                  </ul>
                  <div className="mt-4 text-xs text-slate-500">Built with Next.js + Supabase — secure and fast.</div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded shadow">
              <h4 className="font-semibold mb-2">Short & Branded</h4>
              <p className="text-sm text-slate-600">Custom slugs and branded domains (Pro) to make links look trustworthy.</p>
            </div>
            <div className="bg-white p-5 rounded shadow">
              <h4 className="font-semibold mb-2">QR Codes</h4>
              <p className="text-sm text-slate-600">One-click QR PNG for every short link — perfect for print and posters.</p>
            </div>
            <div className="bg-white p-5 rounded shadow">
              <h4 className="font-semibold mb-2">Analytics</h4>
              <p className="text-sm text-slate-600">Basic analytics to see clicks over time and the device mix.</p>
            </div>
          </section>

          <section id="pricing" className="mt-10 grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded shadow text-center">
              <h5 className="font-semibold">Free</h5>
              <div className="text-2xl font-bold mt-4">Free</div>
              <p className="text-slate-600 mt-2">10 links / month · Basic stats</p>
              <button className="mt-6 px-4 py-2 border rounded">Get started</button>
            </div>

            <div className="bg-blue-600 text-white p-6 rounded shadow text-center transform scale-105">
              <h5 className="font-semibold">Pro</h5>
              <div className="text-2xl font-bold mt-4">₹1,200 / mo</div>
              <p className="mt-2">Unlimited links · Custom slugs · Branded domain · QR PNG</p>
              <button className="mt-6 px-4 py-2 bg-white text-blue-600 rounded">Upgrade</button>
            </div>

            <div className="bg-white p-6 rounded shadow text-center">
              <h5 className="font-semibold">Business</h5>
              <div className="text-2xl font-bold mt-4">Contact</div>
              <p className="text-slate-600 mt-2">Team access · API keys · Priority support</p>
              <button className="mt-6 px-4 py-2 border rounded">Contact sales</button>
            </div>
          </section>

          <section className="mt-10 bg-white p-6 rounded shadow">
            <h3 className="font-semibold">FAQ</h3>
            <div className="mt-3 grid md:grid-cols-2 gap-4 text-slate-600">
              <div>
                <strong>How do I add a branded domain?</strong>
                <p>Pro users can add a custom domain (like go.yourbrand.com) — we'll give DNS instructions.</p>
              </div>
              <div>
                <strong>Do you store passwords?</strong>
                <p>No — Supabase handles auth and stores passwords securely.</p>
              </div>
            </div>
          </section>

          <footer className="mt-10 text-center text-slate-500 text-sm">
            © {new Date().getFullYear()} Linkify — Built with Next.js + Supabase
          </footer>
        </main>
      </div>
    </>
  )
}
