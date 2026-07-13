import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollReveal from '../ui/ScrollReveal'
import AllergenBadge from '../ui/AllergenBadge'
import { MENU, CATEGORY_KEYS } from '../../data/menuData'

export default function MenuPreviewSection() {
  const [active, setActive] = useState('antipasti')
  const category = MENU[active]
  const previewItems = category.items.slice(0, 3)

  return (
    <section id="menu" className="bg-forest section-py">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="text-center mb-12">
          <ScrollReveal direction="fade">
            <div className="flex items-center justify-center gap-4 mb-5">
              <span className="w-8 h-px bg-gold opacity-60" />
              <span className="font-sans text-[0.68rem] tracking-[0.35em] uppercase text-gold">
                Cucina del territorio
              </span>
              <span className="w-8 h-px bg-gold opacity-60" />
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.1}>
            <h2 className="font-serif text-4xl lg:text-5xl text-cream mb-4">
              Il Menù<br />
              <span className="italic text-gold-light">Bozza di Stagione</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.2}>
            <p className="font-sans text-sm text-cream/55 max-w-xl mx-auto leading-relaxed">
              Un menu unico che cambierà con le stagioni e le festività. Gli allergeni sono indicati su ogni portata secondo il Reg. UE 1169/2011.
            </p>
          </ScrollReveal>
        </div>

        {/* Tab bar */}
        <ScrollReveal direction="up" delay={0.25}>
          <div className="flex flex-wrap justify-center gap-0 mb-12 border-b border-cream/10">
            {CATEGORY_KEYS.map(key => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`relative px-5 py-3 font-sans text-[0.75rem] tracking-[0.18em] uppercase transition-colors duration-300 cursor-pointer bg-transparent border-none
                  ${active === key ? 'text-gold' : 'text-cream/45 hover:text-cream/80'}`}
              >
                {MENU[key].label}
                {active === key && (
                  <motion.span
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-px bg-gold"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Items */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="space-y-0"
          >
            {previewItems.map((item, i) => (
              <div
                key={item.name}
                className={`flex flex-col sm:flex-row sm:items-start gap-4 py-7 ${
                  i < previewItems.length - 1 ? 'border-b border-cream/8' : ''
                }`}
              >
                {/* Left: Name + description */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="font-serif text-lg text-cream">{item.name}</h4>
                    {item.signature && (
                      <span className="font-sans text-[0.58rem] tracking-widest uppercase px-2 py-0.5 border border-gold/60 text-gold">
                        Firma
                      </span>
                    )}
                  </div>
                  <p className="font-sans text-sm text-cream/55 leading-relaxed mb-3 max-w-lg">
                    {item.description}
                  </p>
                  {/* Allergen badges */}
                  {item.allergens?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="font-sans text-[0.6rem] text-cream/30 tracking-wide mr-1">Allergeni:</span>
                      {item.allergens.map(a => <AllergenBadge key={a} type={a} />)}
                    </div>
                  )}
                </div>

                {/* Right: Price */}
                <div className="sm:text-right">
                  <span className="font-display text-2xl italic text-gold-light">€{item.price}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Allergen legend */}
        <ScrollReveal direction="fade" delay={0.1}>
          <div className="mt-10 pt-8 border-t border-cream/10">
            <p className="font-sans text-[0.65rem] text-cream/35 tracking-wide text-center mb-3 uppercase">
              Legenda allergeni (Reg. UE 1169/2011) — passa il mouse sui numeri per dettagli
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(n => (
                <span
                  key={n}
                  className="w-5 h-5 rounded-full flex items-center justify-center font-sans font-bold text-[0.58rem] border border-cream/25 text-cream/50"
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="text-center mt-12">
            <Link to="/menu" className="btn-gold">
              Vedi il Menù Completo
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
