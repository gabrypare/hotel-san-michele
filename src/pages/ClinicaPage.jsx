import { Link } from 'react-router-dom'
import PageHero from '../components/ui/PageHero'
import ScrollReveal from '../components/ui/ScrollReveal'
import {
  RiArrowRightLine, RiMapPin2Line, RiPhoneLine, RiGlobalLine,
} from 'react-icons/ri'

const HERO_IMG  = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=90'
const CLINIC2   = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=90'

const SPECIALTIES = [
  { title: 'Cardiologia & UTIC',              desc: 'Cardiologia clinica, Terapia Intensiva Coronaria, Emodinamica e Aritmologia interventistica.' },
  { title: 'Cardiochirurgia',                 desc: 'Centro ad alta specializzazione per interventi a cuore aperto e chirurgia vascolare.' },
  { title: 'Ortopedia e Traumatologia',       desc: 'Patologie degenerative e traumatiche dell\'apparato locomotore, chirurgia artroscopica e protesica.' },
  { title: 'Laserchirurgia e Ch. Plastica',   desc: 'Trattamento di lesioni vascolari, pigmentate e cicatriziali con tecnologie laser.' },
  { title: 'Odontostomatologia',              desc: 'Chirurgia maxillo-facciale e odontoiatria in regime ambulatoriale e di ricovero.' },
  { title: 'Pronto Soccorso — DEA',           desc: 'Dipartimento di Emergenza e Accettazione attivo 24 ore su 24.' },
]

export default function ClinicaPage() {
  return (
    <div className="bg-cream">
      <PageHero
        img={HERO_IMG}
        label="Ome · Gruppo San Donato"
        title="Istituto Clinico"
        titleItalic="San Rocco"
        subtitle="Eccellenza medica a pochi passi dall'Hotel San Michele"
        backLabel="Home"
      />

      {/* ── INTRO ── */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-6 h-px bg-gold/70" />
                <span className="section-label">Una sinergia naturale</span>
              </div>
              <h2 className="font-serif text-4xl lg:text-5xl text-forest-dark mb-6 leading-tight">
                San Michele &amp; San Rocco: <span className="italic text-gold">vicini di cuore</span>
              </h2>
              <p className="font-sans text-base text-charcoal/70 leading-relaxed mb-4">
                L'Istituto Clinico San Rocco sorge nel cuore della Franciacorta, a 15 km da Brescia, in un'area caratterizzata da salubrità ambientale e assenza di inquinamento. Parte del Gruppo San Donato — il principale gruppo ospedaliero privato d'Italia — vanta un'attrattività di pazienti da fuori regione tra le più elevate della Lombardia.
              </p>
              <p className="font-sans text-base text-charcoal/70 leading-relaxed mb-8">
                La clinica è a pochi minuti dall'Hotel Ristorante San Michele: famiglie di pazienti ricoverati, medici e personale sanitario trovano nel San Michele un riferimento di qualità per soggiorno e ristorazione, a soli tre minuti dalla struttura.
              </p>
              <Link to="/hotel" className="btn-gold inline-flex items-center gap-2">
                Scopri l'Hotel <RiArrowRightLine size={13} />
              </Link>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.15}>
              <div className="relative">
                <div className="img-zoom aspect-[4/5] overflow-hidden">
                  <img src={CLINIC2} alt="Istituto Clinico San Rocco" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-2/3 h-2/3 border border-gold/25 -z-10" />
                <div className="absolute -top-5 -left-5 bg-forest-deeper p-5">
                  <p className="font-serif text-3xl text-gold mb-1">1994</p>
                  <p className="font-sans text-[0.65rem] tracking-[0.2em] uppercase text-cream/50">Fondazione</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── SPECIALIZZAZIONI ── */}
      <section className="py-20 bg-forest-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <div className="flex flex-col lg:flex-row gap-16 mb-16">
            <ScrollReveal direction="left" className="lg:w-1/3 shrink-0">
              <span className="section-label block mb-4">La struttura</span>
              <h2 className="font-serif text-4xl text-cream leading-tight">
                Reparti e<br /><span className="italic text-gold-light">specializzazioni</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.1} className="flex items-end">
              <p className="font-sans text-sm text-cream/45 leading-relaxed max-w-md">
                Dal 1994, l'Istituto Clinico San Rocco offre assistenza medica specialistica con un'attrattività di pazienti da fuori regione tra le più elevate della Lombardia. Aperto 24 ore su 24, 365 giorni l'anno.
              </p>
            </ScrollReveal>
          </div>

          <div className="border-t border-cream/10">
            {SPECIALTIES.map((s, i) => (
              <ScrollReveal key={s.title} direction="up" delay={0.06 * i}>
                <div className="group flex items-center border-b border-cream/10 py-5 gap-6 hover:bg-cream/4 transition-colors duration-300 px-2 -mx-2">
                  <span className="font-sans text-[0.6rem] tracking-[0.2em] text-gold/40 w-7 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <h4 className="font-serif text-2xl lg:text-3xl text-cream flex-1 group-hover:text-gold-light transition-colors duration-300">{s.title}</h4>
                  <p className="font-sans text-sm text-cream/35 max-w-xs text-right leading-relaxed hidden md:block">{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal direction="up" delay={0.2}>
            <p className="mt-8 font-sans text-xs text-cream/25 tracking-[0.2em] uppercase text-right">
              OMS · Health Promoting Hospital dal 2000
            </p>
          </ScrollReveal>

        </div>
      </section>

      {/* ── GRUPPO SAN DONATO + INFO ── */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <ScrollReveal direction="left">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-6 h-px bg-gold/70" />
                <span className="section-label">Il Gruppo San Donato</span>
              </div>
              <h2 className="font-serif text-3xl lg:text-4xl text-forest-dark mb-6 leading-tight">
                Parte di una rete <span className="italic text-gold">nazionale</span>
              </h2>
              <p className="font-sans text-base text-charcoal/70 leading-relaxed mb-4">
                Il Gruppo San Donato è il più importante gruppo ospedaliero privato d'Italia. L'Istituto Clinico San Rocco ne fa parte dal 1994, garantendo ai pazienti accesso a standard di cura, tecnologie e competenze di livello internazionale in un contesto ambientale unico.
              </p>
              <p className="font-sans text-base text-charcoal/70 leading-relaxed mb-8">
                La struttura dispone di Pronto Soccorso (DEA) attivo h24, poliambulatorio in convenzione SSN e privato, laboratorio analisi, punto prelievi e palestra per la riabilitazione.
              </p>
              <a
                href="https://www.grupposandonato.it/strutture/istituto-clinico-san-rocco"
                target="_blank"
                rel="noreferrer"
                className="btn-outline-dark inline-flex items-center gap-2"
              >
                Pagina ufficiale San Rocco <RiGlobalLine size={13} />
              </a>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.15}>
              <div className="divide-y divide-charcoal/8">
                {[
                  { Icon: RiMapPin2Line, label: 'Indirizzo',  lines: ['Via dei Sabbioni, 24', '25050 Ome (BS)'] },
                  { Icon: RiPhoneLine,  label: 'Telefono',   lines: ['+39 030 685 9111', 'Centralino attivo h24'] },
                  { Icon: RiGlobalLine, label: 'Web',        lines: ['grupposandonato.it'] },
                ].map(info => (
                  <div key={info.label} className="flex items-start gap-5 py-6">
                    <div className="w-10 h-10 border border-gold/30 flex items-center justify-center shrink-0">
                      <info.Icon size={17} className="text-gold" />
                    </div>
                    <div>
                      <p className="font-sans text-[0.65rem] tracking-[0.25em] uppercase text-charcoal/40 mb-1">{info.label}</p>
                      {info.lines.map(l => (
                        <p key={l} className="font-sans text-sm text-forest-dark">{l}</p>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="pt-6">
                  <div className="bg-forest-dark p-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-sans text-[0.65rem] tracking-[0.25em] uppercase text-cream/40 mb-1">Distanza dall'Hotel San Michele</p>
                      <p className="font-serif text-xl text-cream"><span className="text-gold">~3 minuti</span> in auto · 1,2 km</p>
                    </div>
                    <Link to="/hotel" className="btn-gold shrink-0 text-sm">
                      L'Hotel
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-cream-dark text-center">
        <ScrollReveal direction="up">
          <div className="max-w-xl mx-auto px-6">
            <h2 className="font-serif text-3xl lg:text-4xl text-forest-dark mb-4">
              Sei qui per un familiare ricoverato?
            </h2>
            <p className="font-sans text-base text-charcoal/60 mb-8">
              Il San Michele offre camere e ristorante a pochi minuti dalla clinica. Contattaci per tariffe dedicate ai familiari dei pazienti.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/hotel" className="btn-gold">Scopri l'Hotel</Link>
              <a href="tel:+390306527167" className="btn-outline-dark">+39 030 652 7167</a>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  )
}
