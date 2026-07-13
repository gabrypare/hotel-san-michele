import ScrollReveal from '../ui/ScrollReveal'

const LANDSCAPE_IMG = 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?auto=format&fit=crop&w=1400&q=80'
const WINE_IMG      = 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80'

const DISTANCES = [
  { place: 'Brescia',        km: '15 km',   desc: 'Centro storico UNESCO, Piazza della Loggia' },
  { place: 'Lago d\'Iseo',   km: '12 km',   desc: 'Terzo lago lombardo per dimensione' },
  { place: 'Lago di Garda',  km: '45 km',   desc: 'Il lago più grande d\'Italia' },
  { place: 'Aeroporto BGY',  km: '55 km',   desc: 'Aeroporto di Bergamo–Orio al Serio' },
  { place: 'Milano',         km: '95 km',   desc: 'A meno di un\'ora in autostrada' },
  { place: 'Venezia',        km: '150 km',  desc: 'Via A4 in circa 90 minuti' },
]

export default function LocationSection() {
  return (
    <section id="location" className="section-py" style={{ background: '#f0ebe0' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="text-center mb-16">
          <ScrollReveal direction="fade">
            <div className="flex items-center justify-center gap-4 mb-5">
              <span className="w-8 h-px bg-gold opacity-60" />
              <span className="font-sans text-[0.68rem] tracking-[0.35em] uppercase text-gold">
                Il territorio
              </span>
              <span className="w-8 h-px bg-gold opacity-60" />
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.1}>
            <h2 className="font-serif text-4xl lg:text-5xl text-forest-dark mb-5">
              La <span className="italic text-gold">Franciacorta</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.2}>
            <p className="font-sans text-base text-charcoal/70 max-w-2xl mx-auto leading-relaxed">
              La Franciacorta è una delle denominazioni enologiche più prestigiose d'Italia: una terra di colline dolci, abbazie medievali, vigneti curati e bollicine d'eccellenza. Ome ne è il cuore più autentico.
            </p>
          </ScrollReveal>
        </div>

        {/* Full-width landscape image */}
        <ScrollReveal direction="scale" delay={0.1}>
          <div className="img-zoom aspect-[21/9] overflow-hidden mb-16">
            <img
              src={LANDSCAPE_IMG}
              alt="Paesaggio della Franciacorta"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </ScrollReveal>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">

          {/* Distances */}
          <div>
            <ScrollReveal direction="left" delay={0.1}>
              <h3 className="font-serif text-2xl text-forest-dark mb-8">
                Dove siamo
              </h3>
            </ScrollReveal>
            <div className="space-y-0">
              {DISTANCES.map((d, i) => (
                <ScrollReveal key={d.place} direction="left" delay={0.07 * i}>
                  <div className={`flex items-center gap-6 py-4 ${i < DISTANCES.length - 1 ? 'border-b border-charcoal/10' : ''}`}>
                    <span className="font-display text-xl italic text-gold w-16 shrink-0 text-right">
                      {d.km}
                    </span>
                    <div>
                      <p className="font-sans text-sm font-medium text-charcoal">{d.place}</p>
                      <p className="font-sans text-xs text-charcoal/55">{d.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* About Franciacorta */}
          <div>
            <ScrollReveal direction="right" delay={0.1}>
              <div className="img-zoom aspect-[4/3] overflow-hidden mb-6">
                <img
                  src={WINE_IMG}
                  alt="Vino Franciacorta DOCG"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.25}>
              <h3 className="font-serif text-2xl text-forest-dark mb-4">Il Vino della Franciacorta</h3>
              <p className="font-sans text-sm text-charcoal/70 leading-relaxed mb-4">
                Il Franciacorta DOCG è il solo spumante italiano prodotto esclusivamente con Metodo Classico a ricevere la denominazione DOCG. Come lo Champagne in Francia, il Cava in Spagna, il Franciacorta è la massima espressione delle bollicine italiane.
              </p>
              <p className="font-sans text-sm text-charcoal/70 leading-relaxed mb-6">
                Il San Michele vi accompagna nella scoperta di questo territorio attraverso la nostra carta dei vini, degustazioni guidate e, su richiesta, visite alle cantine locali più prestigiose.
              </p>
              <button
                onClick={() => document.getElementById('contatti')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-outline-forest"
              >
                Organizza la tua visita
              </button>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
