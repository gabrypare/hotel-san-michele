import { Link } from 'react-router-dom'
import PageHero from '../components/ui/PageHero'
import ScrollReveal from '../components/ui/ScrollReveal'
import { RiArrowRightLine, RiLeafLine } from 'react-icons/ri'

const HERO_IMG  = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1920&q=80'
const FOOD1    = 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=900&q=80'
const FOOD2    = 'https://images.unsplash.com/photo-1504973960431-1c467e159aa4?auto=format&fit=crop&w=900&q=90'
const FOOD3    = 'https://images.pexels.com/photos/19119979/pexels-photo-19119979.jpeg?auto=compress&cs=tinysrgb&w=1200&q=90'
const WINE_IMG = 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=80'
const INT1     = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=700&q=80'
const INT2     = '/images/hotel-3.jpg'
const INT3     = '/images/hotel-4.jpg'

const SIGNATURE = [
  {
    name: 'Risotto al Franciacorta DOCG',
    desc: 'Riso Carnaroli mantecato al Franciacorta Brut, burro di malga e Grana Padano 24 mesi',
    img: FOOD1,
    cat: 'Primo Piatto · Firma',
    pos: 'object-center',
  },
  {
    name: 'Filetto di Manzo al Tartufo',
    desc: 'Filetto bresciano, salsa al Madeira, scaglie di tartufo nero, gratin di patate',
    img: FOOD2,
    cat: 'Secondo Piatto · Firma',
    pos: 'object-center',
  },
  {
    name: 'Tiramisù San Michele',
    desc: 'Savoiardi, mascarpone, caffè Arabica, cacao amaro e Amaretto di Saronno',
    img: FOOD3,
    cat: 'Dolce · Firma',
    pos: 'object-center',
  },
]

export default function RistorantePage() {
  return (
    <div className="bg-cream">
      <PageHero
        img={HERO_IMG}
        label="La tavola del territorio"
        title="Il Ristorante"
        titleItalic="San Michele"
        subtitle="Cucina lombarda d'autore, stagionale e artigianale"
        backLabel="Home"
      />

      {/* ── STORIA ── */}
      <section className="py-12 md:py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-6 h-px bg-gold/70" />
                <span className="section-label">La nostra storia</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-forest-dark mb-6 leading-tight">
                Una cucina nata <span className="italic text-gold">dal territorio</span>
              </h2>
              <p className="font-sans text-base text-charcoal/72 leading-relaxed mb-5">
                Il ristorante San Michele nasce con la stessa visione dell'hotel: portare a tavola il meglio che la Franciacorta e la Lombardia hanno da offrire. Da oltre quattro decenni, la cucina lavora con fornitori locali di fiducia, seguendo il calendario naturale delle stagioni.
              </p>
              <p className="font-sans text-base text-charcoal/72 leading-relaxed mb-5">
                I casoncelli alla bergamasca tramandati di generazione in generazione, il risotto mantecato al Franciacorta DOCG che ha reso famoso il ristorante, la cacciagione e i funghi dei boschi bresciani in autunno: ogni piatto è un racconto di questa terra.
              </p>
              <p className="font-sans text-base text-charcoal/72 leading-relaxed mb-8">
                La sala può ospitare fino a 120 coperti, con una terrazza panoramica aperta nella stagione estiva. Gli ospiti dell'hotel trovano un tavolo riservato ogni mattina per la colazione e ogni sera per la cena.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/menu" className="btn-gold inline-flex items-center gap-2">
                  Vedi il Menù <RiArrowRightLine size={13} />
                </Link>
                <Link to="/prenota" className="btn-outline-dark">Prenota un Tavolo</Link>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.15}>
              <div className="grid grid-cols-2 gap-3">
                <div className="img-zoom aspect-[3/4] overflow-hidden col-span-1">
                  <img src={INT1} alt="Sala ristorante" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="flex flex-col gap-3">
                  <div className="img-zoom aspect-square overflow-hidden">
                    <img src={INT2} alt="Esterno" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="img-zoom aspect-square overflow-hidden">
                    <img src={INT3} alt="Dettaglio" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── FILOSOFIA ── */}
      <section className="py-12 md:py-20 bg-forest-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <ScrollReveal direction="fade">
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="w-8 h-px bg-gold/60" />
                <span className="section-label">La filosofia</span>
                <span className="w-8 h-px bg-gold/60" />
              </div>
              <h2 className="font-serif text-4xl text-cream">
                Tre valori che <span className="italic text-gold-light">guidano la cucina</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🌿',
                title: 'Stagionalità rigorosa',
                body: "Il menu cambia quattro volte l'anno, seguendo il ciclo naturale delle stagioni. Niente prodotti fuori stagione: solo ciò che la natura offre nel momento giusto.",
              },
              {
                icon: '🤝',
                title: 'Fornitori di fiducia',
                body: "Carne bresciana, pesce dell'Adriatico, formaggi delle valli bergamasche, olio EVO Laghi Lombardi DOP: ogni ingrediente ha un nome, un'azienda, una storia.",
              },
              {
                icon: '⚗️',
                title: 'Artigianalità e tecnica',
                body: 'La tradizione come punto di partenza, la tecnica contemporanea come strumento. Il risultato: piatti riconoscibili che sorprendono ad ogni assaggio.',
              },
            ].map((f, i) => (
              <ScrollReveal key={f.title} direction="up" delay={0.12 * i}>
                <div className="border border-cream/10 p-8 hover:border-gold/40 transition-colors duration-300">
                  <div className="text-3xl mb-4">{f.icon}</div>
                  <h3 className="font-serif text-xl text-gold-light mb-3">{f.title}</h3>
                  <p className="font-sans text-sm text-cream/55 leading-relaxed">{f.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SIGNATURE DISHES ── */}
      <section className="py-12 md:py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <ScrollReveal direction="fade">
            <div className="text-center mb-10 md:mb-14">
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="w-8 h-px bg-gold/60" />
                <span className="section-label">I nostri piatti firma</span>
                <span className="w-8 h-px bg-gold/60" />
              </div>
              <h2 className="font-serif text-4xl text-forest-dark">
                Le <span className="italic text-gold">Specialità</span> del San Michele
              </h2>
            </div>
          </ScrollReveal>

          <div className="space-y-0">
            {SIGNATURE.map((dish, i) => (
              <ScrollReveal key={dish.name} direction={i % 2 === 0 ? 'left' : 'right'} delay={0.1}>
                <div className={`grid grid-cols-1 lg:grid-cols-2 lg:h-[320px] ${i % 2 !== 0 ? 'lg:grid-flow-dense' : ''}`}>
                  <div className={`img-zoom overflow-hidden ${i % 2 !== 0 ? 'lg:col-start-2' : ''}`}>
                    <img src={dish.img} alt={dish.name} className={`w-full h-full object-cover min-h-[220px] ${dish.pos}`} loading="lazy" />
                  </div>
                  <div className={`flex flex-col justify-center px-10 lg:px-16 py-10 ${i % 2 !== 0 ? 'bg-cream-dark lg:col-start-1' : 'bg-forest-dark'}`}>
                    <span className={`section-label block mb-4`}>{dish.cat}</span>
                    <h3 className={`font-serif text-3xl mb-4 leading-tight ${i % 2 !== 0 ? 'text-forest-dark' : 'text-cream'}`}>
                      {dish.name}
                    </h3>
                    <p className={`font-sans text-base leading-relaxed mb-6 ${i % 2 !== 0 ? 'text-charcoal/65' : 'text-cream/60'}`}>
                      {dish.desc}
                    </p>
                    <Link
                      to="/menu"
                      className={`inline-flex items-center gap-2 font-sans text-xs tracking-[0.22em] uppercase border-b pb-0.5 transition-colors duration-300 w-fit ${
                        i % 2 !== 0
                          ? 'text-forest border-forest/40 hover:border-forest'
                          : 'text-gold border-gold/40 hover:border-gold'
                      }`}
                    >
                      Vedi il menù completo <RiArrowRightLine size={12} />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── I VINI ── */}
      <section className="py-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[440px]">
          <div className="img-zoom overflow-hidden min-h-[300px]">
            <img src={WINE_IMG} alt="Vini Franciacorta" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <ScrollReveal direction="right" className="flex flex-col justify-center px-10 lg:px-16 py-16 bg-cream">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-6 h-px bg-gold/70" />
              <span className="section-label">La carta dei vini</span>
            </div>
            <h2 className="font-serif text-4xl text-forest-dark mb-5 leading-tight">
              Il <span className="italic text-gold">Franciacorta</span> in bottiglia
            </h2>
            <p className="font-sans text-base text-charcoal/70 leading-relaxed mb-4">
              La carta dei vini del San Michele è un omaggio al territorio. Metodo Classico DOCG di Ca' del Bosco, Bellavista, Contadi Castaldi: le bollicine più eleganti d'Italia, prodotte a pochi chilometri dal ristorante.
            </p>
            <p className="font-sans text-sm text-charcoal/55 leading-relaxed mb-8">
              Abbinati ai piatti del territorio, i Franciacorta esaltano ogni portata. Il sommelier è a disposizione per guidarvi nella scelta ideale.
            </p>
            <Link to="/menu#vini" className="btn-outline-dark inline-flex items-center gap-2 w-fit">
              Vedi la carta dei vini <RiArrowRightLine size={13} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ── ORARI ── */}
      <section className="py-16 bg-cream-dark">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal direction="up">
            <h3 className="font-serif text-2xl text-forest-dark mb-8">Orari e Prenotazioni</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: 'Pranzo', value: 'Lunedì – Domenica', time: '12:00 – 14:30' },
                { label: 'Cena',   value: 'Lunedì – Domenica', time: '19:30 – 22:00' },
                { label: 'Chiusura', value: 'Martedì', time: 'tutto il giorno' },
              ].map(o => (
                <div key={o.label} className="border border-charcoal/10 p-6">
                  <p className="section-label block mb-2">{o.label}</p>
                  <p className="font-sans text-sm text-charcoal/70">{o.value}</p>
                  <p className="font-sans text-base font-medium text-charcoal mt-1">{o.time}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/prenota" className="btn-gold">Prenota un Tavolo</Link>
              <Link to="/menu" className="btn-outline-dark">Vedi il Menù</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
