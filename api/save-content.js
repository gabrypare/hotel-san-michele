import https from 'https'

const REPO   = 'gabrypare/hotel-san-michele'
const BRANCH = 'main'

const FILE_MAP = {
  menu:       'src/content/menu.json',
  rooms:      'src/content/rooms.json',
  activities: 'src/content/activities.json',
  gallery:    'src/content/gallery.json',
  settings:   'src/content/settings.json',
  nav:        'src/content/nav.json',
  restaurant: 'src/content/restaurant.json',
  home:       'src/content/home.json',
  hotel:      'src/content/hotel.json',
  location:   'src/content/location.json',
  prenota:    'src/content/prenota.json',
  clinica:    'src/content/clinica.json',
}

function ghRequest(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null
    const req = https.request({
      hostname: 'api.github.com', path, method,
      headers: {
        Authorization: `token ${token}`,
        'User-Agent': 'HotelSanMichele-CMS',
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v3+json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    }, res => {
      let raw = ''
      res.on('data', c => raw += c)
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }) }
        catch { resolve({ status: res.statusCode, body: raw }) }
      })
    })
    req.on('error', reject)
    if (data) req.write(data)
    req.end()
  })
}

async function getFileSha(filePath, token) {
  const res = await ghRequest('GET', `/repos/${REPO}/contents/${filePath}?ref=${BRANCH}`, null, token)
  if (res.status === 404) return null  // file nuovo, verrà creato
  if (res.status !== 200) throw new Error(`SHA error ${filePath}: ${res.status}`)
  return res.body.sha
}

async function commitFile(filePath, content, sha, token) {
  const base64 = Buffer.from(JSON.stringify(content, null, 2) + '\n').toString('base64')
  const body = {
    message: `CMS: aggiornamento contenuti — ${new Date().toLocaleString('it-IT')}`,
    content: base64, branch: BRANCH,
  }
  if (sha) body.sha = sha  // omesso per file nuovi
  const res = await ghRequest('PUT', `/repos/${REPO}/contents/${filePath}`, body, token)
  if (res.status !== 200 && res.status !== 201)
    throw new Error(`Commit failed ${filePath}: ${res.status}`)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const token    = process.env.GITHUB_TOKEN
  const password = process.env.EDITOR_PASSWORD
  if (!token || !password) return res.status(500).json({ error: 'Server non configurato' })

  try {
    let body = req.body
    if (typeof body === 'string') body = JSON.parse(body)
    const { password: pw, content } = body || {}
    if (pw !== password) return res.status(401).json({ error: 'Non autorizzato' })

    const errors = []
    for (const [key, filePath] of Object.entries(FILE_MAP)) {
      if (!content?.[key]) continue
      try {
        const sha = await getFileSha(filePath, token)
        await commitFile(filePath, content[key], sha, token)
      } catch (err) {
        errors.push(err.message)
      }
    }
    if (errors.length) return res.status(500).json({ error: errors.join('; ') })
    res.status(200).json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
