import https from 'https'

const SKIP_KEYS = new Set([
  'slug', 'href', 'img', 'image', 'photo', 'photos', 'icon', 'iconKey',
  'email', 'email_hotel', 'email_ristorante', 'phone', 'phone_href', 'piva',
  'instagram', 'facebook', 'privacy_href', 'cookie_href', 'src', 'tipo',
])

function isTranslatable(key, value) {
  if (typeof value !== 'string') return false
  const trimmed = value.trim()
  if (!trimmed) return false
  if (SKIP_KEYS.has(key)) return false
  if (/^https?:\/\//.test(trimmed) || trimmed.startsWith('/')) return false
  if (!/[a-zA-ZÀ-ÿ]/.test(trimmed)) return false
  return true
}

function collectStrings(obj, path, out) {
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => collectStrings(v, [...path, i], out))
  } else if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === 'string') {
        if (isTranslatable(k, v)) out.push({ path: [...path, k], text: v })
      } else {
        collectStrings(v, [...path, k], out)
      }
    }
  }
}

function setIn(obj, path, value) {
  let cur = obj
  for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]]
  cur[path[path.length - 1]] = value
}

function deeplRequest(texts, apiKey) {
  return new Promise((resolve, reject) => {
    const isFree = apiKey.trim().endsWith(':fx')
    const host = isFree ? 'api-free.deepl.com' : 'api.deepl.com'
    const params = new URLSearchParams()
    texts.forEach(t => params.append('text', t))
    params.append('source_lang', 'IT')
    params.append('target_lang', 'EN-US')
    const body = params.toString()
    const req = https.request({
      hostname: host,
      path: '/v2/translate',
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey.trim()}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body),
      },
    }, res => {
      let raw = ''
      res.on('data', c => raw += c)
      res.on('end', () => {
        try {
          const json = JSON.parse(raw)
          if (json.translations) resolve(json.translations.map(t => t.text))
          else reject(new Error(`DeepL error: ${raw}`))
        } catch (e) { reject(e) }
      })
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

/** Returns a deep-cloned copy of contentObj with every translatable string replaced by its English translation. */
export async function translateContentToEnglish(contentObj, apiKey = process.env.DEEPL_API_KEY) {
  if (!apiKey) throw new Error('DEEPL_API_KEY mancante')
  const clone = JSON.parse(JSON.stringify(contentObj))
  const items = []
  collectStrings(clone, [], items)
  if (!items.length) return clone

  const CHUNK = 50
  for (let i = 0; i < items.length; i += CHUNK) {
    const chunk = items.slice(i, i + CHUNK)
    const translations = await deeplRequest(chunk.map(c => c.text), apiKey)
    chunk.forEach((c, idx) => setIn(clone, c.path, translations[idx]))
  }
  return clone
}
