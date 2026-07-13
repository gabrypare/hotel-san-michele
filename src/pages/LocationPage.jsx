import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PageHero from '../components/ui/PageHero'
import ScrollReveal from '../components/ui/ScrollReveal'
import { RiArrowRightLine, RiMapPin2Line, RiCloseLine, RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri'

const HERO_IMG  = '/images/territorio-1.jpg'
const VINEYARD  = '/images/territorio-2.jpg'
const WINE_IMG  = 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=80'
const LAKE_IMG  = '/images/ome-veduta.jpg'

const DISTANCES = [
  { place: 'Brescia',         km: '15',  desc: 'Centro storico UNESCO, Piazza della Loggia, musei' },
  { place: "Lago d'Iseo",     km: '12',  desc: 'Terzo lago lombardo, Monte Isola, Lovere' },
  { place: 'Lago di Garda',   km: '45',  desc: "Il lago più grande d'Italia, Sirmione, Gardaland" },
  { place: 'Bergamo',         km: '40',  desc: 'Città alta medievale, Piazza Vecchia, Accademia Carrara' },
  { place: 'Milano',          km: '95',  desc: "Duomo, Navigli, moda e design — meno di un'ora" },
  { place: 'Aeroporto BGY',   km: '55',  desc: 'Aeroporto di Bergamo Orio al Serio, voli low-cost' },
]

const ACTIVITIES = [
  {
    icon: '🍾',
    title: 'Degustazioni Franciacorta',
    desc: 'Oltre 60 cantine in Franciacorta, visite con degustazione su prenotazione.',
    imgs: [
      '/images/territorio-4.jpg',
      '/images/cantina-1.jpg',
      '/images/cantina-2.jpg',
      '/images/territorio-1.jpg',
      '/images/cantina-3.jpg',
      '/images/cantina-4.jpg',
      '/images/cantina-5.jpg',
      '/images/territorio-2.jpg',
    ],
    detail: 'La Franciacorta conta oltre 60 cantine, tutte aperte a visite guidate con degustazione su prenotazione. Il Franciacorta DOCG è l\'unico spumante italiano prodotto esclusivamente con Metodo Classico: Chardonnay, Pinot Nero e Pinot Bianco rifermentati in bottiglia per almeno 18 mesi. Le cantine offrono percorsi tra vigne e barricaie, degustazioni delle diverse tipologie — Satèn, Rosé, Millesimato, Riserva — con abbinamenti gastronomici al territorio.',
    highlights: ["Ca' del Bosco — Erbusco", 'Bellavista — Erbusco', 'Berlucchi — Borgonato', 'Cavalleri — Erbusco', 'Contadi Castaldi', 'Ferghettina — Adro'],
    tip: 'L\'Hotel San Michele può organizzare visite in cantina su prenotazione per i propri ospiti.',
  },
  {
    icon: '⛵',
    title: "Lago d'Iseo",
    desc: "Montisola, Iseo, Lovere: borghi, gite e sport acquatici a 12 km dall'hotel.",
    imgs: [
      '/images/lago-panorama.jpg',
      '/images/montisola-siviano.jpg',
      '/images/isola-loreto.jpg',
      '/images/lago-kayak.jpg',
      '/images/lago-sup.jpg',
      '/images/lago-windsurf.jpg',
      '/images/lago-barca.jpg',
    ],
    detail: "Il Lago d'Iseo è a soli 12 km dall'Hotel San Michele — circa 15 minuti in auto. Al centro del lago sorge Monte Isola, la più grande isola lacustre d'Europa abitata, raggiungibile in traghetto da Sulzano o Sale Marasino. I borghi di Iseo, Lovere e Sarnico meritano tutti una visita. Le gite e le attività acquatiche non sono organizzate dall'hotel, ma sono facilmente prenotabili direttamente una volta sul posto o online.",
    highlights: [
      'Monte Isola in traghetto da Sulzano (10 min)',
      'Borghi di Iseo, Lovere, Sarnico e Pisogne',
      'Kayak e canoa sul lago',
      'Stand Up Paddle (SUP)',
      'Windsurf e kitesurf',
      'Vela e noleggio imbarcazioni',
      'Diving e immersioni',
      'Pesca sportiva e canottaggio',
    ],
    tip: 'Traghetti e battelli: navigazionelagoiseo.it — servizio attivo tutto l\'anno con corse frequenti.',
  },
  {
    icon: '🚴',
    title: 'Cicloturismo',
    desc: 'Piste ciclabili tra i vigneti della Franciacorta, percorsi collinari panoramici.',
    imgs: [
      '/images/ciclovia-franciacorta.jpg',
      '/images/ciclovia-erbusco.jpg',
      '/images/ciclovia-sentiero-1.jpg',
      '/images/ciclovia-sentiero-2.jpg',
      '/images/ciclovia-colli.jpg',
      '/images/territorio-4.jpg',
      '/images/territorio-2.jpg',
    ],
    detail: 'La Franciacorta è uno dei territori più belli d\'Italia per il cicloturismo: strade secondarie tra filari di vite, salite sui colli con vista sul lago e sulle Alpi, percorsi dedicati e segnalati. La Ciclovia della Franciacorta collega i principali borghi della denominazione attraverso paesaggi di rara bellezza. I sentieri partono praticamente dall\'hotel e sono percorribili tutto l\'anno.',
    highlights: ['Ciclovia della Franciacorta (anello completo ~60 km)', 'Percorsi brevi tra Ome, Gussago e Rodengo (~15–25 km)', 'Salita ai colli con vista su lago e Alpi', 'Varianti per e-bike e mountain bike', 'Strade secondarie senza traffico tra i vigneti'],
    tip: 'Chiedi alla reception per mappe cartacee gratuite e consigli sui percorsi più adatti al tuo livello.',
    mapSrc: 'https://www.openstreetmap.org/export/embed.html?bbox=9.85%2C45.45%2C10.42%2C45.82&layer=cyclemap&marker=45.6442%2C10.1247',
  },
  {
    icon: '⛪',
    title: 'Abbazie e Borghi',
    desc: 'L\'Abbazia Olivetana di Rodengo Saiano, i borghi di Erbusco, Paratico e Capriolo.',
    imgs: [
      '/images/abbazia-chiesa.jpg',
      '/images/abbazia-chiostro-grande.jpg',
      '/images/abbazia-chiostro-piccolo.jpg',
      '/images/abbazia-chiostro-cisterna.jpg',
      '/images/erbusco-borgo.jpg',
      '/images/paratico-castello.jpg',
      '/images/paratico-lago.jpg',
    ],
    detail: 'La Franciacorta custodisce un patrimonio storico e religioso straordinario. L\'Abbazia Olivetana di San Nicola a Rodengo Saiano — fondata nell\'XI secolo da monaci cluniacensi e affidata agli Olivetani nel 1446 — è uno dei monasteri più belli della Lombardia: tre chiostri, affreschi del Romanino e del Moretto, tarsie lignee del Quattrocento. I borghi medievali di Erbusco, Paratico e Capriolo completano un territorio dove ogni vicolo racconta secoli di storia.',
    highlights: [
      'Abbazia Olivetana di San Nicola — Rodengo Saiano (XI sec.)',
      'Tre chiostri con affreschi di Romanino e Moretto',
      'Borgo medievale di Erbusco — capitale della Franciacorta',
      'Castello Lantieri di Paratico (XIII–XIV sec.) sul Lago d\'Iseo',
      'Santuario della Madonna di Cerezzata — Ome',
      'Capriolo e il suo centro storico sull\'Oglio',
    ],
    tip: 'L\'Abbazia di Rodengo Saiano è visitabile la mattina; visite guidate su prenotazione. Distanza dall\'hotel: ~5 min in auto.',
  },
  {
    icon: '🌿',
    title: 'Siti Naturalistici',
    desc: 'Le Torbiere del Sebino, le Cascate di Monticelli Brusati e il Parco dell\'Alto Sebino.',
    imgs: [
      '/images/torbiere-san-pietro.jpg',
      '/images/torbiere-panorama.jpg',
      '/images/torbiere-ninfee.jpg',
      '/images/torbiere-tramonto.jpg',
      '/images/cascata-gaina-1.jpg',
      '/images/cascata-gaina-2.jpg',
      '/images/alto-sebino-lovere.jpg',
      '/images/alto-sebino-lago.jpg',
    ],
    detail: 'Il territorio intorno all\'Hotel San Michele custodisce tre gioielli naturalistici di straordinario valore. Le Torbiere del Sebino — Riserva Naturale e Zona di Protezione Speciale europea — sono una delle zone umide più importanti della Lombardia, con la chiesa romanica di San Pietro in Lamosa che sorge sull\'acqua tra canneti e ninfee. Le Cascate di Gaina a Monticelli Brusati sono raggiungibili con un\'escursione nel canyon scavato dal torrente Gaina. Il Parco dell\'Alto Sebino, il più grande parco locale della Lombardia, si estende dai 183 m del Lago d\'Iseo fino ai 1.880 m del Monte Pora.',
    highlights: [
      'Torbiere del Sebino — Riserva Naturale, a 10 km dall\'hotel',
      'San Pietro in Lamosa — chiesa romanica sull\'acqua (XI sec.)',
      'Ninfee bianche e fauna selvatica (aironi, martin pescatori)',
      'Cascate di Gaina — canyon e sentiero attrezzato a Monticelli Brusati',
      'Parco dell\'Alto Sebino — escursioni da Lovere a Monte Pora',
      'Riva di Solto — borgo sul lago, panorami mozzafiato',
    ],
    tip: 'Torbiere del Sebino: ingresso libero, apertura stagionale. Sentiero delle Cascate di Gaina: percorso ad anello ~3 km, dislivello 250 m.',
  },
  {
    icon: '🏔️',
    title: 'Attività Outdoor',
    desc: 'Golf tra i vigneti, trekking sui colli, arrampicata e sport acquatici sul Lago d\'Iseo.',
    imgs: [
      '/images/outdoor-golf.jpg',
      '/images/outdoor-golf2.jpg',
      '/images/lago-kayak.jpg',
      '/images/lago-sup.jpg',
      '/images/lago-windsurf.jpg',
      '/images/lago-barca.jpg',
      '/images/outdoor-climbing.jpg',
      '/images/outdoor-trekking.jpg',
      '/images/outdoor-colline.jpg',
    ],
    detail: 'La Franciacorta e il Lago d\'Iseo offrono un ventaglio completo di attività all\'aperto per tutti i livelli. Il Golf Club Franciacorta a Nigoline di Corte Franca ha 27 buche (tre percorsi da 9 chiamati Brut, Satèn e Rosé) immersi in 80 ettari di verde tra boschi e vigneti — uno dei campi più belli del Nord Italia, aperto ai non soci su prenotazione. Sul Lago d\'Iseo si praticano kayak, SUP, windsurf, kitesurf, vela, canottaggio e diving. Le pareti di Sale Marasino e Riva di Solto sono tra le falesie di arrampicata sportiva più apprezzate della Lombardia. I colli di Ome e Gussago si percorrono a piedi con panorami sulle Alpi e sulla Pianura Padana.',
    highlights: [
      'Golf Club Franciacorta — 27 buche (Brut, Satèn, Rosé) tra i vigneti',
      'Kayak, SUP, windsurf e kitesurf sul Lago d\'Iseo',
      'Vela e noleggio barche — scuole attive tutto l\'anno',
      'Arrampicata sportiva a Sale Marasino e Riva di Solto',
      'Diving e immersioni nel Lago d\'Iseo',
      'Trekking sui colli di Ome, Gussago e Rodengo Saiano',
      'Paragliding da Forcella di Sale — vista lago panoramica',
    ],
    tip: 'Golf Club Franciacorta: ospiti non soci su prenotazione — tel. 030 984167. Per sport acquatici: Iseo Lake Adventure (iseolakeadventure.com) e OverAlp.',
  },
]

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

  // Reset e avvia carosello quando cambia attività selezionata
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

      {/* ── INTRO ── */}
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
                La Franciacorta è una delle zone vinicole più affascinanti d'Italia: una distesa di colline dolci tra Brescia e il Lago d'Iseo, ricoperta di vigneti, attraversata da strade romantiche che collegano borghi medievali e abbazie benedettine.
              </p>
              <p className="font-sans text-base text-charcoal/72 leading-relaxed mb-5">
                Il nome evoca immediatamente le bollicine del Franciacorta DOCG — l'unico spumante italiano prodotto esclusivamente con Metodo Classico — ma il territorio offre molto di più: natura, storia, arte e un'enogastronomia di altissimo livello.
              </p>
              <p className="font-sans text-base text-charcoal/72 leading-relaxed mb-8">
                Ome, il comune dove si trova il San Michele, è uno dei borghi più caratteristici dei colli: posizione panoramica, vigneti a picco sulle case, silenzio e bellezza in ogni angolo.
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

      {/* ── FRANCIACORTA WINE ── */}
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
              Come lo Champagne in Francia, il Franciacorta è il Metodo Classico italiano per eccellenza. Chardonnay, Pinot Nero e Pinot Bianco lavorati in cantina con una cura maniacale, per produrre bollicine eleganti, persistenti, di straordinaria complessità.
            </p>
            <p className="font-sans text-sm text-cream/50 leading-relaxed mb-8">
              Su richiesta, il San Michele organizza visite e degustazioni nelle cantine più prestigiose della denominazione: Ca' del Bosco, Bellavista, Berlucchi, Cavalleri, Contadi Castaldi e molte altre.
            </p>
            <Link to="/menu" className="btn-outline-light inline-flex items-center gap-2 w-fit">
              Vedi la nostra carta vini <RiArrowRightLine size={13} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ── DISTANCES ── */}
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
                  <RiMapPin2Line className="text-gold" /> Via S. Michele, 5a · 25050 Ome (BS)
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
                  <img src={LAKE_IMG} alt="Ome — veduta dal santuario di Cerezzata" className="w-full h-full object-cover object-center" loading="lazy" />
                </div>
                <div className="bg-forest-dark p-6">
                  <p className="font-sans text-xs tracking-widest uppercase text-gold mb-2">Come arrivare</p>
                  <ul className="space-y-2 font-sans text-sm text-cream/65">
                    <li><strong className="text-cream/80">In auto:</strong> A4 Milano–Venezia, uscita Ospitaletto o Rovato</li>
                    <li><strong className="text-cream/80">In treno:</strong> Stazione Brescia, poi autobus per Ome</li>
                    <li><strong className="text-cream/80">In aereo:</strong> Aeroporto di Bergamo (BGY) a 55 km</li>
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── ACTIVITIES ── */}
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
              <p className="font-sans text-sm text-cream/35 mt-3">Clicca su un'attività per scoprire di più</p>
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
                    Scopri di più <RiArrowRightLine size={11} />
                  </span>
                </button>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAP ── */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <ScrollReveal direction="up">
            <h3 className="font-serif text-2xl text-forest-dark text-center mb-8">Dove siamo</h3>
            <iframe
              title="Hotel San Michele — Via S. Michele 5a, Ome (BS)"
              src="https://maps.google.com/maps?q=Via+S.+Michele%2C+5a%2C+25050+Ome+BS&output=embed&hl=it&z=16"
              width="100%" height="420"
              style={{ border: '1px solid rgba(42,34,24,0.12)', filter: 'grayscale(0.2) contrast(0.95)' }}
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </ScrollReveal>
        </div>
      </section>

      {/* ── MODALE ── */}
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
            {/* Panel — flex-col per vincolare l'altezza su mobile e desktop */}
            <motion.div
              className="relative w-full max-w-5xl bg-cream overflow-hidden shadow-2xl flex flex-col"
              style={{ maxHeight: '90vh' }}
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
            >
              {/* ── CICLOTURISMO: immagine sx, testo dx, mappa sotto (scroll esterno) ── */}
              {ACTIVITIES[selected]?.mapSrc ? (() => {
                const imgs = ACTIVITIES[selected].imgs || [ACTIVITIES[selected].img]
                return (
                  <div className="flex-1 min-h-0 overflow-y-auto">
                    {/* Riga superiore: immagine + testo */}
                    <div className="flex flex-col md:flex-row md:min-h-[360px]">

                      {/* Immagine — h fissa mobile, stretch desktop */}
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

                    {/* Mappa — full width, compare scorrendo */}
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
                /* ── MODAL STANDARD: flex-col/flex-row con nav fissa in fondo ── */
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

                    {/* Contenuto — flex-1 per riempire lo spazio rimanente */}
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

                      {/* Testo scrollabile — prende tutto lo spazio rimasto */}
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
