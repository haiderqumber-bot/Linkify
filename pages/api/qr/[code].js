import QRCode from 'qrcode'

export default async function handler(req, res){
  const { code } = req.query
  if(!code) return res.status(400).end()
  const url = `${process.env.BASE_URL}/r/${code}`
  try{
    const buffer = await QRCode.toBuffer(url, { type: 'png', margin: 1, width: 300 })
    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate')
    res.status(200).send(buffer)
  } catch(err){
    res.status(500).json({ error: err.message })
  }
}
