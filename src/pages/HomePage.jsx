import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import ScrollReveal from '../components/ui/ScrollReveal'
import { RiArrowRightLine } from 'react-icons/ri'

/* Real Hotel San Michele Ome photos */
const HERO_SLIDES = [
  { src: '/images/hotel-1.jpg', alt: 'Hotel San Michele — esterno' },
  { src: '/images/hotel-2.jpg', alt: 'Terrazza panoramica' },
  { src: '/images/hotel-3.jpg', alt: 'Hotel Ristorante San Michele' },
  { src: '/images/hotel-4.jpg', alt: 'Vista Franciacorta' },
]

/* Real Hotel San Michele Ome photos — served locally */
const SM1 = '/images/hotel-1.jpg'
const SM2 = '/images/hotel-2.jpg'
const SM3 = '/images/hotel-3.jpg'
const SM4 = '/images/hotel-4.jpg'

const POOL     = SM2
const REST_IMG = SM3
const FOOD_IMG = 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=900&q=90'
const HOTEL_EX = SM1
const LOC_IMG  = SM4
const CLINIC_IMG = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=90'

const GALLERY = [SM1, SM2, SM3, SM4, SM1]

export default function HomePage() {
  const [slide, setSlide] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [paused])

  return (
    <main className="bg-cream">

      {/* ── HERO CAROUSEL ──────────────────────────────────── */}
      <section
        className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Slides */}
        <AnimatePresence mode="sync">
          <motion.div
            key={slide}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1.08 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.1 }, scale: { duration: 8, ease: 'linear' } }}
          >
            <img
              src={HERO_SLIDES[slide].src}
              alt={HERO_SLIDES[slide].alt}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-b from-forest-deeper/65 via-forest-deeper/45 to-forest-deeper/80" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            className="flex items-center justify-center gap-4 mb-7"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.9 }}
          >
            <span className="w-10 h-px bg-gold" />
            <span className="section-label">Franciacorta · Ome · Brescia</span>
            <span className="w-10 h-px bg-gold" />
          </motion.div>

          <motion.h1
            className="font-serif text-5xl sm:text-7xl lg:text-8xl text-cream leading-[1.02] mb-6"
            initial={{ opacity: 0, y: 45 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Hotel Ristorante<br />
            <em className="not-italic" style={{ color: '#d4aa52' }}>San Michele</em>
          </motion.h1>

          <motion.p
            className="font-display italic text-xl sm:text-2xl text-cream/70 mb-12"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.95, duration: 0.9 }}
          >
            "Dove la storia della Franciacorta incontra l'eccellenza"
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.8 }}
          >
            <Link to="/hotel" className="btn-gold w-52 text-center">Scopri l'Hotel</Link>
            <Link to="/ristorante" className="btn-outline-light w-52 text-center">Il Ristorante</Link>
          </motion.div>
        </div>

        {/* Dot indicators */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className="cursor-pointer border-none bg-transparent p-1"
              aria-label={`Slide ${i + 1}`}
            >
              <span
                className={`block rounded-full transition-all duration-500 ${
                  i === slide ? 'w-7 h-1.5 bg-gold' : 'w-1.5 h-1.5 bg-cream/40 hover:bg-cream/70'
                }`}
              />
            </button>
          ))}
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 right-10 flex flex-col items-center gap-2 text-cream/45"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          <span className="font-sans text-[0.6rem] tracking-[0.35em] uppercase">Scorri</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}
            className="w-px h-8 bg-cream/40" />
        </motion.div>
      </section>

      {/* ── INTRO + STATS ─────────────────────────────────── */}
      <section className="py-24 bg-forest-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-6 h-px bg-gold opacity-70" />
                <span className="section-label">La nostra storia</span>
              </div>
              <h2 className="font-serif text-4xl lg:text-5xl text-cream mb-6 leading-tight">
                Nel cuore della <span className="italic text-gold-light">Franciacorta</span>
              </h2>
              <p className="font-sans text-base text-cream/65 leading-relaxed mb-5">
                Da oltre quarant'anni, il San Michele accoglie i propri ospiti tra i vigneti di Ome. Una struttura familiare dove il calore dell'ospitalità autentica si fonde con un'attenzione costante all'eccellenza: cucina del territorio, camere panoramiche, e la magia del paesaggio franciacortino.
              </p>
              <p className="font-sans text-base text-cream/65 leading-relaxed mb-8">
                Non semplicemente un albergo: un'esperienza nel cuore della denominazione spumantistica più prestigiosa d'Italia.
              </p>
              <Link to="/ristorante" className="btn-outline-light inline-flex items-center gap-2">
                Scopri la storia <RiArrowRightLine size={14} />
              </Link>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.2}>
              <div className="relative">
                <div className="img-zoom aspect-[4/5] overflow-hidden">
                  <img src={HOTEL_EX} alt="Hotel San Michele" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-2/3 h-2/3 border border-gold/25 -z-10" />
              </div>
            </ScrollReveal>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 divide-x divide-cream/10 border-t border-b border-cream/10 py-10">
            {[
              { n: '40+', l: 'Anni di ospitalità' },
              { n: '16',  l: 'Camere & suite' },
              { n: '120', l: 'Posti a sedere' },
            ].map((s, i) => (
              <ScrollReveal key={s.l} direction="up" delay={0.1 * i}>
                <div className="text-center px-6">
                  <p className="font-serif text-4xl lg:text-5xl text-gold mb-2">{s.n}</p>
                  <p className="font-sans text-[0.7rem] tracking-[0.22em] uppercase text-cream/40">{s.l}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3 ESPERIENZE CARDS ────────────────────────────── */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <ScrollReveal direction="fade">
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="w-8 h-px bg-gold/60" />
                <span className="section-label">Le esperienze</span>
                <span className="w-8 h-px bg-gold/60" />
              </div>
              <h2 className="font-serif text-4xl lg:text-5xl text-forest-dark">
                Cosa ti aspetta al <span className="italic text-gold">San Michele</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { img: HOTEL_EX,    label: '01', title: "L'Hotel",        desc: "16 camere con vista sui vigneti della Franciacorta. Colazione, piscina, terrazza panoramica.",    href: '/hotel',     cta: 'Vedi le camere' },
              { img: REST_IMG,    label: '02', title: 'Il Ristorante',  desc: "Cucina lombarda d'autore, ingredienti locali di stagione, carta dei vini Franciacorta DOCG.",       href: '/ristorante', cta: 'Scopri la storia' },
              { img: LOC_IMG,     label: '03', title: 'La Franciacorta', desc: "Vigneti, abbazie, Lago d'Iseo e Brescia. La Franciacorta è tutta da esplorare.",                 href: '/location',  cta: 'Esplora il territorio' },
              { img: CLINIC_IMG,  label: '04', title: 'La Clinica',     desc: "L'Istituto Clinico San Rocco di Ome — eccellenza medica a pochi passi dall'Hotel San Michele.",  href: '/clinica',   cta: 'Scopri la clinica' },
            ].map((c, i) => (
              <ScrollReveal key={c.label} direction="up" delay={0.12 * i}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="group relative overflow-hidden bg-forest-dark cursor-pointer"
                >
                  <div className="img-zoom aspect-[3/4] overflow-hidden">
                    <img src={c.img} alt={c.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-deeper/90 via-forest-deeper/30 to-transparent" />
                  <div className="absolute top-5 left-5">
                    <span className="font-sans text-[0.65rem] tracking-[0.3em] uppercase text-cream/40">{c.label}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-7">
                    <h3 className="font-serif text-2xl text-cream mb-2">{c.title}</h3>
                    <p className="font-sans text-sm text-cream/60 leading-relaxed mb-5">{c.desc}</p>
                    <Link
                      to={c.href}
                      className="inline-flex items-center gap-2 font-sans text-[0.72rem] tracking-[0.2em] uppercase text-gold border-b border-gold/40 pb-0.5 group-hover:border-gold transition-colors duration-300"
                    >
                      {c.cta} <RiArrowRightLine size={13} />
                    </Link>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MENU TEASER ───────────────────────────────────── */}
      <section className="relative overflow-hidden bg-forest">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px]">
          <div className="img-zoom overflow-hidden">
            <img src={FOOD_IMG} alt="Piatto del ristorante" className="w-full h-full object-cover min-h-[300px]" loading="lazy" />
          </div>
          <ScrollReveal direction="right" className="flex flex-col justify-center px-10 lg:px-16 py-16">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-6 h-px bg-gold opacity-70" />
              <span className="section-label">Cucina del territorio</span>
            </div>
            <h2 className="font-serif text-4xl lg:text-5xl text-cream mb-5 leading-tight">
              Il Menù <span className="italic text-gold-light">di Stagione</span>
            </h2>
            <p className="font-sans text-base text-cream/60 leading-relaxed mb-4">
              Risotto al Franciacorta DOCG, casoncelli alla bergamasca, filetto al tartufo, tiramisù artigianale. Un percorso nella tradizione lombarda interpretata con tecnica moderna.
            </p>
            <p className="font-sans text-sm text-cream/50 leading-relaxed mb-8">
              Tutti gli allergeni sono chiaramente indicati su ogni piatto secondo il Reg. UE 1169/2011. Il menù include anche la carta dei vini Franciacorta selezionati.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/menu" className="btn-gold inline-flex items-center gap-2">
                Vedi il Menù <RiArrowRightLine size={13} />
              </Link>
              <Link to="/prenota" className="btn-outline-light">
                Prenota un tavolo
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── GALLERY STRIP ─────────────────────────────────── */}
      <section className="py-24 bg-cream-dark overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-10">
          <ScrollReveal direction="fade">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-6 h-px bg-gold/60" />
                  <span className="section-label">Immagini</span>
                </div>
                <h2 className="font-serif text-3xl lg:text-4xl text-forest-dark">
                  Un assaggio del <span className="italic text-gold">San Michele</span>
                </h2>
              </div>
              <Link
                to="/galleria"
                className="hidden md:inline-flex items-center gap-2 font-sans text-xs tracking-[0.2em] uppercase text-forest hover:text-gold transition-colors duration-300"
              >
                Vedi tutta la galleria <RiArrowRightLine size={13} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
        <div className="flex gap-3 px-6 lg:px-10 overflow-x-auto pb-3 scrollbar-none">
          {GALLERY.map((src, i) => (
            <ScrollReveal key={i} direction="scale" delay={0.07 * i} className="shrink-0">
              <Link to="/galleria">
                <div className="img-zoom w-64 h-80 overflow-hidden">
                  <img src={src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
        <div className="mt-6 text-center md:hidden">
          <Link to="/galleria" className="btn-outline-dark">Vedi tutta la galleria</Link>
        </div>
      </section>

      {/* ── BOOK CTA ──────────────────────────────────────── */}
      <section className="relative py-28 overflow-hidden">
        <img src={POOL} alt="Terrazza San Michele" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-forest-deeper/80" />
        <ScrollReveal direction="scale" className="relative z-10 text-center max-w-2xl mx-auto px-6">
          <div className="flex items-center justify-center gap-4 mb-5">
            <span className="w-8 h-px bg-gold opacity-60" />
            <span className="section-label">Pronto a venirci a trovare?</span>
            <span className="w-8 h-px bg-gold opacity-60" />
          </div>
          <h2 className="font-serif text-4xl lg:text-5xl text-cream mb-5 leading-tight">
            Prenota il tuo <span className="italic text-gold-light">soggiorno</span>
          </h2>
          <p className="font-sans text-base text-cream/60 mb-10 leading-relaxed">
            Contattaci direttamente per le migliori tariffe disponibili. Il nostro team risponde entro 24 ore.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/prenota" className="btn-gold">Prenota Ora</Link>
            <a href="tel:+390306527167" className="btn-outline-light">+39 030 652 7167</a>
          </div>
        </ScrollReveal>
      </section>

    </main>
  )
}
