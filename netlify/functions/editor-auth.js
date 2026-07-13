exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405 }

  const { password } = JSON.parse(event.body || '{}')
  const correct = process.env.EDITOR_PASSWORD

  if (!correct) return { statusCode: 500, body: JSON.stringify({ error: 'Server non configurato' }) }
  if (password !== correct) return { statusCode: 401, body: JSON.stringify({ error: 'Password errata' }) }

  return { statusCode: 200, body: JSON.stringify({ ok: true }) }
}
