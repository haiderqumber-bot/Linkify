const crypto = require('crypto')
const base62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

function randomSlug(length = 6) {
  const bytes = crypto.randomBytes(length)
  let slug = ''
  for (let i=0;i<length;i++) slug += base62[ bytes[i] % base62.length ]
  return slug
}

module.exports = { randomSlug }
