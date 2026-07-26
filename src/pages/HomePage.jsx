import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { RiArrowRightLine, RiArrowLeftLine, RiAddLine } from 'react-icons/ri'
import ScrollReveal from '../components/ui/ScrollReveal'
import EditableText from '../components/editor/EditableText'
import SortableCard from '../components/editor/SortableCard'
import AddCardButton from '../components/editor/AddCardButton'
import { useEditMode } from '../context/EditModeContext'

const QUALITY = 0.88
function resizeAndEncode(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      const MAX_PX = 1600
      if (width > MAX_PX) { height = Math.round(height * MAX_PX / width); width = MAX_PX }
      const canvas = document.createElement('canvas')
      canvas.width = width; canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      canvas.toBlob(blob => {
        const reader = new FileReader()
        reader.onload  = () => resolve(reader.result.split(',')[1])
        reader.onerror = reject
        reader.readAsDataURL(blob)
      }, 'image/jpeg', QUALITY)
    }
    img.onerror = reject
    img.src = url
  })
}

function PhotoBtn({ fileKey, path, label = 'Cambia foto', className = '' }) {
  const { updateField, passwordRef } = useEditMode()
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const base64  = await resizeAndEncode(file)
      const filename = `home-${Date.now()}.jpg`
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordRef.current, base64, filename }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      updateField(fileKey, path, data.path)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }
  return (
    <>
      <button onClick={() => inputRef.current?.click()}
        className={`bg-gold text-forest text-[0.6rem] tracking-widest uppercase font-semibold px-2 py-1 shadow-lg hover:bg-gold/80 transition-colors whitespace-nowrap ${className}`}>
        {uploading ? 'Carico...' : label}
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </>
  )
}

function AddPhotoBtn({ fileKey, arrayPath }) {
  const { addItem, passwordRef } = useEditMode()
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const base64  = await resizeAndEncode(file)
      const filename = `home-${Date.now()}.jpg`
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordRef.current, base64, filename }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      addItem(fileKey, arrayPath, data.path)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }
  return (
    <>
      <button onClick={() => inputRef.current?.click()}
        className="shrink-0 flex flex-col items-center justify-center gap-2 w-64 h-80 border-2 border-dashed border-blue-400/40 text-blue-400 hover:border-blue-400 hover:bg-blue-400/5 transition-all duration-200 font-sans text-xs tracking-[0.2em] uppercase cursor-pointer">
        <RiAddLine size={20} />
        {uploading ? 'Carico...' : 'Aggiungi foto'}
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </>
  )
}

const NEW_STAT = { n: '0', l: 'Nuovo dato' }
const NEW_CARD = { img: '/images/hotel-1.jpg', title: 'Nuova sezione', desc: 'Descrizione della sezione.', href: '/', cta: 'Scopri di più' }

export default function HomePage() {
  const [slide, setSlide] = useState(0)
  const [paused, setPaused] = useState(false)
  const [stripHover, setStripHover] = useState(false)
  const stripRef = useRef(null)
  const { isEditMode, content, updateField, addItem, removeItem, duplicateItem, reorderItems } = useEditMode()
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))
  const h = content.home

  useEffect(() => {
    if (paused || isEditMode) return
    const t = setInterval(() => setSlide(s => (s + 1) % h.hero.slides.length), 5000)
    return () => clearInterval(t)
  }, [paused, isEditMode, h.hero.slides.length])

  // Auto-scroll solo se le foto sono più di 6
  useEffect(() => {
    if (stripHover || isEditMode || h.gallery.photos.length <= 6) return
    const strip = stripRef.current
    if (!strip) return
    const tick = setInterval(() => {
      if (strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 4) {
        strip.scrollLeft = 0
      } else {
        strip.scrollLeft += 1
      }
    }, 20)
    return () => clearInterval(tick)
  }, [stripHover, isEditMode, h.gallery.photos.length])

  return (
    <main className="bg-cream">

      {/* ── HERO CAROUSEL ── */}
      <section
        className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={slide}
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1.08 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.1 }, scale: { duration: 8, ease: 'linear' } }}
          >
            <img
              src={h.hero.slides[slide]?.src}
              alt={h.hero.slides[slide]?.alt}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
          h.hero.slides[slide]?.dark !== false
            ? 'bg-gradient-to-b from-forest-deeper/65 via-forest-deeper/45 to-forest-deeper/80'
            : 'bg-gradient-to-b from-forest-deeper/10 via-transparent to-forest-deeper/20'
        }`} />

        {/* Controlli slide in edit mode — fixed per superare navbar e overflow-hidden */}
        {isEditMode && (
          <>
            <div className="fixed right-4 z-[150] flex gap-1" style={{ top: 104 }}>
              <PhotoBtn fileKey="home" path={['hero', 'slides', slide, 'src']} label={`Slide ${slide + 1}`} />
              {h.hero.slides.length > 1 && (
                <button
                  onClick={() => {
                    removeItem('home', ['hero', 'slides'], slide)
                    setSlide(s => Math.min(s, h.hero.slides.length - 2))
                  }}
                  className="bg-red-500 text-white text-[0.6rem] tracking-widest uppercase font-semibold px-2 py-1 shadow-lg hover:bg-red-600 transition-colors"
                >✕ Elimina</button>
              )}
            </div>
            <div className="fixed left-4 z-[150]" style={{ top: 104 }}>
              <button
                onClick={() => updateField('home', ['hero', 'slides', slide, 'dark'], h.hero.slides[slide]?.dark === false)}
                className="bg-charcoal text-white text-[0.6rem] tracking-widest uppercase font-semibold px-3 py-1.5 shadow-lg hover:bg-charcoal/70 transition-colors"
              >
                {h.hero.slides[slide]?.dark !== false ? '☀ Colori originali' : '◑ Scurisci'}
              </button>
            </div>
          </>
        )}

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            className="flex items-center justify-center gap-4 mb-7"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.9 }}
          >
            <span className="w-10 h-px bg-gold" />
            <EditableText tag="span" fileKey="home" path={['hero', 'label']} value={h.hero.label} className="section-label" />
            <span className="w-10 h-px bg-gold" />
          </motion.div>

          <motion.h1
            className="font-script text-5xl sm:text-7xl lg:text-8xl text-cream leading-[1.02] mb-6"
            initial={{ opacity: 0, y: 45 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <EditableText tag="span" fileKey="home" path={['hero', 'titleLine1']} value={h.hero.titleLine1} className="block" />
            <EditableText tag="em" fileKey="home" path={['hero', 'titleLine2']} value={h.hero.titleLine2} className="not-italic" style={{ color: '#d4aa52' }} />
          </motion.h1>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95, duration: 0.9 }}>
            <EditableText tag="p" fileKey="home" path={['hero', 'quote']} value={h.hero.quote} className="font-display italic text-xl sm:text-2xl text-cream/70 mb-12 block" />
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.8 }}
          >
            <Link to="/hotel" className="btn-gold w-52 text-center">Scopri l'Hotel</Link>
            <Link to="/ristorante" className="btn-outline-light w-52 text-center">Il Ristorante</Link>
          </motion.div>
        </div>

        {/* Dot indicators + aggiungi slide in edit mode */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
        >
          {h.hero.slides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} className="cursor-pointer border-none bg-transparent p-1" aria-label={`Slide ${i + 1}`}>
              <span className={`block rounded-full transition-all duration-500 ${i === slide ? 'w-7 h-1.5 bg-gold' : 'w-1.5 h-1.5 bg-cream/40 hover:bg-cream/70'}`} />
            </button>
          ))}
          {isEditMode && (
            <button
              onClick={() => {
                addItem('home', ['hero', 'slides'], { src: h.hero.slides[slide]?.src || '/images/hotel-1.jpg', alt: 'Nuova slide' })
                setSlide(h.hero.slides.length)
              }}
              className="ml-1 w-5 h-5 bg-gold/80 text-forest flex items-center justify-center text-xs font-bold rounded-full hover:bg-gold transition-colors"
              title="Aggiungi slide"
            >+</button>
          )}
        </motion.div>

        <motion.div
          className="absolute bottom-8 right-10 flex flex-col items-center gap-2 text-cream/45"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
        >
          <span className="font-sans text-[0.6rem] tracking-[0.35em] uppercase">Scorri</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }} className="w-px h-8 bg-cream/40" />
        </motion.div>
      </section>

      {/* ── INTRO + STATS ── */}
      <section className="py-24 bg-forest-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-6 h-px bg-gold opacity-70" />
                <EditableText tag="span" fileKey="home" path={['intro', 'sectionLabel']} value={h.intro.sectionLabel} className="section-label" />
              </div>
              <h2 className="font-script text-4xl lg:text-5xl text-cream mb-6 leading-tight">
                <EditableText tag="span" fileKey="home" path={['intro', 'title']} value={h.intro.title} className="inline" />{' '}
                <EditableText tag="span" fileKey="home" path={['intro', 'titleItalic']} value={h.intro.titleItalic} className="italic text-gold-light inline" />
              </h2>
              <EditableText tag="p" fileKey="home" path={['intro', 'para1']} value={h.intro.para1} multiline className="font-sans text-base text-cream/65 leading-relaxed mb-5 block" />
              <EditableText tag="p" fileKey="home" path={['intro', 'para2']} value={h.intro.para2} multiline className="font-sans text-base text-cream/65 leading-relaxed mb-8 block" />
              <Link to="/ristorante" className="btn-outline-light inline-flex items-center gap-2">
                Scopri la storia <RiArrowRightLine size={14} />
              </Link>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.2}>
              <div className="relative">
                <div className="img-zoom aspect-[4/5] overflow-hidden">
                  <img src={h.intro.img} alt="Hotel San Michele" className="w-full h-full object-cover" loading="lazy" />
                  {isEditMode && <div className="absolute top-2 right-2 z-10"><PhotoBtn fileKey="home" path={['intro', 'img']} /></div>}
                </div>
                <div className="absolute -bottom-4 -right-4 w-2/3 h-2/3 border border-gold/25 -z-10" />
              </div>
            </ScrollReveal>
          </div>

          {/* Stats */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => {
            const { active: a, over } = e
            if (!over || a.id === over.id) return
            const oldIdx = h.intro.stats.findIndex((_, i) => `stat-${i}` === a.id)
            const newIdx = h.intro.stats.findIndex((_, i) => `stat-${i}` === over.id)
            reorderItems('home', ['intro', 'stats'], oldIdx, newIdx)
          }}>
            <SortableContext items={h.intro.stats.map((_, i) => `stat-${i}`)} strategy={verticalListSortingStrategy}>
              <div className="mt-20 grid grid-cols-3 divide-x divide-cream/10 border-t border-b border-cream/10 py-10">
                {h.intro.stats.map((s, i) => (
                  <SortableCard key={`stat-${i}`} id={`stat-${i}`}
                    onDuplicate={() => duplicateItem('home', ['intro', 'stats'], i)}
                    onDelete={() => { if (h.intro.stats.length > 1) removeItem('home', ['intro', 'stats'], i) }}
                  >
                    <ScrollReveal direction="up" delay={0.1 * i}>
                      <div className="text-center px-6">
                        <EditableText tag="p" fileKey="home" path={['intro', 'stats', i, 'n']} value={s.n} className="font-script text-4xl lg:text-5xl text-gold mb-2 block" />
                        <EditableText tag="p" fileKey="home" path={['intro', 'stats', i, 'l']} value={s.l} className="font-sans text-[0.7rem] tracking-[0.22em] uppercase text-cream/40 block" />
                      </div>
                    </ScrollReveal>
                  </SortableCard>
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <AddCardButton onClick={() => addItem('home', ['intro', 'stats'], { ...NEW_STAT })} label="Aggiungi statistica" className="mt-2 border-cream/20 text-cream/40 hover:border-cream/40" />
        </div>
      </section>

      {/* ── ESPERIENZE CARDS ── */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <ScrollReveal direction="fade">
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="w-8 h-px bg-gold/60" />
                <EditableText tag="span" fileKey="home" path={['esperienze', 'sectionLabel']} value={h.esperienze.sectionLabel} className="section-label" />
                <span className="w-8 h-px bg-gold/60" />
              </div>
              <h2 className="font-script text-4xl lg:text-5xl text-forest-dark">
                <EditableText tag="span" fileKey="home" path={['esperienze', 'title']} value={h.esperienze.title} className="inline" />{' '}
                <EditableText tag="span" fileKey="home" path={['esperienze', 'titleItalic']} value={h.esperienze.titleItalic} className="italic text-gold inline" />
              </h2>
            </div>
          </ScrollReveal>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => {
            const { active: a, over } = e
            if (!over || a.id === over.id) return
            const oldIdx = h.esperienze.cards.findIndex((_, i) => `esp-${i}` === a.id)
            const newIdx = h.esperienze.cards.findIndex((_, i) => `esp-${i}` === over.id)
            reorderItems('home', ['esperienze', 'cards'], oldIdx, newIdx)
          }}>
            <SortableContext items={h.esperienze.cards.map((_, i) => `esp-${i}`)} strategy={verticalListSortingStrategy}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {h.esperienze.cards.map((c, i) => (
                  <SortableCard key={`esp-${i}`} id={`esp-${i}`}
                    onDuplicate={() => duplicateItem('home', ['esperienze', 'cards'], i)}
                    onDelete={() => { if (h.esperienze.cards.length > 1) removeItem('home', ['esperienze', 'cards'], i) }}
                  >
                    <ScrollReveal direction="up" delay={0.12 * i}>
                      <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.3 }}
                        className="group relative overflow-hidden bg-forest-dark cursor-pointer">
                        <div className="img-zoom aspect-[3/4] overflow-hidden">
                          <img src={c.img} alt={c.title} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-forest-deeper/90 via-forest-deeper/30 to-transparent" />
                        {isEditMode && (
                          <div className="absolute top-2 right-2 z-20">
                            <PhotoBtn fileKey="home" path={['esperienze', 'cards', i, 'img']} />
                          </div>
                        )}
                        <div className="absolute top-5 left-5">
                          <span className="font-sans text-[0.65rem] tracking-[0.3em] uppercase text-cream/40">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-7">
                          <EditableText tag="h3" fileKey="home" path={['esperienze', 'cards', i, 'title']} value={c.title} className="font-serif text-2xl text-cream mb-2 block" />
                          <EditableText tag="p" fileKey="home" path={['esperienze', 'cards', i, 'desc']} value={c.desc} multiline className="font-sans text-sm text-cream/60 leading-relaxed mb-5 block" />
                          <EditableText tag="span" fileKey="home" path={['esperienze', 'cards', i, 'cta']} value={c.cta}
                            className="inline-flex items-center gap-2 font-sans text-[0.72rem] tracking-[0.2em] uppercase text-gold border-b border-gold/40 pb-0.5 group-hover:border-gold transition-colors duration-300" />
                        </div>
                      </motion.div>
                    </ScrollReveal>
                  </SortableCard>
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <AddCardButton onClick={() => addItem('home', ['esperienze', 'cards'], { ...NEW_CARD })} label="Aggiungi card" className="mt-6" />
        </div>
      </section>

      {/* ── MENU TEASER ── */}
      <section className="relative overflow-hidden bg-forest">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px]">
          <div className="relative img-zoom overflow-hidden">
            <img src={h.menuTeaser.img} alt="Piatto del ristorante" className="w-full h-full object-cover min-h-[300px]" loading="lazy" />
            {isEditMode && <div className="absolute top-2 right-2 z-10"><PhotoBtn fileKey="home" path={['menuTeaser', 'img']} /></div>}
          </div>
          <ScrollReveal direction="right" className="flex flex-col justify-center px-10 lg:px-16 py-16">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-6 h-px bg-gold opacity-70" />
              <EditableText tag="span" fileKey="home" path={['menuTeaser', 'sectionLabel']} value={h.menuTeaser.sectionLabel} className="section-label" />
            </div>
            <h2 className="font-script text-4xl lg:text-5xl text-cream mb-5 leading-tight">
              <EditableText tag="span" fileKey="home" path={['menuTeaser', 'title']} value={h.menuTeaser.title} className="inline" />{' '}
              <EditableText tag="span" fileKey="home" path={['menuTeaser', 'titleItalic']} value={h.menuTeaser.titleItalic} className="italic text-gold-light inline" />
            </h2>
            <EditableText tag="p" fileKey="home" path={['menuTeaser', 'para1']} value={h.menuTeaser.para1} multiline className="font-sans text-base text-cream/60 leading-relaxed mb-4 block" />
            <EditableText tag="p" fileKey="home" path={['menuTeaser', 'para2']} value={h.menuTeaser.para2} multiline className="font-sans text-sm text-cream/50 leading-relaxed mb-8 block" />
            <div className="flex flex-wrap gap-4">
              <Link to="/menu" className="btn-gold inline-flex items-center gap-2">
                Vedi il Menù <RiArrowRightLine size={13} />
              </Link>
              <Link to="/prenota" className="btn-outline-light">Prenota un tavolo</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── GALLERY STRIP ── */}
      <section className="py-24 bg-cream-dark overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-10">
          <ScrollReveal direction="fade">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-6 h-px bg-gold/60" />
                  <EditableText tag="span" fileKey="home" path={['gallery', 'sectionLabel']} value={h.gallery.sectionLabel} className="section-label" />
                </div>
                <h2 className="font-script text-3xl lg:text-4xl text-forest-dark">
                  <EditableText tag="span" fileKey="home" path={['gallery', 'title']} value={h.gallery.title} className="inline" />{' '}
                  <EditableText tag="span" fileKey="home" path={['gallery', 'titleItalic']} value={h.gallery.titleItalic} className="italic text-gold inline" />
                </h2>
              </div>
              <Link to="/galleria" className="hidden md:inline-flex items-center gap-2 font-sans text-xs tracking-[0.2em] uppercase text-forest hover:text-gold transition-colors duration-300">
                Vedi tutta la galleria <RiArrowRightLine size={13} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
        {h.gallery.photos.length > 6 ? (
          /* ── RULLINO SCORREVOLE (> 6 foto) ── */
          <div
            className="relative group/strip"
            onMouseEnter={() => setStripHover(true)}
            onMouseLeave={() => setStripHover(false)}
          >
            <button
              onClick={() => { const s = stripRef.current; if (!s) return; s.scrollLeft <= 10 ? s.scrollTo({ left: s.scrollWidth, behavior: 'smooth' }) : s.scrollBy({ left: -280, behavior: 'smooth' }) }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-cream/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-forest hover:bg-gold hover:text-forest transition-all duration-200 opacity-0 group-hover/strip:opacity-100"
            ><RiArrowLeftLine size={18} /></button>

            <div ref={stripRef} className="flex gap-3 px-6 lg:px-10 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {h.gallery.photos.map((src, i) => (
                <div key={i} className="relative shrink-0 group/gph">
                  <Link to="/galleria"><div className="img-zoom w-64 h-80 overflow-hidden"><img src={src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" /></div></Link>
                  {isEditMode && (
                    <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover/gph:opacity-100 transition-opacity">
                      <PhotoBtn fileKey="home" path={['gallery', 'photos', i]} />
                      {h.gallery.photos.length > 1 && <button onClick={() => removeItem('home', ['gallery', 'photos'], i)} className="bg-red-500 text-white text-[0.6rem] tracking-widest uppercase font-semibold px-2 py-1 shadow-lg hover:bg-red-600 transition-colors">✕</button>}
                    </div>
                  )}
                </div>
              ))}
              {isEditMode && <AddPhotoBtn fileKey="home" arrayPath={['gallery', 'photos']} />}
            </div>

            <button
              onClick={() => { const s = stripRef.current; if (!s) return; s.scrollLeft + s.clientWidth >= s.scrollWidth - 10 ? s.scrollTo({ left: 0, behavior: 'smooth' }) : s.scrollBy({ left: 280, behavior: 'smooth' }) }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-cream/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-forest hover:bg-gold hover:text-forest transition-all duration-200 opacity-0 group-hover/strip:opacity-100"
            ><RiArrowRightLine size={18} /></button>
          </div>
        ) : (
          /* ── GRIGLIA FISSA (≤ 6 foto) ── */
          <div className="flex gap-3 px-6 lg:px-10 justify-center flex-wrap">
            {h.gallery.photos.map((src, i) => (
              <div key={i} className="relative shrink-0 group/gph">
                <Link to="/galleria"><div className="img-zoom w-64 h-80 overflow-hidden"><img src={src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" /></div></Link>
                {isEditMode && (
                  <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover/gph:opacity-100 transition-opacity">
                    <PhotoBtn fileKey="home" path={['gallery', 'photos', i]} />
                    {h.gallery.photos.length > 1 && <button onClick={() => removeItem('home', ['gallery', 'photos'], i)} className="bg-red-500 text-white text-[0.6rem] tracking-widest uppercase font-semibold px-2 py-1 shadow-lg hover:bg-red-600 transition-colors">✕</button>}
                  </div>
                )}
              </div>
            ))}
            {isEditMode && <AddPhotoBtn fileKey="home" arrayPath={['gallery', 'photos']} />}
          </div>
        )}
        <div className="mt-6 text-center md:hidden">
          <Link to="/galleria" className="btn-outline-dark">Vedi tutta la galleria</Link>
        </div>
      </section>

      {/* ── BOOK CTA ── */}
      <section className="relative py-28 overflow-hidden">
        <img src={h.bookCta.img} alt="Terrazza San Michele" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-forest-deeper/80" />
        {isEditMode && <div className="absolute top-4 right-4 z-20"><PhotoBtn fileKey="home" path={['bookCta', 'img']} label="Cambia foto sfondo" /></div>}
        <ScrollReveal direction="scale" className="relative z-10 text-center max-w-2xl mx-auto px-6">
          <div className="flex items-center justify-center gap-4 mb-5">
            <span className="w-8 h-px bg-gold opacity-60" />
            <EditableText tag="span" fileKey="home" path={['bookCta', 'sectionLabel']} value={h.bookCta.sectionLabel} className="section-label" />
            <span className="w-8 h-px bg-gold opacity-60" />
          </div>
          <h2 className="font-script text-4xl lg:text-5xl text-cream mb-5 leading-tight">
            <EditableText tag="span" fileKey="home" path={['bookCta', 'title']} value={h.bookCta.title} className="inline" />{' '}
            <EditableText tag="span" fileKey="home" path={['bookCta', 'titleItalic']} value={h.bookCta.titleItalic} className="italic text-gold-light inline" />
          </h2>
          <EditableText tag="p" fileKey="home" path={['bookCta', 'body']} value={h.bookCta.body} multiline className="font-sans text-base text-cream/60 mb-10 leading-relaxed block" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/prenota" className="btn-gold">Prenota Ora</Link>
            <a href="tel:+390303378060" className="btn-outline-light">+39 030 3378060</a>
          </div>
        </ScrollReveal>
      </section>

    </main>
  )
}
