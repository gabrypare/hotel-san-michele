const https = require('https')

const REPO   = 'gabrypare/hotel-san-michele'
const BRANCH = 'main'

const FILE_MAP = {
  menu:       'src/content/menu.json',
  rooms:      'src/content/rooms.json',
  activities: 'src/content/activities.json',
  gallery:    'src/content/gallery.json',
  settings:   'src/content/settings.json',
  nav:        'src/content/nav.json',
}

function ghRequest(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null
    const req = https.request({
      hostname: 'api.github.com',
      path,
      method,
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
  if (res.status !== 200) throw new Error(`Cannot get SHA for ${filePath}: ${res.status}`)
  return res.body.sha
}

async function commitFile(filePath, content, sha, token) {
  const base64 = Buffer.from(JSON.stringify(content, null, 2) + '\n').toString('base64')
  const res = await ghRequest('PUT', `/repos/${REPO}/contents/${filePath}`, {
    message: `CMS: aggiornamento contenuti — ${new Date().toLocaleString('it-IT')}`,
    content: base64,
    sha,
    branch: BRANCH,
  }, token)
  if (res.status !== 200 && res.status !== 201) {
    throw new Error(`Commit failed for ${filePath}: ${res.status} ${JSON.stringify(res.body)}`)
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405 }

  const token    = process.env.GITHUB_TOKEN
  const password = process.env.EDITOR_PASSWORD

  if (!token || !password) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server non configurato' }) }
  }

  let payload
  try { payload = JSON.parse(event.body) } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'JSON non valido' }) }
  }

  if (payload.password !== password) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Non autorizzato' }) }
  }

  const content = payload.content
  const errors  = []

  for (const [key, filePath] of Object.entries(FILE_MAP)) {
    if (!content[key]) continue
    try {
      const sha = await getFileSha(filePath, token)
      await commitFile(filePath, content[key], sha, token)
    } catch (err) {
      errors.push(`${key}: ${err.message}`)
    }
  }

  if (errors.length > 0) {
    return { statusCode: 500, body: JSON.stringify({ error: errors.join('; ') }) }
  }

  return { statusCode: 200, body: JSON.stringify({ ok: true }) }
}
