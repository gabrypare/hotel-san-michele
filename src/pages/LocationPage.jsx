import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy, verticalListSortingStrategy } from '@dnd-kit/sortable'
import ScrollReveal from '../components/ui/ScrollReveal'
import EditableText from '../components/editor/EditableText'
import SortableCard from '../components/editor/SortableCard'
import AddCardButton from '../components/editor/AddCardButton'
import { useEditMode } from '../context/EditModeContext'
import {
  RiArrowRightLine, RiMapPin2Line, RiCloseLine,
  RiArrowLeftSLine, RiArrowRightSLine, RiArrowLeftLine,
  RiDeleteBin6Line,
} from 'react-icons/ri'

/* ── Upload helper ── */
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
      const base64   = await resizeAndEncode(file)
      const filename = `location-${Date.now()}.jpg`
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
        className={`bg-gold text-forest text-[0.6rem] tracking-widest uppercase font-semibold px-2 py-1 shadow hover:bg-gold/80 transition-colors whitespace-nowrap ${className}`}>
        {uploading ? 'Carico...' : label}
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </>
  )
}

export default function LocationPage() {
  const { isEditMode, content, reorderItems, addItem, removeItem, duplicateItem, updateField } = useEditMode()
  const loc = content.location
  const activities = content.activities.activities
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const [selected, setSelected]     = useState(null)
  const [carouselIdx, setCarouselIdx] = useState(0)
  const carouselTimer = useRef(null)

  /* body lock when modal open */
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setSelected(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (selected !== null) {
      const y = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${y}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
    } else {
      const y = parseInt(document.body.style.top || '0') * -1
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      if (y) window.scrollTo(0, y)
    }
    return () => {
      const y = parseInt(document.body.style.top || '0') * -1
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      if (y) window.scrollTo(0, y)
    }
  }, [selected])

  useEffect(() => {
    setCarouselIdx(0)
    if (carouselTimer.current) clearInterval(carouselTimer.current)
    if (selected === null) return
    const imgs = activities[selected]?.imgs || []
    if (imgs.length <= 1) return
    carouselTimer.current = setInterval(() => {
      setCarouselIdx(i => (i + 1) % imgs.length)
    }, 3200)
    return () => clearInterval(carouselTimer.current)
  }, [selected])

  const prevModal = () => setSelected(i => Math.max(0, i - 1))
  const nextModal = () => setSelected(i => Math.min(activities.length - 1, i + 1))

  return (
    <div className="bg-cream">

      {/* ── HERO ── */}
      <div className="relative h-[55vh] min-h-[400px] flex items-end overflow-hidden">
        <motion.img
          src={loc.hero.img}
          alt="Franciacorta"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1 }}
          animate={{ scale: 1.06 }}
          transition={{ duration: 18, ease: 'linear' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deeper/95 via-forest-deeper/55 to-forest-deeper/20" />
        {isEditMode && (
          <div className="absolute top-4 right-4 z-20">
            <PhotoBtn fileKey="location" path={['hero', 'img']} label="Cambia foto hero" />
          </div>
        )}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-cream/50 hover:text-gold font-sans text-xs tracking-widest uppercase mb-5 transition-colors duration-300">
            <RiArrowLeftLine size={13} /> Home
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-6 h-px bg-gold opacity-70" />
            <EditableText tag="span" fileKey="location" path={['hero', 'label']} value={loc.hero.label} className="section-label" />
          </div>
          <h1 className="font-script text-4xl sm:text-5xl md:text-6xl text-cream leading-tight">
            <EditableText tag="span" fileKey="location" path={['hero', 'title']} value={loc.hero.title} className="inline" />{' '}
            <EditableText tag="span" fileKey="location" path={['hero', 'titleItalic']} value={loc.hero.titleItalic} className="italic text-gold-light inline" />
          </h1>
          <EditableText tag="p" fileKey="location" path={['hero', 'subtitle']} value={loc.hero.subtitle} className="font-display italic text-cream/65 text-lg mt-3 block" />
        </div>
      </div>

      {/* ── INTRO ── */}
      <section className="py-12 md:py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-6 h-px bg-gold/70" />
                <EditableText tag="span" fileKey="location" path={['intro', 'sectionLabel']} value={loc.intro.sectionLabel} className="section-label" />
              </div>
              <h2 className="font-script text-3xl md:text-4xl lg:text-5xl text-forest-dark mb-6 leading-tight">
                <EditableText tag="span" fileKey="location" path={['intro', 'title']} value={loc.intro.title} className="inline" />{' '}
                <EditableText tag="span" fileKey="location" path={['intro', 'titleItalic']} value={loc.intro.titleItalic} className="italic text-gold inline" />
              </h2>
              <EditableText tag="p" fileKey="location" path={['intro', 'para1']} value={loc.intro.para1} multiline className="font-sans text-base text-charcoal/72 leading-relaxed mb-5 block" />
              <EditableText tag="p" fileKey="location" path={['intro', 'para2']} value={loc.intro.para2} multiline className="font-sans text-base text-charcoal/72 leading-relaxed mb-5 block" />
              <EditableText tag="p" fileKey="location" path={['intro', 'para3']} value={loc.intro.para3} multiline className="font-sans text-base text-charcoal/72 leading-relaxed mb-8 block" />
              <Link to="/prenota" className="btn-gold inline-flex items-center gap-2">
                Prenota il tuo soggiorno <RiArrowRightLine size={13} />
              </Link>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.15}>
              <div className="relative img-zoom aspect-[4/5] overflow-hidden">
                <img src={loc.intro.img} alt="Vigneti Franciacorta" className="w-full h-full object-cover" loading="lazy" />
                {isEditMode && <div className="absolute top-2 right-2 z-10"><PhotoBtn fileKey="location" path={['intro', 'img']} /></div>}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── WINE ── */}
      <section className="py-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[460px]">
          <div className="relative img-zoom overflow-hidden min-h-[280px]">
            <img src={loc.wine.img} alt="Franciacorta DOCG" className="w-full h-full object-cover" loading="lazy" />
            {isEditMode && <div className="absolute top-2 right-2 z-10"><PhotoBtn fileKey="location" path={['wine', 'img']} /></div>}
          </div>
          <ScrollReveal direction="right" className="flex flex-col justify-center px-10 lg:px-16 py-16 bg-forest-dark">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-6 h-px bg-gold/70" />
              <EditableText tag="span" fileKey="location" path={['wine', 'sectionLabel']} value={loc.wine.sectionLabel} className="section-label" />
            </div>
            <h2 className="font-script text-4xl text-cream mb-5 leading-tight">
              <EditableText tag="span" fileKey="location" path={['wine', 'title']} value={loc.wine.title} className="inline" />{' '}
              <EditableText tag="span" fileKey="location" path={['wine', 'titleItalic']} value={loc.wine.titleItalic} className="italic text-gold-light inline" />
            </h2>
            <EditableText tag="p" fileKey="location" path={['wine', 'para1']} value={loc.wine.para1} multiline className="font-sans text-base text-cream/65 leading-relaxed mb-4 block" />
            <EditableText tag="p" fileKey="location" path={['wine', 'para2']} value={loc.wine.para2} multiline className="font-sans text-sm text-cream/50 leading-relaxed mb-8 block" />
            <Link to="/menu" className="btn-outline-light inline-flex items-center gap-2 w-fit">
              Vedi la nostra carta vini <RiArrowRightLine size={13} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ── DISTANCES ── */}
      <section className="py-12 md:py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <ScrollReveal direction="left">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-6 h-px bg-gold/70" />
                  <EditableText tag="span" fileKey="location" path={['distances', 'sectionLabel']} value={loc.distances.sectionLabel} className="section-label" />
                </div>
                <h2 className="font-script text-3xl lg:text-4xl text-forest-dark mb-6 leading-tight">
                  <EditableText tag="span" fileKey="location" path={['distances', 'title']} value={loc.distances.title} className="inline" />{' '}
                  <EditableText tag="span" fileKey="location" path={['distances', 'titleItalic']} value={loc.distances.titleItalic} className="italic text-gold inline" />
                </h2>
                <div className="font-sans text-sm text-charcoal/60 mb-3 flex items-center gap-2">
                  <RiMapPin2Line className="text-gold shrink-0" />
                  <EditableText tag="span" fileKey="location" path={['distances', 'address']} value={loc.distances.address} />
                </div>
              </ScrollReveal>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => {
                const { active: a, over } = e
                if (!over || a.id === over.id) return
                const oldI = loc.distances.items.findIndex((_, i) => `dist-${i}` === a.id)
                const newI = loc.distances.items.findIndex((_, i) => `dist-${i}` === over.id)
                reorderItems('location', ['distances', 'items'], oldI, newI)
              }}>
                <SortableContext items={loc.distances.items.map((_, i) => `dist-${i}`)} strategy={verticalListSortingStrategy}>
                  <div className="divide-y divide-charcoal/8">
                    {loc.distances.items.map((d, i) => (
                      <SortableCard key={`dist-${i}`} id={`dist-${i}`}
                        onDuplicate={() => duplicateItem('location', ['distances', 'items'], i)}
                        onDelete={() => { if (loc.distances.items.length > 1) removeItem('location', ['distances', 'items'], i) }}
                      >
                        <div className="flex items-center gap-6 py-4">
                          <div className="w-16 shrink-0 text-right">
                            <EditableText tag="span" fileKey="location" path={['distances', 'items', i, 'km']} value={d.km} className="font-display italic text-2xl text-gold" />
                            <span className="text-sm not-italic text-stone font-sans"> km</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <EditableText tag="p" fileKey="location" path={['distances', 'items', i, 'place']} value={d.place} className="font-sans text-sm font-medium text-charcoal block" />
                            <EditableText tag="p" fileKey="location" path={['distances', 'items', i, 'desc']} value={d.desc} className="font-sans text-xs text-charcoal/50 block" />
                          </div>
                        </div>
                      </SortableCard>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
              <AddCardButton onClick={() => addItem('location', ['distances', 'items'], { place: 'Nuova destinazione', km: '0', desc: 'Descrizione' })} label="Aggiungi distanza" className="mt-2" />
            </div>

            <ScrollReveal direction="right" delay={0.2}>
              <div className="relative">
                <div className="relative img-zoom aspect-[4/3] overflow-hidden mb-4">
                  <img src={loc.distances.img} alt="Ome — veduta" className="w-full h-full object-cover object-center" loading="lazy" />
                  {isEditMode && <div className="absolute top-2 right-2 z-10"><PhotoBtn fileKey="location" path={['distances', 'img']} /></div>}
                </div>
                <div className="bg-forest-dark p-6">
                  <p className="font-sans text-xs tracking-widest uppercase text-gold mb-3">Come arrivare</p>
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => {
                    const { active: a, over } = e
                    if (!over || a.id === over.id) return
                    const oldI = loc.distances.howTo.findIndex((_, i) => `how-${i}` === a.id)
                    const newI = loc.distances.howTo.findIndex((_, i) => `how-${i}` === over.id)
                    reorderItems('location', ['distances', 'howTo'], oldI, newI)
                  }}>
                    <SortableContext items={loc.distances.howTo.map((_, i) => `how-${i}`)} strategy={verticalListSortingStrategy}>
                      <ul className="space-y-2">
                        {loc.distances.howTo.map((h, i) => (
                          <SortableCard key={`how-${i}`} id={`how-${i}`}
                            onDuplicate={() => duplicateItem('location', ['distances', 'howTo'], i)}
                            onDelete={() => { if (loc.distances.howTo.length > 1) removeItem('location', ['distances', 'howTo'], i) }}
                          >
                            <li className="font-sans text-sm text-cream/65">
                              <EditableText tag="strong" fileKey="location" path={['distances', 'howTo', i, 'label']} value={h.label} className="text-cream/80 inline" />{' '}
                              <EditableText tag="span" fileKey="location" path={['distances', 'howTo', i, 'desc']} value={h.desc} className="inline" />
                            </li>
                          </SortableCard>
                        ))}
                      </ul>
                    </SortableContext>
                  </DndContext>
                  <AddCardButton onClick={() => addItem('location', ['distances', 'howTo'], { label: 'In altro modo:', desc: 'Descrizione.' })} label="Aggiungi modo" className="mt-2 border-cream/20 text-cream/40 hover:border-cream/40" />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── ACTIVITIES ── */}
      <section className="py-12 md:py-20 bg-forest-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <ScrollReveal direction="fade">
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="w-8 h-px bg-gold/60" />
                <EditableText tag="span" fileKey="location" path={['activitiesSection', 'sectionLabel']} value={loc.activitiesSection.sectionLabel} className="section-label" />
                <span className="w-8 h-px bg-gold/60" />
              </div>
              <h2 className="font-script text-4xl text-cream">
                <EditableText tag="span" fileKey="location" path={['activitiesSection', 'title']} value={loc.activitiesSection.title} className="inline" />{' '}
                <EditableText tag="span" fileKey="location" path={['activitiesSection', 'titleItalic']} value={loc.activitiesSection.titleItalic} className="italic text-gold-light inline" />
              </h2>
              <EditableText tag="p" fileKey="location" path={['activitiesSection', 'subtitle']} value={loc.activitiesSection.subtitle} className="font-sans text-sm text-cream/35 mt-3 block" />
            </div>
          </ScrollReveal>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => {
            const { active: a, over } = e
            if (!over || a.id === over.id) return
            const oldI = activities.findIndex((_, i) => `act-${i}` === a.id)
            const newI = activities.findIndex((_, i) => `act-${i}` === over.id)
            reorderItems('activities', ['activities'], oldI, newI)
          }}>
            <SortableContext items={activities.map((_, i) => `act-${i}`)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.map((a, i) => (
                  <SortableCard key={`act-${i}`} id={`act-${i}`}
                    onDuplicate={() => duplicateItem('activities', ['activities'], i)}
                    onDelete={() => { if (activities.length > 1) removeItem('activities', ['activities'], i) }}
                  >
                    <ScrollReveal direction="up" delay={isEditMode ? 0 : 0.08 * i}>
                      <div className="border border-cream/10 p-7 hover:border-gold/40 hover:bg-cream/4 transition-all duration-300 group">
                        <EditableText tag="div" fileKey="activities" path={['activities', i, 'icon']} value={a.icon} className="text-3xl mb-4 block" />
                        <EditableText tag="h3" fileKey="activities" path={['activities', i, 'title']} value={a.title} className="font-serif text-lg text-gold-light mb-2 group-hover:text-gold transition-colors duration-300 block" />
                        <EditableText tag="p" fileKey="activities" path={['activities', i, 'desc']} value={a.desc} multiline className="font-sans text-sm text-cream/55 leading-relaxed mb-4 block" />
                        <button
                          onClick={() => { if (!isEditMode) setSelected(i); else setSelected(i) }}
                          className="font-sans text-[0.65rem] tracking-[0.2em] uppercase text-gold/50 hover:text-gold transition-colors duration-300 inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          {isEditMode ? 'Modifica dettagli →' : 'Scopri di più'} <RiArrowRightLine size={11} />
                        </button>
                      </div>
                    </ScrollReveal>
                  </SortableCard>
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <AddCardButton
            onClick={() => addItem('activities', ['activities'], { icon: '✨', title: 'Nuova attività', desc: 'Descrizione breve.', imgs: ['/images/territorio-1.jpg'], detail: 'Descrizione dettagliata.', highlights: ['Punto 1'], tip: 'Consiglio utile.', mapSrc: '' })}
            label="Aggiungi attività"
            className="mt-6"
          />
        </div>
      </section>

      {/* ── MAP ── */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <ScrollReveal direction="up">
            <div className="flex items-center justify-center gap-4 mb-8">
              <EditableText tag="h3" fileKey="location" path={['map', 'title']} value={loc.map.title} className="font-serif text-2xl text-forest-dark text-center block" />
            </div>
            <iframe
              title="Hotel San Michele — Ome (BS)"
              src={loc.map.src}
              width="100%" height="420"
              style={{ border: '1px solid rgba(42,34,24,0.12)', filter: 'grayscale(0.2) contrast(0.95)' }}
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {isEditMode && (
              <div className="mt-2 flex items-center gap-2">
                <span className="font-sans text-[0.6rem] uppercase tracking-widest text-charcoal/40">URL mappa:</span>
                <EditableText tag="span" fileKey="location" path={['map', 'src']} value={loc.map.src} className="font-sans text-xs text-charcoal/60 flex-1" />
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>

      {/* ── MODAL ATTIVITÀ ── */}
      <AnimatePresence>
        {selected !== null && activities[selected] && (() => {
          const act = activities[selected]
          const imgs = act.imgs || [act.img].filter(Boolean)
          const isCarousel = imgs.length > 1

          return (
            <>
              <motion.div
                className="fixed inset-0 z-50 bg-forest-deeper/85 backdrop-blur-sm"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelected(null)}
              />
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8" onClick={() => setSelected(null)}>
                <motion.div
                  className="relative w-full max-w-5xl bg-cream overflow-hidden shadow-2xl flex flex-col"
                  style={{ maxHeight: '90vh' }}
                  initial={{ opacity: 0, y: 40, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 24, scale: 0.97 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  onClick={e => e.stopPropagation()}
                >
                  {act.mapSrc && !isEditMode ? (
                    /* Layout con mappa (solo in lettura) */
                    <div className="flex-1 min-h-0 overflow-y-auto">
                      <div className="flex flex-col md:flex-row md:min-h-[360px]">
                        <div className="relative overflow-hidden bg-forest-deeper h-52 md:h-auto md:w-[45%] shrink-0 group/car">
                          <AnimatePresence mode="sync">
                            <motion.img key={`${selected}-${carouselIdx}`} src={imgs[carouselIdx]} alt={act.title}
                              className="w-full h-full object-cover absolute inset-0"
                              initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                              transition={{ duration: 0.7 }} />
                          </AnimatePresence>
                          <button onClick={() => { setCarouselIdx(i => (i - 1 + imgs.length) % imgs.length); clearInterval(carouselTimer.current) }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-forest-deeper/60 hover:bg-gold text-cream hover:text-forest-dark flex items-center justify-center transition-all duration-200 opacity-100 md:opacity-0 md:group-hover/car:opacity-100"
                          ><RiArrowLeftSLine size={20} /></button>
                          <button onClick={() => { setCarouselIdx(i => (i + 1) % imgs.length); clearInterval(carouselTimer.current) }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-forest-deeper/60 hover:bg-gold text-cream hover:text-forest-dark flex items-center justify-center transition-all duration-200 opacity-100 md:opacity-0 md:group-hover/car:opacity-100"
                          ><RiArrowRightSLine size={20} /></button>
                          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
                            {imgs.map((_, i) => (
                              <button key={i} onClick={() => { setCarouselIdx(i); clearInterval(carouselTimer.current) }}
                                className={`rounded-full transition-all duration-300 ${i === carouselIdx ? 'w-5 h-1.5 bg-gold' : 'w-1.5 h-1.5 bg-cream/40 hover:bg-cream/70'}`} />
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col flex-1 p-5 sm:p-8 md:p-10 bg-cream">
                          <div className="flex items-start justify-between mb-5 shrink-0">
                            <div>
                              <span className="font-sans text-[0.62rem] tracking-[0.25em] uppercase text-gold/70 block mb-2">
                                {String(selected + 1).padStart(2, '0')} / {String(activities.length).padStart(2, '0')}
                              </span>
                              <h2 className="font-serif text-xl md:text-2xl text-forest-dark leading-tight">{act.icon} {act.title}</h2>
                            </div>
                            <button onClick={() => setSelected(null)} className="ml-4 shrink-0 w-9 h-9 border border-charcoal/15 flex items-center justify-center text-charcoal/50 hover:border-charcoal/40 hover:text-charcoal transition-all duration-200"><RiCloseLine size={18} /></button>
                          </div>
                          <p className="font-sans text-sm text-charcoal/70 leading-relaxed mb-5">{act.detail}</p>
                          <div className="mb-5">
                            <p className="font-sans text-[0.62rem] tracking-[0.22em] uppercase text-gold mb-3">Percorsi consigliati</p>
                            <ul className="space-y-2">
                              {act.highlights.map((h, hi) => (
                                <li key={hi} className="flex items-center gap-2.5 font-sans text-sm text-charcoal/70">
                                  <span className="w-1 h-1 rounded-full bg-gold shrink-0" />{h}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-forest-dark/6 border-l-2 border-gold/50 pl-4 py-3 mb-5">
                            <p className="font-sans text-xs text-charcoal/55 italic leading-relaxed">{act.tip}</p>
                          </div>
                          <div className="shrink-0 pt-3 mt-auto border-t border-charcoal/8 flex items-center justify-between gap-2">
                            <button onClick={prevModal} disabled={selected === 0} className={`flex items-center gap-1 transition-colors duration-200 ${selected === 0 ? 'invisible' : 'text-charcoal/45 hover:text-forest'}`}>
                              <RiArrowLeftSLine size={16} /><span className="font-sans text-[0.6rem] tracking-[0.12em] uppercase">Prec.</span>
                            </button>
                            <Link to="/prenota" onClick={() => setSelected(null)} className="inline-flex items-center gap-1.5 bg-gold hover:bg-gold-light text-forest-dark font-sans text-[0.65rem] tracking-[0.2em] uppercase px-4 py-2 transition-all duration-300">
                              Prenota <RiArrowRightLine size={10} />
                            </Link>
                            <button onClick={nextModal} disabled={selected === activities.length - 1} className={`flex items-center gap-1 transition-colors duration-200 ${selected === activities.length - 1 ? 'invisible' : 'text-charcoal/45 hover:text-forest'}`}>
                              <span className="font-sans text-[0.6rem] tracking-[0.12em] uppercase">Succ.</span><RiArrowRightSLine size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-charcoal/10">
                        <div className="px-6 py-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 bg-cream-dark border-b border-charcoal/8">
                          <span className="font-sans text-[0.58rem] tracking-[0.2em] uppercase text-charcoal/45">Legenda</span>
                          {[{ color: '#0077CC', label: 'Nazionali' }, { color: '#44A032', label: 'Regionali' }, { color: '#9B5DE5', label: 'Locali' }, { color: '#E05000', label: 'MTB' }].map(l => (
                            <div key={l.label} className="flex items-center gap-1.5">
                              <span className="w-5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: l.color }} />
                              <span className="font-sans text-[0.6rem] text-charcoal/55">{l.label}</span>
                            </div>
                          ))}
                        </div>
                        <iframe title="Mappa percorsi" src={act.mapSrc} width="100%" height="380" style={{ border: 'none', display: 'block' }} loading="lazy" allowFullScreen />
                      </div>
                    </div>
                  ) : (
                    /* Layout standard + edit mode */
                    <div className="flex flex-col md:flex-row flex-1 min-h-0">
                      {/* Immagini */}
                      <div className="relative h-48 sm:h-56 md:h-auto md:w-[42%] shrink-0 overflow-hidden bg-forest-deeper group/car">
                        <AnimatePresence mode="sync">
                          <motion.img key={`${selected}-${carouselIdx}`} src={imgs[carouselIdx] ?? ''} alt={act.title}
                            className="w-full h-full object-cover absolute inset-0"
                            initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.7 }} />
                        </AnimatePresence>
                        {isCarousel && (
                          <>
                            <button onClick={() => { setCarouselIdx(i => (i - 1 + imgs.length) % imgs.length); clearInterval(carouselTimer.current) }}
                              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-forest-deeper/60 hover:bg-gold text-cream hover:text-forest-dark flex items-center justify-center transition-all duration-200 opacity-100 md:opacity-0 md:group-hover/car:opacity-100"
                            ><RiArrowLeftSLine size={20} /></button>
                            <button onClick={() => { setCarouselIdx(i => (i + 1) % imgs.length); clearInterval(carouselTimer.current) }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-forest-deeper/60 hover:bg-gold text-cream hover:text-forest-dark flex items-center justify-center transition-all duration-200 opacity-100 md:opacity-0 md:group-hover/car:opacity-100"
                            ><RiArrowRightSLine size={20} /></button>
                            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
                              {imgs.map((_, i) => (
                                <button key={i} onClick={() => { setCarouselIdx(i); clearInterval(carouselTimer.current) }}
                                  className={`rounded-full transition-all duration-300 ${i === carouselIdx ? 'w-5 h-1.5 bg-gold' : 'w-1.5 h-1.5 bg-cream/40 hover:bg-cream/70'}`} />
                              ))}
                            </div>
                          </>
                        )}
                        {/* Edit: gestione foto */}
                        {isEditMode && (
                          <div className="absolute inset-0 bg-forest-deeper/60 flex flex-col items-center justify-center gap-2 p-3 overflow-y-auto">
                            <p className="font-sans text-[0.58rem] uppercase tracking-widest text-cream/60 mb-1">Foto ({imgs.length})</p>
                            <div className="flex flex-col gap-2 w-full">
                              {imgs.map((src, fi) => (
                                <div key={fi} className={`flex items-center gap-2 px-2 py-1 border ${fi === carouselIdx ? 'border-gold bg-forest-deeper/50' : 'border-cream/20 bg-forest-deeper/30'} cursor-pointer`} onClick={() => setCarouselIdx(fi)}>
                                  <img src={src} alt="" className="w-10 h-8 object-cover shrink-0" />
                                  <PhotoBtn fileKey="activities" path={['activities', selected, 'imgs', fi]} label="Cambia" />
                                  {imgs.length > 1 && (
                                    <button onClick={e => { e.stopPropagation(); removeItem('activities', ['activities', selected, 'imgs'], fi); setCarouselIdx(i => Math.min(i, imgs.length - 2)) }}
                                      className="ml-auto text-red-400 hover:text-red-300"><RiDeleteBin6Line size={14} /></button>
                                  )}
                                </div>
                              ))}
                            </div>
                            <button
                              onClick={() => { addItem('activities', ['activities', selected, 'imgs'], imgs[carouselIdx]); setCarouselIdx(imgs.length) }}
                              className="font-sans text-[0.6rem] uppercase tracking-widest text-gold border border-gold/40 px-3 py-1 hover:bg-gold/10 transition-colors mt-1"
                            >+ Aggiungi foto</button>
                          </div>
                        )}
                      </div>

                      {/* Testo */}
                      <div className="flex flex-col flex-1 min-h-0 p-5 sm:p-8 md:p-10">
                        <div className="shrink-0 flex items-start justify-between mb-5">
                          <div>
                            <span className="font-sans text-[0.62rem] tracking-[0.25em] uppercase text-gold/70 block mb-2">
                              {String(selected + 1).padStart(2, '0')} / {String(activities.length).padStart(2, '0')}
                            </span>
                            <h2 className="font-serif text-xl md:text-2xl text-forest-dark leading-tight">
                              {act.icon} {act.title}
                            </h2>
                          </div>
                          <button onClick={() => setSelected(null)} className="ml-4 shrink-0 w-9 h-9 border border-charcoal/15 flex items-center justify-center text-charcoal/50 hover:border-charcoal/40 hover:text-charcoal transition-all duration-200"><RiCloseLine size={18} /></button>
                        </div>

                        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                          {/* Descrizione dettagliata */}
                          <EditableText
                            tag="p"
                            fileKey="activities"
                            path={['activities', selected, 'detail']}
                            value={act.detail}
                            multiline
                            className="font-sans text-sm text-charcoal/70 leading-relaxed mb-5 block"
                          />

                          {/* Highlights */}
                          <div className="mb-5">
                            <p className="font-sans text-[0.62rem] tracking-[0.22em] uppercase text-gold mb-3">
                              {act.mapSrc ? 'Percorsi consigliati' : 'Da non perdere'}
                            </p>
                            <ul className="space-y-2">
                              {act.highlights.map((h, hi) => (
                                <li key={hi} className="flex items-start gap-2.5 font-sans text-sm text-charcoal/70">
                                  <span className="w-1 h-1 rounded-full bg-gold shrink-0 mt-2" />
                                  <EditableText tag="span" fileKey="activities" path={['activities', selected, 'highlights', hi]} value={h} className="flex-1" />
                                  {isEditMode && (
                                    <button onClick={() => { if (act.highlights.length > 1) removeItem('activities', ['activities', selected, 'highlights'], hi) }}
                                      className="text-red-400 hover:text-red-600 shrink-0"><RiDeleteBin6Line size={13} /></button>
                                  )}
                                </li>
                              ))}
                            </ul>
                            {isEditMode && (
                              <button
                                onClick={() => addItem('activities', ['activities', selected, 'highlights'], 'Nuovo punto')}
                                className="mt-2 font-sans text-[0.6rem] uppercase tracking-widest text-gold/60 hover:text-gold border border-gold/30 px-3 py-1 transition-colors"
                              >+ Aggiungi punto</button>
                            )}
                          </div>

                          {/* Tip */}
                          <div className="bg-forest-dark/6 border-l-2 border-gold/50 pl-4 py-3">
                            <EditableText
                              tag="p"
                              fileKey="activities"
                              path={['activities', selected, 'tip']}
                              value={act.tip}
                              multiline
                              className="font-sans text-xs text-charcoal/55 italic leading-relaxed block"
                            />
                          </div>
                        </div>

                        <div className="shrink-0 pt-3 mt-3 border-t border-charcoal/8 flex items-center justify-between gap-2">
                          <button onClick={prevModal} disabled={selected === 0} className={`flex items-center gap-1 transition-colors duration-200 ${selected === 0 ? 'invisible' : 'text-charcoal/45 hover:text-forest'}`}>
                            <RiArrowLeftSLine size={16} /><span className="font-sans text-[0.6rem] tracking-[0.12em] uppercase">Prec.</span>
                          </button>
                          <Link to="/prenota" onClick={() => setSelected(null)} className="inline-flex items-center gap-1.5 bg-gold hover:bg-gold-light text-forest-dark font-sans text-[0.65rem] tracking-[0.2em] uppercase px-4 py-2 transition-all duration-300">
                            Prenota <RiArrowRightLine size={10} />
                          </Link>
                          <button onClick={nextModal} disabled={selected === activities.length - 1} className={`flex items-center gap-1 transition-colors duration-200 ${selected === activities.length - 1 ? 'invisible' : 'text-charcoal/45 hover:text-forest'}`}>
                            <span className="font-sans text-[0.6rem] tracking-[0.12em] uppercase">Succ.</span><RiArrowRightSLine size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </>
          )
        })()}
      </AnimatePresence>
    </div>
  )
}
