const LRU = require('lru-cache')

const tokenCache = new LRU({ max: 5000 })

export default async function rateLimit(req, res){
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'anon'
  const now = Date.now()
  const window = 60 * 1000
  const max = 20

  let entry = tokenCache.get(ip) || { count: 0, start: now }
  if(now - entry.start > window){ entry = { count: 0, start: now } }
  entry.count++
  tokenCache.set(ip, entry)
  if(entry.count > max){
    res.status(429).json({ error: 'Too many requests' });
    throw new Error('Rate limited')
  }
}
