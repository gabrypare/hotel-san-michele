import { Link } from 'react-router-dom'
import ScrollReveal from '../ui/ScrollReveal'

const REST_IMG   = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80'
const FOOD_IMG   = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80'
const TERRACE_IMG = 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/f8/32/c2/photo4jpg.jpg?w=800&h=600&s=1'

export default function RestaurantSection() {
  return (
    <section id="ristorante" className="bg-cream section-py">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Main split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center mb-20">

          {/* Image column */}
          <ScrollReveal direction="left" delay={0.1}>
            <div className="relative">
              <div className="img-zoom aspect-[4/5] overflow-hidden">
                <img
                  src={REST_IMG}
                  alt="Sala ristorante San Michele"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              {/* Floating secondary image */}
              <div className="absolute -bottom-8 -right-8 w-2/5 aspect-square img-zoom overflow-hidden border-4 border-cream shadow-xl">
                <img
                  src={FOOD_IMG}
                  alt="Piatto del ristorante"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-2/5 aspect-square border border-gold/30 -z-10" />
            </div>
          </ScrollReveal>

          {/* Text column */}
          <div className="lg:pl-6">
            <ScrollReveal direction="fade">
              <div className="flex items-center gap-4 mb-5">
                <span className="w-8 h-px bg-gold opacity-60" />
                <span className="font-sans text-[0.68rem] tracking-[0.35em] uppercase text-gold">
                  La tavola del territorio
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.15}>
              <h2 className="font-serif text-4xl lg:text-5xl text-forest-dark leading-tight mb-6">
                Il Ristorante<br />
                <span className="italic text-gold">San Michele</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.3}>
              <p className="font-sans text-base text-charcoal/75 leading-relaxed mb-4">
                La cucina del San Michele è un viaggio nel territorio bresciano e lombardo: ingredienti selezionati, stagionalità rigorosa e ricette che custodiscono la memoria artigianale della Franciacorta.
              </p>
              <p className="font-sans text-base text-charcoal/75 leading-relaxed mb-8">
                Il nostro risotto al Franciacorta DOCG, i casoncelli alla bergamasca, la tagliata di vitello: piatti che raccontano storie. Abbinati a una carta dei vini che celebra le bollicine più eleganti d'Italia.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.45}>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { label: 'Pranzo',      value: 'Lun–Dom 12:00–14:30' },
                  { label: 'Cena',        value: 'Lun–Dom 19:30–22:00' },
                  { label: 'Chiusura',    value: 'Martedì' },
                  { label: 'Coperti',     value: '120 posti + terrazza' },
                ].map(item => (
                  <div key={item.label} className="border-l-2 border-gold/40 pl-3">
                    <p className="font-sans text-[0.68rem] tracking-[0.2em] uppercase text-stone mb-0.5">
                      {item.label}
                    </p>
                    <p className="font-sans text-sm text-charcoal/80">{item.value}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.55}>
              <div className="flex gap-4 flex-wrap">
                <Link to="/menu" className="btn-gold">
                  Vedi il Menù
                </Link>
                <button
                  onClick={() => document.getElementById('contatti')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-outline-forest"
                >
                  Prenota un Tavolo
                </button>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Bottom philosophy strip */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="bg-forest-dark p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🌿',
                title: 'Stagionale e locale',
                body: 'I nostri menu cambiano con le stagioni, seguendo il calendario della natura bresciana e dei produttori locali.',
              },
              {
                icon: '🍷',
                title: 'Franciacorta in bottiglia',
                body: 'Selezione curata di Franciacorta DOCG e Curtefranca DOC dai migliori produttori del territorio.',
              },
              {
                icon: '⚗️',
                title: 'Allergeni dichiarati',
                body: 'Ogni piatto riporta gli allergeni ai sensi del Reg. UE 1169/2011. Il personale è sempre disponibile a supportarvi.',
              },
            ].map(item => (
              <div key={item.title} className="flex flex-col">
                <div className="text-2xl mb-3">{item.icon}</div>
                <h4 className="font-serif text-lg text-gold-light mb-2">{item.title}</h4>
                <p className="font-sans text-sm text-cream/60 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
