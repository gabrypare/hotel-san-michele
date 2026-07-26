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

function fetchFile(filePath, token) {
  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.github.com',
      path: `/repos/${REPO}/contents/${filePath}?ref=${BRANCH}`,
      method: 'GET',
      headers: {
        Authorization: `token ${token}`,
        'User-Agent': 'HotelSanMichele-CMS',
        Accept: 'application/vnd.github.v3+json',
      },
    }, res => {
      let raw = ''
      res.on('data', c => raw += c)
      res.on('end', () => {
        try {
          const body = JSON.parse(raw)
          resolve(JSON.parse(Buffer.from(body.content, 'base64').toString('utf8')))
        } catch { resolve(null) }
      })
    })
    req.on('error', () => resolve(null))
    req.end()
  })
}

export default async function handler(req, res) {
  const token = process.env.GITHUB_TOKEN
  if (!token) return res.status(500).json({ error: 'No token' })

  try {
    const entries = await Promise.all(
      Object.entries(FILE_MAP).map(async ([key, path]) => {
        const data = await fetchFile(path, token)
        return data ? [key, data] : null
      })
    )
    const result = {}
    entries.forEach(e => { if (e) result[e[0]] = e[1] })
    res.setHeader('Cache-Control', 'no-store')
    res.status(200).json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
