import { put } from '@vercel/blob'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const password = process.env.EDITOR_PASSWORD
  if (!password) return res.status(500).json({ error: 'Server non configurato' })

  try {
    let body = req.body
    if (typeof body === 'string') body = JSON.parse(body)
    const { password: pw, base64, filename } = body || {}

    if (pw !== password) return res.status(401).json({ error: 'Non autorizzato' })
    if (!base64 || !filename) return res.status(400).json({ error: 'Dati mancanti' })

    const buffer = Buffer.from(base64, 'base64')
    const safeName = `menu/${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase()}`

    const blob = await put(safeName, buffer, {
      access: 'public',
      contentType: 'image/jpeg',
    })

    res.status(200).json({ ok: true, path: blob.url })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
