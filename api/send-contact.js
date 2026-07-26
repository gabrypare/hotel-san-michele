import nodemailer from 'nodemailer'

const HOTEL_EMAIL      = 'hotelsanmicheleome@gmail.com'
const RISTORANTE_EMAIL = 'ristorantesanmicheleome@gmail.com'

const TIPO_LABELS = {
  camera:     'Prenotazione camera',
  ristorante: 'Prenotazione ristorante',
  evento:     'Evento / Banchetto',
  info:       'Informazioni generali',
}

const VALID_TIPI = Object.keys(TIPO_LABELS)

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function row(label, value) {
  if (!value) return ''
  return `
    <tr>
      <td style="padding:8px 0;color:#888;font-size:13px;width:140px;vertical-align:top">${label}</td>
      <td style="padding:8px 0;color:#2a2218;font-size:14px;vertical-align:top">${escapeHtml(value)}</td>
    </tr>`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { nome, email, telefono, arrivo, partenza, ospiti, tipo, messaggio } = req.body ?? {}

  /* ── basic validation ── */
  if (!nome || !email || !tipo) return res.status(400).json({ error: 'Campi obbligatori mancanti' })
  if (!VALID_TIPI.includes(tipo))  return res.status(400).json({ error: 'Tipo non valido' })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Email non valida' })

  /* ── routing ── */
  const toEmail   = (tipo === 'camera' || tipo === 'info') ? HOTEL_EMAIL : RISTORANTE_EMAIL
  const tipoLabel = TIPO_LABELS[tipo]

  /* ── transporter (account diverso per hotel / ristorante) ── */
  const isRistorante = tipo === 'ristorante' || tipo === 'evento'
  const gmailUser = isRistorante ? process.env.GMAIL_USER_RISTORANTE : process.env.GMAIL_USER
  const gmailPass = isRistorante ? process.env.GMAIL_APP_PASSWORD_RISTORANTE : process.env.GMAIL_APP_PASSWORD

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user: gmailUser, pass: gmailPass },
  })

  /* ── email to hotel / restaurant ── */
  const hotelHtml = `
<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px;background:#fff">
  <div style="border-bottom:2px solid #C9A96E;padding-bottom:16px;margin-bottom:24px">
    <p style="margin:0;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#C9A96E">Hotel Ristorante San Michele</p>
    <h2 style="margin:8px 0 0;color:#2a2218;font-size:20px">Nuova richiesta — ${tipoLabel}</h2>
  </div>
  <table style="width:100%;border-collapse:collapse">
    ${row('Nome', nome)}
    ${row('Email', email)}
    ${row('Telefono', telefono)}
    ${row('Arrivo', arrivo)}
    ${row('Partenza', partenza)}
    ${ospiti ? row('Ospiti', ospiti) : ''}
  </table>
  ${messaggio ? `
  <div style="margin-top:20px;padding:16px;background:#f7f2e8;border-left:3px solid #C9A96E">
    <p style="margin:0 0 8px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#888">Messaggio</p>
    <p style="margin:0;color:#2a2218;font-size:14px;line-height:1.6">${escapeHtml(messaggio).replace(/\n/g, '<br>')}</p>
  </div>` : ''}
  <p style="margin-top:28px;font-size:11px;color:#bbb">
    Risposta rapida: <a href="mailto:${escapeHtml(email)}" style="color:#C9A96E">${escapeHtml(email)}</a>
    ${telefono ? ` · <a href="tel:${escapeHtml(telefono)}" style="color:#C9A96E">${escapeHtml(telefono)}</a>` : ''}
  </p>
</div>`

  /* ── confirmation email to guest ── */
  const firstName = escapeHtml(nome.split(' ')[0])
  const guestHtml = `
<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px;background:#fff">
  <div style="border-bottom:2px solid #C9A96E;padding-bottom:16px;margin-bottom:24px">
    <p style="margin:0;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#C9A96E">Hotel Ristorante San Michele</p>
    <h2 style="margin:8px 0 0;color:#2a2218;font-size:20px">Grazie, ${firstName}!</h2>
  </div>
  <p style="color:#555;line-height:1.7;font-size:15px">
    Abbiamo ricevuto la tua richiesta di <strong>${tipoLabel.toLowerCase()}</strong>.<br>
    Ti risponderemo entro <strong>24 ore</strong> all'indirizzo <strong>${escapeHtml(email)}</strong>.
  </p>
  <div style="margin:24px 0;padding:16px;background:#f7f2e8;border-left:3px solid #C9A96E">
    <p style="margin:0 0 4px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#888">Per contattarci direttamente</p>
    <p style="margin:0;font-size:14px;color:#2a2218;line-height:1.8">
      <a href="tel:+390306527167" style="color:#C9A96E;text-decoration:none">+39 030 652 7167</a><br>
      <a href="mailto:info@sanmicheleome.it" style="color:#C9A96E;text-decoration:none">info@sanmicheleome.it</a>
    </p>
  </div>
  <p style="margin-top:28px;font-size:11px;color:#bbb">
    Hotel Ristorante San Michele · Via S. Michele, 5a · 25050 Ome (BS) · Franciacorta
  </p>
</div>`

  try {
    await transporter.sendMail({
      from:    `"San Michele — Sito Web" <${gmailUser}>`,
      to:      toEmail,
      replyTo: email,
      subject: `[${tipoLabel}] ${nome}`,
      html:    hotelHtml,
    })

    await transporter.sendMail({
      from:    `"Hotel Ristorante San Michele" <${gmailUser}>`,
      to:      email,
      subject: 'Abbiamo ricevuto la tua richiesta — Hotel San Michele',
      html:    guestHtml,
    })

    res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Email error:', err.message, '| code:', err.code, '| response:', err.response)
    res.status(500).json({ error: 'Invio fallito. Riprova o contattaci telefonicamente.' })
  }
}
