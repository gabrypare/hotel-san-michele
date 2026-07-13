import { motion } from 'framer-motion'
import ScrollReveal from '../ui/ScrollReveal'

const ROOMS = [
  {
    name: 'Camera Classic',
    label: 'Comfort · Vista Giardino',
    desc: 'Arredata con cura artigianale, la Camera Classic offre tutto il necessario per un soggiorno rilassante. Bagno privato, aria condizionata e Wi-Fi inclusi.',
    img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
    features: ['Aria condizionata', 'Wi-Fi gratuito', 'Bagno privato', 'TV 32"'],
  },
  {
    name: 'Camera Panoramica',
    label: 'Superior · Vista Vigneti',
    desc: 'Le finestre si aprono sui vigneti della Franciacorta. Un risveglio unico ogni mattina, con colazione inclusa a buffet servita in terrazza.',
    img: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    features: ['Vista Franciacorta', 'Colazione inclusa', 'Terrazza privata', 'Mini-bar'],
    featured: true,
  },
  {
    name: 'Suite San Michele',
    label: 'Suite · Vista Panoramica',
    desc: 'Il massimo del comfort: ampia suite con zona living separata, bagno in marmo con vasca idromassaggio e vista a 180° sul territorio.',
    img: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
    features: ['Zona living', 'Vasca idromassaggio', 'Accappatoio & amenities', 'Bottiglia Franciacorta'],
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
}
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
}

export default function HotelSection() {
  return (
    <section id="hotel" className="bg-forest-dark section-py">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-6">
          <div>
            <ScrollReveal direction="fade">
              <div className="flex items-center gap-4 mb-4">
                <span className="w-8 h-px bg-gold opacity-60" />
                <span className="font-sans text-[0.68rem] tracking-[0.35em] uppercase text-gold">
                  Dove soggiornare
                </span>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="left" delay={0.1}>
              <h2 className="font-serif text-4xl lg:text-5xl text-cream leading-tight">
                Le Camere &<br />
                <span className="italic text-gold-light">Suite</span>
              </h2>
            </ScrollReveal>
          </div>
          <ScrollReveal direction="right" delay={0.2}>
            <p className="font-sans text-sm text-cream/60 max-w-sm leading-relaxed">
              16 camere dal carattere unico, progettate per il riposo e la contemplazione del paesaggio. Ogni ambiente è curato nei minimi dettagli.
            </p>
          </ScrollReveal>
        </div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {ROOMS.map(room => (
            <motion.div
              key={room.name}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className={`group cursor-pointer relative ${room.featured ? 'md:col-span-1' : ''}`}
            >
              {/* Image */}
              <div className="img-zoom aspect-[3/2] overflow-hidden">
                <img
                  src={room.img}
                  alt={room.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Featured badge */}
              {room.featured && (
                <div className="absolute top-4 right-4 bg-gold text-forest-dark font-sans text-[0.62rem] tracking-widest uppercase px-3 py-1.5">
                  Più richiesta
                </div>
              )}

              {/* Card body */}
              <div className="bg-forest p-6 border border-cream/5">
                <p className="font-sans text-[0.68rem] tracking-[0.28em] uppercase text-gold mb-2">
                  {room.label}
                </p>
                <h3 className="font-serif text-xl text-cream mb-3">{room.name}</h3>
                <p className="font-sans text-sm text-cream/60 leading-relaxed mb-5">
                  {room.desc}
                </p>

                {/* Features */}
                <ul className="flex flex-wrap gap-2 mb-5">
                  {room.features.map(f => (
                    <li key={f} className="font-sans text-[0.67rem] tracking-wide text-cream/50 border border-cream/15 px-2.5 py-1">
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => document.getElementById('contatti')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-outline-cream text-[0.68rem] py-2.5 px-5"
                >
                  Richiedi disponibilità
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Services row */}
        <div className="mt-14 pt-12 border-t border-cream/10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: '🅿️', label: 'Parcheggio gratuito' },
            { icon: '🏊', label: 'Piscina & solarium' },
            { icon: '🍳', label: 'Colazione inclusa' },
            { icon: '📶', label: 'Wi-Fi in tutta la struttura' },
          ].map((s, i) => (
            <ScrollReveal key={s.label} direction="up" delay={0.1 * i}>
              <div className="text-center">
                <div className="text-2xl mb-2">{s.icon}</div>
                <p className="font-sans text-[0.72rem] tracking-wide text-cream/55">{s.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
