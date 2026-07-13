import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PageHero from '../components/ui/PageHero'
import ScrollReveal from '../components/ui/ScrollReveal'
import { RiArrowRightLine, RiMapPin2Line, RiCloseLine, RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri'
import activitiesJson from '../content/activities.json'

const HERO_IMG  = '/images/territorio-1.jpg'
const VINEYARD  = '/images/territorio-2.jpg'
const WINE_IMG  = 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=80'
const LAKE_IMG  = '/images/ome-veduta.jpg'

const DISTANCES = [
  { place: 'Brescia',         km: '15',  desc: 'Centro storico UNESCO, Piazza della Loggia, musei' },
  { place: "Lago d'Iseo",     km: '12',  desc: 'Terzo lago lombardo, Monte Isola, Lovere' },
  { place: 'Lago di Garda',   km: '45',  desc: "Il lago piÃ¹ grande d'Italia, Sirmione, Gardaland" },
  { place: 'Bergamo',         km: '40',  desc: 'CittÃ  alta medievale, Piazza Vecchia, Accademia Carrara' },
  { place: 'Milano',          km: '95',  desc: "Duomo, Navigli, moda e design â€” meno di un'ora" },
  { place: 'Aeroporto BGY',   km: '55',  desc: 'Aeroporto di Bergamo Orio al Serio, voli low-cost' },
]

const ACTIVITIES = activitiesJson.activities

export default function LocationPage() {
  const [selected, setSelected] = useState(null)
  const [carouselIdx, setCarouselIdx] = useState(0)
  const carouselTimer = useRef(null)

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setSelected(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (selected !== null) {
      const y = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${y}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
    } else {
      const y = parseInt(document.body.style.top || '0') * -1
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      if (y) window.scrollTo(0, y)
    }
    return () => {
      const y = parseInt(document.body.style.top || '0') * -1
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      if (y) window.scrollTo(0, y)
    }
  }, [selected])

  // Reset e avvia carosello quando cambia attivitÃ  selezionata
  useEffect(() => {
    setCarouselIdx(0)
    if (carouselTimer.current) clearInterval(carouselTimer.current)
    if (selected === null) return
    const imgs = ACTIVITIES[selected].imgs
    if (!imgs || imgs.length <= 1) return
    carouselTimer.current = setInterval(() => {
      setCarouselIdx(i => (i + 1) % imgs.length)
    }, 3200)
    return () => clearInterval(carouselTimer.current)
  }, [selected])

  const prev = () => setSelected(i => Math.max(0, i - 1))
  const next = () => setSelected(i => Math.min(ACTIVITIES.length - 1, i + 1))

  return (
    <div className="bg-cream">
      <PageHero
        img={HERO_IMG}
        label="Il territorio"
        title="La"
        titleItalic="Franciacorta"
        subtitle="Un territorio unico tra vigneti, laghi e storia"
        backLabel="Home"
      />

      {/* â”€â”€ INTRO â”€â”€ */}
      <section className="py-12 md:py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-6 h-px bg-gold/70" />
                <span className="section-label">La Franciacorta</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-forest-dark mb-6 leading-tight">
                Un paesaggio che <span className="italic text-gold">racconta storie</span>
              </h2>
              <p className="font-sans text-base text-charcoal/72 leading-relaxed mb-5">
                La Franciacorta Ã¨ una delle zone vinicole piÃ¹ affascinanti d'Italia: una distesa di colline dolci tra Brescia e il Lago d'Iseo, ricoperta di vigneti, attraversata da strade romantiche che collegano borghi medievali e abbazie benedettine.
              </p>
              <p className="font-sans text-base text-charcoal/72 leading-relaxed mb-5">
                Il nome evoca immediatamente le bollicine del Franciacorta DOCG â€” l'unico spumante italiano prodotto esclusivamente con Metodo Classico â€” ma il territorio offre molto di piÃ¹: natura, storia, arte e un'enogastronomia di altissimo livello.
              </p>
              <p className="font-sans text-base text-charcoal/72 leading-relaxed mb-8">
                Ome, il comune dove si trova il San Michele, Ã¨ uno dei borghi piÃ¹ caratteristici dei colli: posizione panoramica, vigneti a picco sulle case, silenzio e bellezza in ogni angolo.
              </p>
              <Link to="/prenota" className="btn-gold inline-flex items-center gap-2">
                Prenota il tuo soggiorno <RiArrowRightLine size={13} />
              </Link>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.15}>
              <div className="img-zoom aspect-[4/5] overflow-hidden">
                <img src={VINEYARD} alt="Vigneti Franciacorta" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* â”€â”€ FRANCIACORTA WINE â”€â”€ */}
      <section className="py-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[460px]">
          <div className="img-zoom overflow-hidden min-h-[280px]">
            <img src={WINE_IMG} alt="Franciacorta DOCG" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <ScrollReveal direction="right" className="flex flex-col justify-center px-10 lg:px-16 py-16 bg-forest-dark">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-6 h-px bg-gold/70" />
              <span className="section-label">Il vino del territorio</span>
            </div>
            <h2 className="font-serif text-4xl text-cream mb-5 leading-tight">
              Il <span className="italic text-gold-light">Franciacorta DOCG</span>
            </h2>
            <p className="font-sans text-base text-cream/65 leading-relaxed mb-4">
              Come lo Champagne in Francia, il Franciacorta Ã¨ il Metodo Classico italiano per eccellenza. Chardonnay, Pinot Nero e Pinot Bianco lavorati in cantina con una cura maniacale, per produrre bollicine eleganti, persistenti, di straordinaria complessitÃ .
            </p>
            <p className="font-sans text-sm text-cream/50 leading-relaxed mb-8">
              Su richiesta, il San Michele organizza visite e degustazioni nelle cantine piÃ¹ prestigiose della denominazione: Ca' del Bosco, Bellavista, Berlucchi, Cavalleri, Contadi Castaldi e molte altre.
            </p>
            <Link to="/menu" className="btn-outline-light inline-flex items-center gap-2 w-fit">
              Vedi la nostra carta vini <RiArrowRightLine size={13} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* â”€â”€ DISTANCES â”€â”€ */}
      <section className="py-12 md:py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <ScrollReveal direction="left">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-6 h-px bg-gold/70" />
                  <span className="section-label">Come raggiungerci</span>
                </div>
                <h2 className="font-serif text-3xl lg:text-4xl text-forest-dark mb-8 leading-tight">
                  Al centro di tutto, <span className="italic text-gold">distante da nulla</span>
                </h2>
                <p className="font-sans text-sm text-charcoal/60 mb-3 flex items-center gap-2">
                  <RiMapPin2Line className="text-gold" /> Via S. Michele, 5a Â· 25050 Ome (BS)
                </p>
              </ScrollReveal>
              <div className="divide-y divide-charcoal/8">
                {DISTANCES.map((d, i) => (
                  <ScrollReveal key={d.place} direction="left" delay={0.07 * i}>
                    <div className="flex items-center gap-6 py-4">
                      <span className="font-display italic text-2xl text-gold w-16 shrink-0 text-right">{d.km}<span className="text-sm not-italic text-stone"> km</span></span>
                      <div>
                        <p className="font-sans text-sm font-medium text-charcoal">{d.place}</p>
                        <p className="font-sans text-xs text-charcoal/50">{d.desc}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
            <ScrollReveal direction="right" delay={0.2}>
              <div className="relative">
                <div className="img-zoom aspect-[4/3] overflow-hidden mb-4">
                  <img src={LAKE_IMG} alt="Ome â€” veduta dal santuario di Cerezzata" className="w-full h-full object-cover object-center" loading="lazy" />
                </div>
                <div className="bg-forest-dark p-6">
                  <p className="font-sans text-xs tracking-widest uppercase text-gold mb-2">Come arrivare</p>
                  <ul className="space-y-2 font-sans text-sm text-cream/65">
                    <li><strong className="text-cream/80">In auto:</strong> A4 Milanoâ€“Venezia, uscita Ospitaletto o Rovato</li>
                    <li><strong className="text-cream/80">In treno:</strong> Stazione Brescia, poi autobus per Ome</li>
                    <li><strong className="text-cream/80">In aereo:</strong> Aeroporto di Bergamo (BGY) a 55 km</li>
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* â”€â”€ ACTIVITIES â”€â”€ */}
      <section className="py-12 md:py-20 bg-forest-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <ScrollReveal direction="fade">
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="w-8 h-px bg-gold/60" />
                <span className="section-label">Cosa fare</span>
                <span className="w-8 h-px bg-gold/60" />
              </div>
              <h2 className="font-serif text-4xl text-cream">
                Un territorio da <span className="italic text-gold-light">esplorare</span>
              </h2>
              <p className="font-sans text-sm text-cream/35 mt-3">Clicca su un'attivitÃ  per scoprire di piÃ¹</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ACTIVITIES.map((a, i) => (
              <ScrollReveal key={a.title} direction="up" delay={0.08 * i}>
                <button
                  onClick={() => setSelected(i)}
                  className="w-full text-left border border-cream/10 p-7 hover:border-gold/40 hover:bg-cream/4 transition-all duration-300 group cursor-pointer"
                >
                  <div className="text-3xl mb-4">{a.icon}</div>
                  <h3 className="font-serif text-lg text-gold-light mb-2 group-hover:text-gold transition-colors duration-300">{a.title}</h3>
                  <p className="font-sans text-sm text-cream/55 leading-relaxed mb-4">{a.desc}</p>
                  <span className="font-sans text-[0.65rem] tracking-[0.2em] uppercase text-gold/50 group-hover:text-gold transition-colors duration-300 inline-flex items-center gap-1.5">
                    Scopri di piÃ¹ <RiArrowRightLine size={11} />
                  </span>
                </button>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ MAP â”€â”€ */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <ScrollReveal direction="up">
            <h3 className="font-serif text-2xl text-forest-dark text-center mb-8">Dove siamo</h3>
            <iframe
              title="Hotel San Michele â€” Via S. Michele 5a, Ome (BS)"
              src="https://maps.google.com/maps?q=Via+S.+Michele%2C+5a%2C+25050+Ome+BS&output=embed&hl=it&z=16"
              width="100%" height="420"
              style={{ border: '1px solid rgba(42,34,24,0.12)', filter: 'grayscale(0.2) contrast(0.95)' }}
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </ScrollReveal>
        </div>
      </section>

      {/* â”€â”€ MODALE â”€â”€ */}
      <AnimatePresence>
        {selected !== null && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-50 bg-forest-deeper/85 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelected(null)}
            />

            {/* Wrapper centramento */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8" onClick={() => setSelected(null)}>
            {/* Panel â€” flex-col per vincolare l'altezza su mobile e desktop */}
            <motion.div
              className="relative w-full max-w-5xl bg-cream overflow-hidden shadow-2xl flex flex-col"
              style={{ maxHeight: '90vh' }}
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
            >
              {/* â”€â”€ CICLOTURISMO: immagine sx, testo dx, mappa sotto (scroll esterno) â”€â”€ */}
              {ACTIVITIES[selected]?.mapSrc ? (() => {
                const imgs = ACTIVITIES[selected].imgs || [ACTIVITIES[selected].img]
                return (
                  <div className="flex-1 min-h-0 overflow-y-auto">
                    {/* Riga superiore: immagine + testo */}
                    <div className="flex flex-col md:flex-row md:min-h-[360px]">

                      {/* Immagine â€” h fissa mobile, stretch desktop */}
                      <div className="relative overflow-hidden bg-forest-deeper h-52 md:h-auto md:w-[45%] shrink-0 group/car">
                        <AnimatePresence mode="sync">
                          <motion.img key={`${selected}-${carouselIdx}`} src={imgs[carouselIdx]}
                            alt={ACTIVITIES[selected].title}
                            className="w-full h-full object-cover absolute inset-0"
                            initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.7 }} />
                        </AnimatePresence>
                        <button onClick={() => { setCarouselIdx(i => (i - 1 + imgs.length) % imgs.length); clearInterval(carouselTimer.current) }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-forest-deeper/60 hover:bg-gold text-cream hover:text-forest-dark flex items-center justify-center transition-all duration-200 opacity-100 md:opacity-0 md:group-hover/car:opacity-100"
                        ><RiArrowLeftSLine size={20} /></button>
                        <button onClick={() => { setCarouselIdx(i => (i + 1) % imgs.length); clearInterval(carouselTimer.current) }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-forest-deeper/60 hover:bg-gold text-cream hover:text-forest-dark flex items-center justify-center transition-all duration-200 opacity-100 md:opacity-0 md:group-hover/car:opacity-100"
                        ><RiArrowRightSLine size={20} /></button>
                        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
                          {imgs.map((_, i) => (
                            <button key={i} onClick={() => { setCarouselIdx(i); clearInterval(carouselTimer.current) }}
                              className={`rounded-full transition-all duration-300 ${i === carouselIdx ? 'w-5 h-1.5 bg-gold' : 'w-1.5 h-1.5 bg-cream/40 hover:bg-cream/70'}`} />
                          ))}
                        </div>
                      </div>

                      {/* Testo */}
                      <div className="flex flex-col flex-1 p-5 sm:p-8 md:p-10 bg-cream">
                        <div className="flex items-start justify-between mb-5 shrink-0">
                          <div>
                            <span className="font-sans text-[0.62rem] tracking-[0.25em] uppercase text-gold/70 block mb-2">
                              {String(selected + 1).padStart(2, '0')} / {String(ACTIVITIES.length).padStart(2, '0')}
                            </span>
                            <h2 className="font-serif text-xl md:text-2xl text-forest-dark leading-tight">
                              {ACTIVITIES[selected].icon} {ACTIVITIES[selected].title}
                            </h2>
                          </div>
                          <button onClick={() => setSelected(null)}
                            className="ml-4 shrink-0 w-9 h-9 border border-charcoal/15 flex items-center justify-center text-charcoal/50 hover:border-charcoal/40 hover:text-charcoal transition-all duration-200"
                            aria-label="Chiudi"><RiCloseLine size={18} /></button>
                        </div>
                        <p className="font-sans text-sm text-charcoal/70 leading-relaxed mb-5">{ACTIVITIES[selected].detail}</p>
                        <div className="mb-5">
                          <p className="font-sans text-[0.62rem] tracking-[0.22em] uppercase text-gold mb-3">Percorsi consigliati</p>
                          <ul className="space-y-2">
                            {ACTIVITIES[selected].highlights.map(h => (
                              <li key={h} className="flex items-center gap-2.5 font-sans text-sm text-charcoal/70">
                                <span className="w-1 h-1 rounded-full bg-gold shrink-0" />{h}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-forest-dark/6 border-l-2 border-gold/50 pl-4 py-3 mb-5">
                          <p className="font-sans text-xs text-charcoal/55 italic leading-relaxed">{ACTIVITIES[selected].tip}</p>
                        </div>
                        <div className="shrink-0 pt-3 mt-auto border-t border-charcoal/8 flex items-center justify-between gap-2">
                          <button onClick={prev} disabled={selected === 0} className={`flex items-center gap-1 transition-colors duration-200 ${selected === 0 ? 'invisible pointer-events-none' : 'text-charcoal/45 hover:text-forest'}`}>
                            <RiArrowLeftSLine size={16} /><span className="font-sans text-[0.6rem] tracking-[0.12em] uppercase">Prec.</span>
                          </button>
                          <Link to="/prenota" onClick={() => setSelected(null)} className="inline-flex items-center gap-1.5 bg-gold hover:bg-gold-light text-forest-dark font-sans text-[0.65rem] tracking-[0.2em] uppercase px-4 py-2 transition-all duration-300">
                            Prenota <RiArrowRightLine size={10} />
                          </Link>
                          <button onClick={next} disabled={selected === ACTIVITIES.length - 1} className={`flex items-center gap-1 transition-colors duration-200 ${selected === ACTIVITIES.length - 1 ? 'invisible pointer-events-none' : 'text-charcoal/45 hover:text-forest'}`}>
                            <span className="font-sans text-[0.6rem] tracking-[0.12em] uppercase">Succ.</span><RiArrowRightSLine size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Mappa â€” full width, compare scorrendo */}
                    <div className="border-t border-charcoal/10">
                      <div className="px-6 py-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 bg-cream-dark border-b border-charcoal/8">
                        <span className="font-sans text-[0.58rem] tracking-[0.2em] uppercase text-charcoal/45">Legenda</span>
                        {[{ color: '#0077CC', label: 'Nazionali' }, { color: '#44A032', label: 'Regionali' }, { color: '#9B5DE5', label: 'Locali' }, { color: '#E05000', label: 'MTB' }].map(l => (
                          <div key={l.label} className="flex items-center gap-1.5">
                            <span className="w-5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: l.color }} />
                            <span className="font-sans text-[0.6rem] text-charcoal/55">{l.label}</span>
                          </div>
                        ))}
                      </div>
                      <iframe title="Percorsi in bici Franciacorta" src={ACTIVITIES[selected].mapSrc}
                        width="100%" height="380" style={{ border: 'none', display: 'block' }} loading="lazy" allowFullScreen />
                    </div>
                  </div>
                )
              })() : (() => {
                /* â”€â”€ MODAL STANDARD: flex-col/flex-row con nav fissa in fondo â”€â”€ */
                const act = ACTIVITIES[selected]
                const imgs = act.imgs || [act.img]
                const isCarousel = imgs.length > 1
                return (
                  <div className="flex flex-col md:flex-row flex-1 min-h-0">
                    {/* Immagine / Carosello */}
                    <div className="relative h-48 sm:h-56 md:h-auto md:w-[42%] shrink-0 overflow-hidden bg-forest-deeper group/car">
                      <AnimatePresence mode="sync">
                        <motion.img
                          key={`${selected}-${carouselIdx}`}
                          src={imgs[carouselIdx]}
                          alt={act.title}
                          className="w-full h-full object-cover absolute inset-0"
                          initial={{ opacity: 0, scale: 1.04 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.7 }}
                        />
                      </AnimatePresence>
                      {isCarousel && (
                        <>
                          <button onClick={() => { setCarouselIdx(i => (i - 1 + imgs.length) % imgs.length); clearInterval(carouselTimer.current) }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-forest-deeper/60 hover:bg-gold text-cream hover:text-forest-dark flex items-center justify-center transition-all duration-200 opacity-100 md:opacity-0 md:group-hover/car:opacity-100"
                          ><RiArrowLeftSLine size={20} /></button>
                          <button onClick={() => { setCarouselIdx(i => (i + 1) % imgs.length); clearInterval(carouselTimer.current) }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-forest-deeper/60 hover:bg-gold text-cream hover:text-forest-dark flex items-center justify-center transition-all duration-200 opacity-100 md:opacity-0 md:group-hover/car:opacity-100"
                          ><RiArrowRightSLine size={20} /></button>
                          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
                            {imgs.map((_, i) => (
                              <button key={i} onClick={() => { setCarouselIdx(i); clearInterval(carouselTimer.current) }}
                                className={`rounded-full transition-all duration-300 ${i === carouselIdx ? 'w-5 h-1.5 bg-gold' : 'w-1.5 h-1.5 bg-cream/40 hover:bg-cream/70'}`} />
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Contenuto â€” flex-1 per riempire lo spazio rimanente */}
                    <div className="flex flex-col flex-1 min-h-0 p-5 sm:p-8 md:p-10">
                      {/* Header fisso */}
                      <div className="shrink-0 flex items-start justify-between mb-5">
                        <div>
                          <span className="font-sans text-[0.62rem] tracking-[0.25em] uppercase text-gold/70 block mb-2">
                            {String(selected + 1).padStart(2, '0')} / {String(ACTIVITIES.length).padStart(2, '0')}
                          </span>
                          <AnimatePresence mode="wait">
                            <motion.h2 key={selected}
                              className="font-serif text-xl md:text-2xl text-forest-dark leading-tight"
                              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                              transition={{ duration: 0.25 }}>
                              {act.icon} {act.title}
                            </motion.h2>
                          </AnimatePresence>
                        </div>
                        <button onClick={() => setSelected(null)}
                          className="ml-4 shrink-0 w-9 h-9 border border-charcoal/15 flex items-center justify-center text-charcoal/50 hover:border-charcoal/40 hover:text-charcoal transition-all duration-200"
                          aria-label="Chiudi"><RiCloseLine size={18} /></button>
                      </div>

                      {/* Testo scrollabile â€” prende tutto lo spazio rimasto */}
                      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                        <AnimatePresence mode="wait">
                          <motion.div key={selected}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.25, delay: 0.05 }}>
                            <p className="font-sans text-sm text-charcoal/70 leading-relaxed mb-5">{act.detail}</p>
                            <div className="mb-5">
                              <p className="font-sans text-[0.62rem] tracking-[0.22em] uppercase text-gold mb-3">Da non perdere</p>
                              <ul className="space-y-2">
                                {act.highlights.map(h => (
                                  <li key={h} className="flex items-center gap-2.5 font-sans text-sm text-charcoal/70">
                                    <span className="w-1 h-1 rounded-full bg-gold shrink-0" />{h}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-forest-dark/6 border-l-2 border-gold/50 pl-4 py-3">
                              <p className="font-sans text-xs text-charcoal/55 italic leading-relaxed">{act.tip}</p>
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      {/* Nav sempre visibile in fondo */}
                      <div className="shrink-0 pt-3 mt-3 border-t border-charcoal/8 flex items-center justify-between gap-2">
                        <button onClick={prev} disabled={selected === 0} className={`flex items-center gap-1 transition-colors duration-200 ${selected === 0 ? 'invisible pointer-events-none' : 'text-charcoal/45 hover:text-forest'}`}>
                          <RiArrowLeftSLine size={16} /><span className="font-sans text-[0.6rem] tracking-[0.12em] uppercase">Prec.</span>
                        </button>
                        <Link to="/prenota" onClick={() => setSelected(null)}
                          className="inline-flex items-center gap-1.5 bg-gold hover:bg-gold-light text-forest-dark font-sans text-[0.65rem] tracking-[0.2em] uppercase px-4 py-2 transition-all duration-300">
                          Prenota <RiArrowRightLine size={10} />
                        </Link>
                        <button onClick={next} disabled={selected === ACTIVITIES.length - 1} className={`flex items-center gap-1 transition-colors duration-200 ${selected === ACTIVITIES.length - 1 ? 'invisible pointer-events-none' : 'text-charcoal/45 hover:text-forest'}`}>
                          <span className="font-sans text-[0.6rem] tracking-[0.12em] uppercase">Succ.</span><RiArrowRightSLine size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
