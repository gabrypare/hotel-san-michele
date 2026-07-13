import { useState } from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from '../ui/ScrollReveal'
import { RiMapPin2Line, RiPhoneLine, RiMailLine, RiTimeLine } from 'react-icons/ri'

const INITIAL = {
  nome: '', email: '', telefono: '',
  arrivo: '', partenza: '', ospiti: '2',
  tipo: 'camera', messaggio: '',
}

export default function ContactSection() {
  const [form, setForm] = useState(INITIAL)
  const [sent, setSent] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const handleSubmit = e => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 5000)
    setForm(INITIAL)
  }

  return (
    <section id="contatti" className="bg-cream section-py">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="text-center mb-14">
          <ScrollReveal direction="fade">
            <div className="flex items-center justify-center gap-4 mb-5">
              <span className="w-8 h-px bg-gold opacity-60" />
              <span className="font-sans text-[0.68rem] tracking-[0.35em] uppercase text-gold">
                Siamo a tua disposizione
              </span>
              <span className="w-8 h-px bg-gold opacity-60" />
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.1}>
            <h2 className="font-serif text-4xl lg:text-5xl text-forest-dark">
              Prenota o<br />
              <span className="italic text-gold">Contattaci</span>
            </h2>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">

          {/* Info column */}
          <div className="lg:col-span-2">
            <ScrollReveal direction="left" delay={0.1}>
              <p className="font-sans text-sm text-charcoal/70 leading-relaxed mb-8">
                Prenota direttamente con noi per un servizio personalizzato e le migliori tariffe disponibili. Il nostro team risponde entro 24 ore.
              </p>

              <ul className="space-y-6">
                <li className="flex gap-4 items-start">
                  <div className="w-10 h-10 border border-gold/40 flex items-center justify-center shrink-0">
                    <RiMapPin2Line size={16} className="text-gold" />
                  </div>
                  <div>
                    <p className="font-sans text-xs tracking-[0.2em] uppercase text-stone mb-1">Indirizzo</p>
                    <p className="font-sans text-sm text-charcoal/80">Via S. Michele 5<br />25050 Ome (BS) — Franciacorta</p>
                  </div>
                </li>
                <li className="flex gap-4 items-center">
                  <div className="w-10 h-10 border border-gold/40 flex items-center justify-center shrink-0">
                    <RiPhoneLine size={16} className="text-gold" />
                  </div>
                  <div>
                    <p className="font-sans text-xs tracking-[0.2em] uppercase text-stone mb-1">Telefono</p>
                    <a href="tel:+390306527167" className="font-sans text-sm text-charcoal/80 hover:text-gold transition-colors duration-300">
                      +39 030 652 7167
                    </a>
                  </div>
                </li>
                <li className="flex gap-4 items-center">
                  <div className="w-10 h-10 border border-gold/40 flex items-center justify-center shrink-0">
                    <RiMailLine size={16} className="text-gold" />
                  </div>
                  <div>
                    <p className="font-sans text-xs tracking-[0.2em] uppercase text-stone mb-1">Email</p>
                    <a href="mailto:info@sanmicheleome.it" className="font-sans text-sm text-charcoal/80 hover:text-gold transition-colors duration-300">
                      info@sanmicheleome.it
                    </a>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="w-10 h-10 border border-gold/40 flex items-center justify-center shrink-0">
                    <RiTimeLine size={16} className="text-gold" />
                  </div>
                  <div>
                    <p className="font-sans text-xs tracking-[0.2em] uppercase text-stone mb-1">Orari</p>
                    <div className="font-sans text-sm text-charcoal/80 space-y-0.5">
                      <p>Reception: 07:00 – 22:00</p>
                      <p>Ristorante: 12:00–14:30 · 19:30–22:00</p>
                      <p className="text-charcoal/50 text-xs">Chiuso il martedì</p>
                    </div>
                  </div>
                </li>
              </ul>
            </ScrollReveal>
          </div>

          {/* Form */}
          <ScrollReveal direction="right" delay={0.15} className="lg:col-span-3">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-16"
              >
                <div className="w-14 h-14 border border-gold flex items-center justify-center mb-5">
                  <span className="text-gold text-2xl">✓</span>
                </div>
                <h3 className="font-serif text-2xl text-forest-dark mb-3">Messaggio Inviato</h3>
                <p className="font-sans text-sm text-charcoal/65 max-w-xs">
                  Grazie! Il nostro team ti risponderà entro 24 ore all'indirizzo email indicato.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-sans text-[0.68rem] tracking-[0.2em] uppercase text-stone mb-2">
                      Nome e Cognome *
                    </label>
                    <input
                      type="text" name="nome" value={form.nome}
                      onChange={handleChange} required
                      placeholder="Mario Rossi"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[0.68rem] tracking-[0.2em] uppercase text-stone mb-2">
                      Email *
                    </label>
                    <input
                      type="email" name="email" value={form.email}
                      onChange={handleChange} required
                      placeholder="mario@esempio.it"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-sans text-[0.68rem] tracking-[0.2em] uppercase text-stone mb-2">
                      Telefono
                    </label>
                    <input
                      type="tel" name="telefono" value={form.telefono}
                      onChange={handleChange}
                      placeholder="+39 000 0000000"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[0.68rem] tracking-[0.2em] uppercase text-stone mb-2">
                      Tipo di richiesta
                    </label>
                    <select
                      name="tipo" value={form.tipo}
                      onChange={handleChange}
                      className="form-input"
                    >
                      <option value="camera">Prenotazione camera</option>
                      <option value="ristorante">Prenotazione ristorante</option>
                      <option value="evento">Evento / Banchetto</option>
                      <option value="info">Informazioni generali</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block font-sans text-[0.68rem] tracking-[0.2em] uppercase text-stone mb-2">
                      Data arrivo
                    </label>
                    <input
                      type="date" name="arrivo" value={form.arrivo}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[0.68rem] tracking-[0.2em] uppercase text-stone mb-2">
                      Data partenza
                    </label>
                    <input
                      type="date" name="partenza" value={form.partenza}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[0.68rem] tracking-[0.2em] uppercase text-stone mb-2">
                      N° ospiti
                    </label>
                    <input
                      type="number" name="ospiti" value={form.ospiti}
                      onChange={handleChange} min="1" max="20"
                      className="form-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-[0.68rem] tracking-[0.2em] uppercase text-stone mb-2">
                    Messaggio
                  </label>
                  <textarea
                    name="messaggio" value={form.messaggio}
                    onChange={handleChange} rows={4}
                    placeholder="Scrivi qui le tue richieste speciali, intolleranze alimentari, preferenze di camera..."
                    className="form-input resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button type="submit" className="btn-gold w-full sm:w-auto sm:px-12">
                    Invia Richiesta
                  </button>
                  <p className="font-sans text-[0.65rem] text-charcoal/40 mt-3">
                    I dati sono trattati ai sensi del GDPR (Reg. UE 2016/679). Non verranno condivisi con terze parti.
                  </p>
                </div>
              </form>
            )}
          </ScrollReveal>
        </div>

        {/* Map placeholder */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="mt-14">
            <iframe
              title="Posizione Hotel San Michele, Ome"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2784.9!2d10.059!3d45.626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4781da9a6cdc9b3b%3A0x1234567890abcdef!2sOme%2C%20BS!5e0!3m2!1sit!2sit!4v1700000000000"
              width="100%" height="320"
              style={{ border: '1px solid rgba(30,61,39,0.15)', filter: 'grayscale(0.3) contrast(0.9)' }}
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
