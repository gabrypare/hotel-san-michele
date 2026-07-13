import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import PageHero from '../components/ui/PageHero'
import ScrollReveal from '../components/ui/ScrollReveal'
import {
  RiCheckLine, RiArrowRightLine,
  RiCarLine, RiCupLine, RiWifiLine,
  RiMapPin2Line, RiRestaurantLine, RiSunLine,
} from 'react-icons/ri'
import { ROOMS_DATA } from '../data/roomsData'

const HERO_IMG  = '/images/hotel-1.jpg'
const TERR_IMG  = '/images/hotel-2.jpg'
const BREAK_IMG = 'https://images.unsplash.com/photo-1533920379810-6bedac961555?auto=format&fit=crop&w=1200&q=80'

const ROOMS = [
  { ...ROOMS_DATA['camera-classic'],    img: ROOMS_DATA['camera-classic'].photos[0],    featured: false },
  { ...ROOMS_DATA['camera-panoramica'], img: ROOMS_DATA['camera-panoramica'].photos[0], featured: true  },
  { ...ROOMS_DATA['suite-san-michele'], img: ROOMS_DATA['suite-san-michele'].photos[0], featured: false },
]

const AMENITIES = [
  { Icon: RiCarLine,         title: 'Parcheggio gratuito',  desc: 'Ampio parcheggio privato riservato agli ospiti dell\'hotel' },
  { Icon: RiCupLine,         title: 'Colazione inclusa',    desc: 'Buffet artigianale con prodotti locali servito ogni mattina' },
  { Icon: RiWifiLine,        title: 'Wi-Fi ovunque',         desc: 'Connessione ad alta velocità gratuita in tutta la struttura' },
  { Icon: RiSunLine,         title: 'Terrazza panoramica',  desc: "Vista sui vigneti della Franciacorta dall'alba al tramonto" },
  { Icon: RiRestaurantLine,  title: 'Ristorante in loco',   desc: 'Cucina lombarda d\'autore aperta a pranzo e cena ogni giorno' },
  { Icon: RiMapPin2Line,     title: 'Posizione strategica', desc: "A 15 min da Brescia, 12 min dal Lago d'Iseo" },
]

export default function HotelPage() {
  return (
    <div className="bg-cream">
      <PageHero
        img={HERO_IMG}
        label="Dove soggiornare"
        title="L'Hotel"
        titleItalic="San Michele"
        subtitle="16 camere immerse nei vigneti della Franciacorta"
        backLabel="Home"
      />

      {/* ── INTRO ── */}
      <section className="py-12 md:py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-6 h-px bg-gold/70" />
                <span className="section-label">L'ospitalità autentica</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-forest-dark mb-6 leading-tight">
                Un rifugio tra <span className="italic text-gold">i vigneti</span>
              </h2>
              <p className="font-sans text-base text-charcoal/70 leading-relaxed mb-4">
                Immerso nei colli di Ome, l'Hotel San Michele è una struttura a conduzione familiare che custodisce i valori dell'ospitalità autentica. Ogni camera è stata pensata come un rifugio privato, con materiali naturali, luce abbondante e una vista che racconta la Franciacorta.
              </p>
              <p className="font-sans text-base text-charcoal/70 leading-relaxed mb-8">
                Il silenzio dei vigneti, la colazione con prodotti artigianali locali, la terrazza panoramica con vista sulla Franciacorta: il San Michele è il punto di partenza ideale per esplorare uno dei territori più belli della Lombardia.
              </p>
              <Link to="/prenota" className="btn-gold inline-flex items-center gap-2">
                Prenota una camera <RiArrowRightLine size={13} />
              </Link>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.15}>
              <div className="relative">
                <div className="img-zoom aspect-[4/5] overflow-hidden">
                  <img src={TERR_IMG} alt="Terrazza Hotel San Michele" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-2/3 h-2/3 border border-gold/25 -z-10" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── CAMERE — BSP-style editorial grid ── */}
      <section className="py-12 md:py-20 bg-cream-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <ScrollReveal direction="fade">
            <div className="text-center mb-10 md:mb-14">
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="w-8 h-px bg-gold/60" />
                <span className="section-label">Le camere</span>
                <span className="w-8 h-px bg-gold/60" />
              </div>
              <h2 className="font-serif text-4xl lg:text-5xl text-forest-dark">
                Scegli il tuo <span className="italic text-gold">spazio</span>
              </h2>
              <p className="font-sans text-sm text-charcoal/50 mt-4 max-w-lg mx-auto">
                Tre tipologie di camera, ognuna con carattere proprio. Clicca per scoprire i dettagli e prenotare.
              </p>
            </div>
          </ScrollReveal>

          {/* Editorial grid — large images, minimal text overlay */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {ROOMS.map((room, i) => (
              <ScrollReveal key={room.name} direction="up" delay={0.1 * i}>
                <Link to={`/hotel/${room.slug}`}>
                <motion.div
                  className="group relative overflow-hidden cursor-pointer"
                  whileHover="hover"
                  initial="rest"
                >
                  {/* Image */}
                  <div className="aspect-[3/4] overflow-hidden">
                    <motion.img
                      src={room.img}
                      alt={room.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      variants={{
                        rest:  { scale: 1 },
                        hover: { scale: 1.06 },
                      }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>

                  {/* Base overlay — always visible at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-deeper/85 via-forest-deeper/20 to-transparent" />

                  {/* Featured badge */}
                  {room.featured && (
                    <div className="absolute top-5 right-5 bg-gold text-forest-dark font-sans text-[0.58rem] tracking-widest uppercase px-3 py-1.5 z-10">
                      Più richiesta
                    </div>
                  )}

                  {/* Base text (always visible) */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                    <p className="font-sans text-[0.62rem] tracking-[0.25em] uppercase text-gold/80 mb-1.5">{room.label}</p>
                    <h3 className="font-serif text-2xl text-cream leading-tight">{room.name}</h3>
                    <p className="font-display italic text-gold-light text-lg mt-1.5">{room.price}</p>
                  </div>

                  {/* Hover panel — slides up from bottom */}
                  <motion.div
                    className="absolute inset-0 flex flex-col justify-end p-6 z-20"
                    style={{ background: 'linear-gradient(to top, rgba(16,14,11,0.95) 60%, rgba(16,14,11,0.3) 100%)' }}
                    variants={{
                      rest:  { opacity: 0, y: 20 },
                      hover: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="font-sans text-[0.62rem] tracking-[0.25em] uppercase text-gold/80 mb-1.5">{room.label}</p>
                    <h3 className="font-serif text-2xl text-cream mb-1">{room.name}</h3>
                    <p className="font-display italic text-gold-light text-base mb-4">{room.tagline}</p>
                    <p className="font-sans text-xs text-cream/65 leading-relaxed mb-4">{room.desc}</p>
                    <ul className="space-y-1.5 mb-5">
                      {room.features.map(f => (
                        <li key={f} className="flex items-center gap-2 font-sans text-[0.72rem] text-cream/55">
                          <RiCheckLine size={12} className="text-gold shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between border-t border-cream/10 pt-4">
                      <span className="font-display italic text-gold-light text-xl">{room.price}</span>
                      <Link
                        to="/prenota"
                        className="inline-flex items-center gap-1.5 font-sans text-[0.68rem] tracking-[0.2em] uppercase text-gold border-b border-gold/50 hover:border-gold transition-colors duration-300"
                        onClick={e => e.stopPropagation()}
                      >
                        Prenota <RiArrowRightLine size={11} />
                      </Link>
                    </div>
                  </motion.div>
                </motion.div>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          {/* CTA sotto la griglia */}
          <ScrollReveal direction="up" delay={0.3}>
            <div className="mt-10 text-center">
              <Link to="/prenota" className="btn-gold">Richiedi disponibilità</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── AMENITIES ── */}
      <section className="py-12 md:py-20 bg-forest-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <ScrollReveal direction="fade">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="w-8 h-px bg-gold/60" />
                <span className="section-label">I servizi</span>
                <span className="w-8 h-px bg-gold/60" />
              </div>
              <h2 className="font-serif text-4xl text-cream">
                Tutto quello che <span className="italic text-gold-light">ti serve</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-cream/8">
            {AMENITIES.map((a, i) => (
              <ScrollReveal key={a.title} direction="up" delay={0.07 * i}>
                <div className="group bg-forest-dark px-8 py-10 hover:bg-forest transition-colors duration-400">
                  <div className="w-12 h-12 border border-gold/30 flex items-center justify-center mb-6 group-hover:border-gold/70 transition-colors duration-300">
                    <a.Icon size={20} className="text-gold" />
                  </div>
                  <h4 className="font-serif text-lg text-cream mb-2">{a.title}</h4>
                  <p className="font-sans text-sm text-cream/45 leading-relaxed">{a.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── COLAZIONE ── */}
      <section className="py-12 md:py-20 bg-cream">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal direction="up">
            <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-xl">
              {/* Text */}
              <div className="flex flex-col justify-center px-8 py-7 bg-forest">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-5 h-px bg-gold/70" />
                  <span className="section-label">Ogni mattina</span>
                </div>
                <h2 className="font-serif text-2xl text-cream mb-3 leading-tight">
                  La <span className="italic text-gold-light">Colazione</span> del San Michele
                </h2>
                <p className="font-sans text-sm text-cream/60 leading-relaxed mb-2">
                  Buffet artigianale in sala o in terrazza: pane fresco, marmellate fatte in casa, formaggi bresciani, salumi locali.
                </p>
                <p className="font-sans text-xs text-cream/40">
                  07:00 – 09:30 · inclusa in tutte le camere
                </p>
              </div>
              {/* Photo */}
              <div className="img-zoom overflow-hidden h-52 md:h-auto">
                <img src={BREAK_IMG} alt="Colazione San Michele" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-cream-dark text-center">
        <ScrollReveal direction="up">
          <div className="max-w-xl mx-auto px-6">
            <h2 className="font-serif text-3xl lg:text-4xl text-forest-dark mb-4">
              Pronto a soggiornare?
            </h2>
            <p className="font-sans text-base text-charcoal/60 mb-8">
              Contattaci direttamente per verificare la disponibilità e ricevere le migliori tariffe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/prenota" className="btn-gold">Prenota Ora</Link>
              <a href="tel:+390306527167" className="btn-outline-dark">+39 030 652 7167</a>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  )
}
