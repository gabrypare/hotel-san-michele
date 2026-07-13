import ScrollReveal from '../ui/ScrollReveal'

const HOTEL_IMG = 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/3c/d5/79/caption.jpg?w=1200&h=800&s=1'

const STATS = [
  { value: '40+', label: 'Anni di ospitalità' },
  { value: '16',  label: 'Camere & suite' },
  { value: '120', label: 'Posti a sedere' },
]

export default function AboutSection() {
  return (
    <section id="about" className="bg-cream section-py">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Top label */}
        <ScrollReveal direction="fade" delay={0}>
          <div className="flex items-center gap-4 mb-5">
            <span className="w-8 h-px bg-gold opacity-60" />
            <span className="font-sans text-[0.68rem] tracking-[0.35em] uppercase text-gold">
              La nostra storia
            </span>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* Text column */}
          <div>
            <ScrollReveal direction="left" delay={0.1}>
              <h2 className="font-serif text-4xl lg:text-5xl text-forest-dark leading-tight mb-6">
                Nel cuore della<br />
                <span className="italic text-gold">Franciacorta</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={0.25}>
              <p className="font-sans text-base text-charcoal/75 leading-relaxed mb-5">
                Da oltre quarant'anni, l'Hotel Ristorante San Michele accoglie i propri ospiti in uno degli angoli più suggestivi della Franciacorta. Immerso tra i vigneti dei colli di Ome, a pochi chilometri da Brescia e dal Lago d'Iseo, il San Michele è un luogo dove il tempo rallenta e i sensi si risvegliano.
              </p>
              <p className="font-sans text-base text-charcoal/75 leading-relaxed mb-8">
                La struttura a conduzione familiare custodisce i valori dell'ospitalità autentica: cura per il dettaglio, cucina di territorio, camere panoramiche e un'attenzione costante al benessere di ogni ospite. Non un hotel qualsiasi, ma un rifugio d'eccellenza nel cuore della denominazione più prestigiosa della Lombardia.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={0.4}>
              <button
                onClick={() => document.getElementById('hotel')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-outline-forest"
              >
                Scopri le Camere
              </button>
            </ScrollReveal>
          </div>

          {/* Image column */}
          <ScrollReveal direction="right" delay={0.2}>
            <div className="relative">
              <div className="img-zoom aspect-[4/5] rounded-none overflow-hidden">
                <img
                  src={HOTEL_IMG}
                  alt="Hotel San Michele — Ome, Franciacorta"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative gold frame */}
              <div className="absolute -bottom-4 -right-4 w-3/4 h-3/4 border border-gold/30 -z-10 pointer-events-none" />
            </div>
          </ScrollReveal>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-3 gap-0 border-t border-b border-gold/20 py-10">
          {STATS.map((stat, i) => (
            <ScrollReveal key={stat.label} direction="up" delay={0.1 * i}>
              <div className={`text-center px-6 ${i < STATS.length - 1 ? 'border-r border-gold/20' : ''}`}>
                <p className="font-serif text-4xl lg:text-5xl text-forest mb-2">{stat.value}</p>
                <p className="font-sans text-[0.72rem] tracking-[0.2em] uppercase text-stone">
                  {stat.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
