import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { translateContentToEnglish } from '../lib/deepl.js'

const FILES = [
  'menu', 'rooms', 'activities', 'gallery', 'settings', 'nav',
  'restaurant', 'home', 'hotel', 'location', 'prenota', 'clinica',
]

const apiKey = process.env.DEEPL_API_KEY
if (!apiKey) {
  console.error('Imposta DEEPL_API_KEY come variabile ambiente prima di eseguire questo script.')
  process.exit(1)
}

mkdirSync('src/content/en', { recursive: true })

for (const name of FILES) {
  const itPath = `src/content/${name}.json`
  const enPath = `src/content/en/${name}.json`
  const it = JSON.parse(readFileSync(itPath, 'utf8'))
  console.log(`Traduco ${name}...`)
  const en = await translateContentToEnglish(it, apiKey)
  writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n')
  console.log(`✓ ${enPath}`)
}

console.log('Fatto.')
