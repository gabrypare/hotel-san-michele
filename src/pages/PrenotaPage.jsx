import { useState } from 'react'
import { motion } from 'framer-motion'
import PageHero from '../components/ui/PageHero'
import ScrollReveal from '../components/ui/ScrollReveal'
import { RiMapPin2Line, RiPhoneLine, RiMailLine, RiTimeLine, RiCheckLine } from 'react-icons/ri'

const HERO_IMG = '/images/hotel-2.jpg'

const INIT = { nome: '', email: '', telefono: '', arrivo: '', partenza: '', ospiti: '2', tipo: 'camera', messaggio: '' }

export default function PrenotaPage() {
  const [form, setForm] = useState(INIT)
  const [sent, setSent] = useState(false)

  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const submit = e => {
    e.preventDefault()
    setSent(true)
    setForm(INIT)
  }

  return (
    <div className="bg-cream min-h-screen">
      <PageHero
        img={HERO_IMG}
        label="Siamo a tua disposizione"
        title="Prenota"
        titleItalic="o contattaci"
        subtitle="Risponderemo entro 24 ore"
        backLabel="Home"
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-5 gap-14">

          {/* ── INFO COLUMN ── */}
          <div className="lg:col-span-2">
            <ScrollReveal direction="left">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-6 h-px bg-gold/70" />
                <span className="section-label">Contatti</span>
              </div>
              <h2 className="font-serif text-3xl text-forest-dark mb-5 leading-tight">
                Prenota <span className="italic text-gold">direttamente</span> con noi
              </h2>
              <p className="font-sans text-sm text-charcoal/65 leading-relaxed mb-8">
                Contattandoci direttamente hai accesso alle migliori tariffe disponibili e a un servizio completamente personalizzato. Il nostro team è a disposizione per ogni esigenza.
              </p>

              <ul className="space-y-6">
                {[
                  { Icon: RiMapPin2Line, label: 'Indirizzo', content: 'Via S. Michele, 5a\n25050 Ome (BS) — Franciacorta' },
                  { Icon: RiPhoneLine,  label: 'Telefono',  link: 'tel:+390306527167',        content: '+39 030 652 7167' },
                  { Icon: RiMailLine,   label: 'Email',     link: 'mailto:info@sanmicheleome.it', content: 'info@sanmicheleome.it' },
                ].map(({ Icon, label, content, link }) => (
                  <li key={label} className="flex gap-4 items-start">
                    <div className="w-10 h-10 border border-gold/40 flex items-center justify-center shrink-0">
                      <Icon size={15} className="text-gold" />
                    </div>
                    <div>
                      <p className="font-sans text-[0.68rem] tracking-[0.22em] uppercase text-stone mb-1">{label}</p>
                      {link ? (
                        <a href={link} className="font-sans text-sm text-charcoal/80 hover:text-gold transition-colors duration-300 whitespace-pre-line">{content}</a>
                      ) : (
                        <p className="font-sans text-sm text-charcoal/80 whitespace-pre-line">{content}</p>
                      )}
                    </div>
                  </li>
                ))}
                <li className="flex gap-4 items-start">
                  <div className="w-10 h-10 border border-gold/40 flex items-center justify-center shrink-0">
                    <RiTimeLine size={15} className="text-gold" />
                  </div>
                  <div>
                    <p className="font-sans text-[0.68rem] tracking-[0.22em] uppercase text-stone mb-2">Orari</p>
                    <div className="space-y-1 font-sans text-sm text-charcoal/80">
                      <p>Reception: 07:00 – 22:00</p>
                      <p>Ristorante pranzo: 12:00 – 14:30</p>
                      <p>Ristorante cena: 19:30 – 22:00</p>
                      <p className="text-charcoal/45 text-xs mt-1">Chiuso il martedì</p>
                    </div>
                  </div>
                </li>
              </ul>

              {/* Why book direct */}
              <div className="mt-10 bg-forest-dark p-6">
                <p className="font-sans text-xs tracking-[0.22em] uppercase text-gold mb-4">Perché prenotare direttamente</p>
                <ul className="space-y-2">
                  {['Migliori tariffe garantite', 'Flessibilità totale sulla prenotazione', 'Preferenze e richieste speciali gestite direttamente', 'Check-in anticipato su richiesta'].map(v => (
                    <li key={v} className="flex items-start gap-2 font-sans text-sm text-cream/60">
                      <RiCheckLine size={14} className="text-gold mt-0.5 shrink-0" /> {v}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>

          {/* ── FORM ── */}
          <div className="lg:col-span-3">
            <ScrollReveal direction="right" delay={0.15}>
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="py-20 text-center"
                >
                  <div className="w-16 h-16 border border-gold flex items-center justify-center mx-auto mb-6">
                    <RiCheckLine size={28} className="text-gold" />
                  </div>
                  <h3 className="font-serif text-2xl text-forest-dark mb-3">Messaggio Inviato</h3>
                  <p className="font-sans text-sm text-charcoal/60 max-w-xs mx-auto">
                    Grazie! Ti risponderemo entro 24 ore all'indirizzo email indicato.
                  </p>
                  <button onClick={() => setSent(false)} className="btn-outline-dark mt-8">
                    Invia un'altra richiesta
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={submit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-sans text-[0.68rem] tracking-[0.22em] uppercase text-stone mb-2">Nome e Cognome *</label>
                      <input type="text" name="nome" value={form.nome} onChange={set} required placeholder="Mario Rossi"
                        className="w-full bg-transparent border border-charcoal/20 focus:border-gold outline-none px-4 py-3 font-sans text-sm text-charcoal placeholder-stone/60 transition-colors duration-300" />
                    </div>
                    <div>
                      <label className="block font-sans text-[0.68rem] tracking-[0.22em] uppercase text-stone mb-2">Email *</label>
                      <input type="email" name="email" value={form.email} onChange={set} required placeholder="mario@esempio.it"
                        className="w-full bg-transparent border border-charcoal/20 focus:border-gold outline-none px-4 py-3 font-sans text-sm text-charcoal placeholder-stone/60 transition-colors duration-300" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-sans text-[0.68rem] tracking-[0.22em] uppercase text-stone mb-2">Telefono</label>
                      <input type="tel" name="telefono" value={form.telefono} onChange={set} placeholder="+39 000 0000000"
                        className="w-full bg-transparent border border-charcoal/20 focus:border-gold outline-none px-4 py-3 font-sans text-sm text-charcoal placeholder-stone/60 transition-colors duration-300" />
                    </div>
                    <div>
                      <label className="block font-sans text-[0.68rem] tracking-[0.22em] uppercase text-stone mb-2">Tipo di richiesta</label>
                      <select name="tipo" value={form.tipo} onChange={set}
                        className="w-full bg-cream border border-charcoal/20 focus:border-gold outline-none px-4 py-3 font-sans text-sm text-charcoal transition-colors duration-300 cursor-pointer">
                        <option value="camera">Prenotazione camera</option>
                        <option value="ristorante">Prenotazione ristorante</option>
                        <option value="evento">Evento / Banchetto</option>
                        <option value="info">Informazioni generali</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-5">
                    <div>
                      <label className="block font-sans text-[0.68rem] tracking-[0.22em] uppercase text-stone mb-2">Arrivo</label>
                      <input type="date" name="arrivo" value={form.arrivo} onChange={set}
                        className="w-full bg-transparent border border-charcoal/20 focus:border-gold outline-none px-4 py-3 font-sans text-sm text-charcoal transition-colors duration-300" />
                    </div>
                    <div>
                      <label className="block font-sans text-[0.68rem] tracking-[0.22em] uppercase text-stone mb-2">Partenza</label>
                      <input type="date" name="partenza" value={form.partenza} onChange={set}
                        className="w-full bg-transparent border border-charcoal/20 focus:border-gold outline-none px-4 py-3 font-sans text-sm text-charcoal transition-colors duration-300" />
                    </div>
                    <div>
                      <label className="block font-sans text-[0.68rem] tracking-[0.22em] uppercase text-stone mb-2">Ospiti</label>
                      <input type="number" name="ospiti" value={form.ospiti} onChange={set} min="1" max="20"
                        className="w-full bg-transparent border border-charcoal/20 focus:border-gold outline-none px-4 py-3 font-sans text-sm text-charcoal transition-colors duration-300" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-sans text-[0.68rem] tracking-[0.22em] uppercase text-stone mb-2">Messaggio</label>
                    <textarea name="messaggio" value={form.messaggio} onChange={set} rows={5}
                      placeholder="Richieste speciali, allergie alimentari, preferenze di camera, occasioni speciali..."
                      className="w-full bg-transparent border border-charcoal/20 focus:border-gold outline-none px-4 py-3 font-sans text-sm text-charcoal placeholder-stone/60 transition-colors duration-300 resize-none" />
                  </div>

                  <div>
                    <button type="submit" className="btn-gold w-full sm:w-auto sm:px-14">Invia Richiesta</button>
                    <p className="font-sans text-[0.65rem] text-charcoal/35 mt-3">
                      I dati sono trattati ai sensi del GDPR (Reg. UE 2016/679). Non verranno condivisi con terze parti.
                    </p>
                  </div>
                </form>
              )}
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  )
}
