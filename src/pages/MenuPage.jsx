import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import jsPDF from 'jspdf'
import AllergenBadge from '../components/ui/AllergenBadge'
import ScrollReveal from '../components/ui/ScrollReveal'
import { MENU, ALLERGENS, CATEGORY_KEYS } from '../data/menuData'
import { RiDownloadLine, RiArrowLeftLine, RiAwardLine } from 'react-icons/ri'

export default function MenuPage() {
  const [active, setActive]   = useState('antipasti')
  const [legend, setLegend]   = useState(false)
  const [loading, setLoading] = useState(false)

  const category = MENU[active]

  const downloadPDF = () => {
    setLoading(true)
    try {
      const pdf  = new jsPDF('p', 'mm', 'a4')
      const W    = 210
      const M    = 18          // margin left/right
      const CW   = W - M * 2  // content width
      const MAXH = 277         // max y before new page
      let y = 22

      const newPage = () => {
        pdf.addPage()
        pdf.setFillColor(247, 242, 232)
        pdf.rect(0, 0, W, 297, 'F')
        y = 22
      }
      const guard   = (needed) => { if (y + needed > MAXH) newPage() }

      /* background cream */
      pdf.setFillColor(247, 242, 232)
      pdf.rect(0, 0, W, 297, 'F')

      /* ── HEADER ── */
      pdf.setFont('times', 'normal')
      pdf.setFontSize(26)
      pdf.setTextColor(42, 34, 24)
      pdf.text('SAN MICHELE', W / 2, y, { align: 'center' })
      y += 7

      pdf.setFontSize(8)
      pdf.setTextColor(197, 150, 58)
      pdf.text('HOTEL  ·  RISTORANTE  ·  FRANCIACORTA', W / 2, y, { align: 'center' })
      y += 5

      pdf.setTextColor(139, 115, 85)
      pdf.text('Via S. Michele, 5a  ·  25050 Ome (BS)  ·  +39 030 652 7167', W / 2, y, { align: 'center' })
      y += 6

      pdf.setFont('times', 'italic')
      pdf.setFontSize(14)
      pdf.setTextColor(42, 34, 24)
      pdf.text('Menù di Stagione', W / 2, y, { align: 'center' })
      y += 5

      pdf.setDrawColor(197, 150, 58)
      pdf.setLineWidth(0.5)
      pdf.line(M, y, W - M, y)
      y += 10

      /* ── CATEGORIES ── */
      CATEGORY_KEYS.forEach(key => {
        guard(18)

        /* category title */
        pdf.setFont('times', 'bold')
        pdf.setFontSize(13)
        pdf.setTextColor(42, 34, 24)
        pdf.text(MENU[key].label, M, y)
        y += 5

        pdf.setFont('times', 'italic')
        pdf.setFontSize(8.5)
        pdf.setTextColor(139, 115, 85)
        pdf.text(MENU[key].subtitle, M, y)
        y += 2

        pdf.setDrawColor(232, 208, 151)
        pdf.setLineWidth(0.25)
        pdf.line(M, y, W - M, y)
        y += 6

        /* items */
        MENU[key].items.forEach(item => {
          const nameText  = item.name + (item.signature ? '  ★' : '')
          const nameLines = pdf.splitTextToSize(nameText, CW - 18)
          const descLines = pdf.splitTextToSize(item.description, CW - 18)
          const hasAllergens = item.allergens?.length > 0
          const needed = nameLines.length * 5 + descLines.length * 4.2 + (hasAllergens ? 4 : 0) + 9
          guard(needed)

          /* name */
          pdf.setFont('times', 'bold')
          pdf.setFontSize(11)
          pdf.setTextColor(28, 28, 28)
          pdf.text(nameLines, M, y)

          /* price aligned right */
          pdf.setFont('times', 'italic')
          pdf.setFontSize(13)
          pdf.setTextColor(197, 150, 58)
          pdf.text(`€${item.price}`, W - M, y, { align: 'right' })
          y += nameLines.length * 5

          /* description */
          pdf.setFont('times', 'normal')
          pdf.setFontSize(9)
          pdf.setTextColor(120, 100, 75)
          pdf.text(descLines, M, y)
          y += descLines.length * 4.2

          /* allergens */
          if (hasAllergens) {
            pdf.setFontSize(8)
            pdf.setTextColor(160, 150, 138)
            pdf.text(`Allergeni: ${item.allergens.map(a => ALLERGENS[a]?.id).join(', ')}`, M, y)
            y += 4
          }

          /* separator */
          pdf.setDrawColor(215, 204, 190)
          pdf.setLineWidth(0.15)
          pdf.line(M, y + 1.5, W - M, y + 1.5)
          y += 7
        })

        y += 4
      })

      /* ── FOOTER / ALLERGEN LEGEND ── */
      const allergenEntries = Object.entries(ALLERGENS)
      const legendRows = Math.ceil(allergenEntries.length / 3)
      guard(14 + legendRows * 5 + 12)

      pdf.setDrawColor(197, 150, 58)
      pdf.setLineWidth(0.4)
      pdf.line(M, y, W - M, y)
      y += 6

      pdf.setFont('times', 'bold')
      pdf.setFontSize(8.5)
      pdf.setTextColor(42, 34, 24)
      pdf.text('Legenda Allergeni — Reg. UE 1169/2011', M, y)
      y += 5

      /* 3-column grid */
      const colW = CW / 3
      pdf.setFont('times', 'normal')
      pdf.setFontSize(8)
      allergenEntries.forEach(([, a], i) => {
        const col = i % 3
        const row = Math.floor(i / 3)
        const x   = M + col * colW
        const yy  = y + row * 5.5
        pdf.setTextColor(197, 150, 58)
        pdf.text(`${a.id}.`, x, yy)
        pdf.setTextColor(80, 70, 60)
        pdf.text(a.label, x + 6, yy)
      })
      y += legendRows * 5.5 + 4

      pdf.setFontSize(7.5)
      pdf.setTextColor(160, 150, 138)
      const noteLines = pdf.splitTextToSize('Le preparazioni avvengono in cucine che trattano tutti gli allergeni elencati. In caso di allergie o intolleranze gravi, informate il personale prima di ordinare.', CW)
      pdf.text(noteLines, M, y)

      pdf.save('menu-hotel-san-michele.pdf')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-cream min-h-screen">

      {/* ── HERO ── */}
      <div className="relative h-[48vh] min-h-[340px] flex items-end overflow-hidden">
        <motion.img
          src={category.heroImg}
          key={active}
          alt={category.label}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        />
        {/* Gradient più forte in basso per leggibilità testo */}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deeper via-forest-deeper/70 to-forest-deeper/20" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-cream/60 hover:text-gold font-sans text-xs tracking-widest uppercase mb-5 transition-colors duration-300">
            <RiArrowLeftLine size={12} /> Home
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-6 h-px bg-gold" />
                  <span className="section-label text-gold">{category.subtitle}</span>
                </div>
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-cream leading-tight drop-shadow-lg">
                  {category.label}
                </h1>
              </motion.div>
            </AnimatePresence>
            <button
              onClick={downloadPDF}
              disabled={loading}
              className={`inline-flex items-center gap-2 font-sans text-xs tracking-[0.2em] uppercase px-5 py-2.5 border transition-all duration-300 shrink-0 ${
                loading
                  ? 'border-cream/30 text-cream/30 cursor-wait'
                  : 'border-cream/60 text-cream hover:bg-cream hover:text-forest'
              }`}
            >
              <RiDownloadLine size={13} />
              {loading ? 'Generando...' : 'Scarica PDF'}
            </button>
          </div>
        </div>
      </div>

      {/* ── NOTICE ── */}
      <div className="bg-forest text-center py-3 px-6">
        <p className="font-sans text-[0.68rem] text-cream/55 tracking-wide">
          Menù di stagione · aggiornato periodicamente · Per allergie il personale è a disposizione
        </p>
      </div>

      {/* ── CATEGORY TABS ── */}
      <div className="bg-cream sticky top-20 z-30 border-b border-charcoal/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex overflow-x-auto scrollbar-none">
            {CATEGORY_KEYS.map(key => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`relative flex-shrink-0 px-5 py-4 font-sans text-[0.75rem] tracking-[0.18em] uppercase transition-colors duration-300 cursor-pointer bg-transparent border-none whitespace-nowrap
                  ${active === key ? 'text-forest font-medium' : 'text-charcoal/40 hover:text-charcoal/75'}`}
              >
                {MENU[key].label}
                {active === key && (
                  <motion.span
                    layoutId="menu-ind"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── DISHES ── */}
      <div className="max-w-4xl mx-auto px-6 lg:px-10 py-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <div className="divide-y divide-charcoal/8">
              {category.items.map((item, idx) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06, duration: 0.45 }}
                  className={`group py-6 flex items-start gap-5 ${item.signature ? 'bg-cream-dark -mx-4 px-4 rounded-sm' : ''}`}
                >
                  {/* Thumbnail */}
                  {item.photo && (
                    <div className={`shrink-0 overflow-hidden rounded-sm ${item.signature ? 'w-24 h-24' : 'w-[72px] h-[72px]'}`}>
                      <img
                        src={item.photo}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-1.5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className={`font-serif leading-tight group-hover:text-gold transition-colors duration-300 ${item.signature ? 'text-xl text-forest-dark' : 'text-lg text-charcoal'}`}>
                          {item.name}
                        </h3>
                        {item.signature && (
                          <span className="inline-flex items-center gap-1 font-sans text-[0.58rem] tracking-[0.22em] uppercase text-gold border border-gold/50 px-2 py-0.5 shrink-0">
                            <RiAwardLine size={10} /> Firma
                          </span>
                        )}
                      </div>
                      <span className="font-display italic text-2xl text-gold shrink-0">€{item.price}</span>
                    </div>
                    <p className="font-sans text-sm text-charcoal/60 leading-relaxed mb-2.5">{item.description}</p>
                    {item.allergens?.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-sans text-[0.58rem] text-charcoal/35 tracking-wide mr-0.5">Allergeni:</span>
                        {item.allergens.map(a => <AllergenBadge key={a} type={a} size="sm" />)}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── ALLERGEN LEGEND ── */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="mt-14 bg-cream-dark border border-charcoal/8">
            <button
              className="w-full flex items-center justify-between px-7 py-5 bg-transparent border-none text-left cursor-pointer"
              onClick={() => setLegend(v => !v)}
            >
              <div>
                <p className="font-sans text-xs tracking-[0.25em] uppercase text-stone">
                  Legenda Allergeni — Reg. UE 1169/2011
                </p>
                <p className="font-sans text-xs text-charcoal/45 mt-0.5">
                  14 sostanze allergeniche obbligatorie · Passa il cursore sui numeri per i dettagli
                </p>
              </div>
              <motion.span
                animate={{ rotate: legend ? 45 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-gold text-2xl font-light ml-6 shrink-0"
              >
                +
              </motion.span>
            </button>

            <AnimatePresence>
              {legend && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35 }}
                  className="overflow-hidden"
                >
                  <div className="px-7 pb-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 border-t border-charcoal/8 pt-6">
                    {Object.entries(ALLERGENS).map(([key, a]) => (
                      <div key={key} className="flex items-center gap-3">
                        <span
                          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs"
                          style={{ border: `2px solid ${a.color}`, backgroundColor: a.bg, color: a.color }}
                        >
                          {a.id}
                        </span>
                        <span className="font-sans text-xs text-charcoal/65">{a.label}</span>
                      </div>
                    ))}
                  </div>
                  <p className="px-7 pb-6 font-sans text-[0.65rem] text-charcoal/40 leading-relaxed max-w-3xl">
                    Le informazioni si riferiscono agli ingredienti principali. Le preparazioni avvengono in cucine che trattano tutti gli allergeni elencati. In caso di gravi allergie, informate il personale prima di ordinare.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollReveal>

        {/* CTA */}
        <div className="mt-14 text-center">
          <p className="font-display italic text-xl text-stone mb-5">"Vieni a tavola con noi — ti aspettiamo"</p>
          <Link to="/prenota" className="btn-gold">Prenota un Tavolo</Link>
        </div>
      </div>

    </div>
  )
}
