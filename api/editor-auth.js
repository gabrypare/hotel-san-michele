export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  try {
    let body = req.body
    if (typeof body === 'string') body = JSON.parse(body)
    const { password } = body || {}
    const correct = process.env.EDITOR_PASSWORD
    if (!correct) return res.status(500).json({ error: 'Server non configurato' })
    if (password !== correct) return res.status(401).json({ error: 'Password errata' })
    res.status(200).json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
