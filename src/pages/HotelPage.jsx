import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import ScrollReveal from '../components/ui/ScrollReveal'
import EditableText from '../components/editor/EditableText'
import SortableCard from '../components/editor/SortableCard'
import AddCardButton from '../components/editor/AddCardButton'
import { useEditMode } from '../context/EditModeContext'
import {
  RiCheckLine, RiArrowRightLine, RiArrowLeftLine,
  RiCarLine, RiCupLine, RiWifiLine,
  RiMapPin2Line, RiRestaurantLine, RiSunLine, RiStarLine,
} from 'react-icons/ri'

const ICON_MAP = {
  car:        RiCarLine,
  cup:        RiCupLine,
  wifi:       RiWifiLine,
  sun:        RiSunLine,
  restaurant: RiRestaurantLine,
  map:        RiMapPin2Line,
  star:       RiStarLine,
}

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

function PhotoBtn({ fileKey, path, label = 'Cambia foto' }) {
  const { updateField, passwordRef } = useEditMode()
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const base64  = await resizeAndEncode(file)
      const filename = `hotel-${Date.now()}.jpg`
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
        className="bg-gold text-forest text-[0.6rem] tracking-widest uppercase font-semibold px-2 py-1 shadow-lg hover:bg-gold/80 transition-colors whitespace-nowrap">
        {uploading ? 'Carico...' : label}
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </>
  )
}

const NEW_AMENITY = { iconKey: 'star', title: 'Nuovo servizio', desc: 'Descrizione del servizio.' }

export default function HotelPage() {
  const { isEditMode, content, addItem, removeItem, duplicateItem, reorderItems } = useEditMode()
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))
  const h = content.hotel
  const rooms = content.rooms.rooms

  return (
    <div className="bg-cream">

      {/* ── HERO ── */}
      <div className="relative h-[55vh] min-h-[400px] flex items-end overflow-hidden">
        <motion.img
          src={h.hero.img}
          alt="Hotel San Michele"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1 }}
          animate={{ scale: 1.06 }}
          transition={{ duration: 18, ease: 'linear' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deeper/95 via-forest-deeper/55 to-forest-deeper/20" />
        {isEditMode && (
          <div className="absolute top-4 right-4 z-20">
            <PhotoBtn fileKey="hotel" path={['hero', 'img']} label="Cambia foto hero" />
          </div>
        )}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-cream/50 hover:text-gold font-sans text-xs tracking-widest uppercase mb-5 transition-colors duration-300">
            <RiArrowLeftLine size={13} /> Home
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-6 h-px bg-gold opacity-70" />
            <EditableText tag="span" fileKey="hotel" path={['hero', 'label']} value={h.hero.label} className="section-label" />
          </div>
          <h1 className="font-script text-4xl sm:text-5xl md:text-6xl text-cream leading-tight">
            <EditableText tag="span" fileKey="hotel" path={['hero', 'title']} value={h.hero.title} className="inline" />{' '}
            <EditableText tag="span" fileKey="hotel" path={['hero', 'titleItalic']} value={h.hero.titleItalic} className="italic text-gold-light inline" />
          </h1>
          <EditableText tag="p" fileKey="hotel" path={['hero', 'subtitle']} value={h.hero.subtitle} className="font-display italic text-cream/65 text-lg mt-3 block" />
        </div>
      </div>

      {/* ── INTRO ── */}
      <section className="py-12 md:py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-6 h-px bg-gold/70" />
                <EditableText tag="span" fileKey="hotel" path={['intro', 'sectionLabel']} value={h.intro.sectionLabel} className="section-label" />
              </div>
              <h2 className="font-script text-3xl md:text-4xl lg:text-5xl text-forest-dark mb-6 leading-tight">
                <EditableText tag="span" fileKey="hotel" path={['intro', 'title']} value={h.intro.title} className="inline" />{' '}
                <EditableText tag="span" fileKey="hotel" path={['intro', 'titleItalic']} value={h.intro.titleItalic} className="italic text-gold inline" />
              </h2>
              <EditableText tag="p" fileKey="hotel" path={['intro', 'para1']} value={h.intro.para1} multiline className="font-sans text-base text-charcoal/70 leading-relaxed mb-4 block" />
              <EditableText tag="p" fileKey="hotel" path={['intro', 'para2']} value={h.intro.para2} multiline className="font-sans text-base text-charcoal/70 leading-relaxed mb-8 block" />
              <Link to="/prenota" className="btn-gold inline-flex items-center gap-2">
                Prenota una camera <RiArrowRightLine size={13} />
              </Link>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.15}>
              <div className="relative">
                <div className="img-zoom aspect-[4/5] overflow-hidden">
                  <img src={h.intro.img} alt="Terrazza Hotel San Michele" className="w-full h-full object-cover" loading="lazy" />
                  {isEditMode && <div className="absolute top-2 right-2 z-10"><PhotoBtn fileKey="hotel" path={['intro', 'img']} /></div>}
                </div>
                <div className="absolute -bottom-4 -right-4 w-2/3 h-2/3 border border-gold/25 -z-10" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── CAMERE ── */}
      <section className="py-12 md:py-20 bg-cream-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <ScrollReveal direction="fade">
            <div className="text-center mb-10 md:mb-14">
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="w-8 h-px bg-gold/60" />
                <EditableText tag="span" fileKey="hotel" path={['camere', 'sectionLabel']} value={h.camere.sectionLabel} className="section-label" />
                <span className="w-8 h-px bg-gold/60" />
              </div>
              <h2 className="font-script text-4xl lg:text-5xl text-forest-dark">
                <EditableText tag="span" fileKey="hotel" path={['camere', 'title']} value={h.camere.title} className="inline" />{' '}
                <EditableText tag="span" fileKey="hotel" path={['camere', 'titleItalic']} value={h.camere.titleItalic} className="italic text-gold inline" />
              </h2>
              <EditableText tag="p" fileKey="hotel" path={['camere', 'subtitle']} value={h.camere.subtitle} multiline className="font-sans text-sm text-charcoal/50 mt-4 max-w-lg mx-auto block" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {rooms.map((room, i) => {
              const card = (
                <motion.div className={`group relative overflow-hidden ${isEditMode ? '' : 'cursor-pointer'}`} whileHover="hover" initial="rest">
                  <div className="aspect-[3/4] overflow-hidden">
                    <motion.img
                      src={room.photos[0]}
                      alt={room.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      variants={{ rest: { scale: 1 }, hover: { scale: 1.06 } }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-deeper/85 via-forest-deeper/20 to-transparent" />
                  {room.slug === h.camere.featuredSlug && (
                    <div className="absolute top-5 right-5 bg-gold text-forest-dark font-sans text-[0.58rem] tracking-widest uppercase px-3 py-1.5 z-10">
                      Più richiesta
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                    <p className="font-sans text-[0.62rem] tracking-[0.25em] uppercase text-gold/80 mb-1.5">{room.label}</p>
                    <h3 className="font-serif text-2xl text-cream leading-tight">{room.name}</h3>
                    <p className="font-display italic text-gold-light text-lg mt-1.5">{room.price}</p>
                  </div>
                  <motion.div
                    className="absolute inset-0 flex flex-col justify-end p-6 z-20"
                    style={{ background: 'linear-gradient(to top, rgba(16,14,11,0.95) 60%, rgba(16,14,11,0.3) 100%)' }}
                    variants={{ rest: { opacity: 0, y: 20 }, hover: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="font-sans text-[0.62rem] tracking-[0.25em] uppercase text-gold/80 mb-1.5">{room.label}</p>
                    <h3 className="font-serif text-2xl text-cream mb-1">{room.name}</h3>
                    <p className="font-display italic text-gold-light text-base mb-4">{room.tagline}</p>
                    <EditableText tag="p" fileKey="rooms" path={['rooms', i, 'cardDesc']} value={room.cardDesc ?? room.desc} className="font-sans text-xs text-cream/65 leading-relaxed mb-4 block" />
                    <ul className="space-y-1.5 mb-5">
                      {(room.cardFeatures ?? room.features).map((f, fi) => (
                        <li key={fi} className="flex items-center gap-2 font-sans text-[0.72rem] text-cream/55">
                          <RiCheckLine size={12} className="text-gold shrink-0" />
                          <EditableText tag="span" fileKey="rooms" path={['rooms', i, 'cardFeatures', fi]} value={f} />
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between border-t border-cream/10 pt-4">
                      <span className="font-display italic text-gold-light text-xl">{room.price}</span>
                      <Link to="/prenota" className="inline-flex items-center gap-1.5 font-sans text-[0.68rem] tracking-[0.2em] uppercase text-gold border-b border-gold/50 hover:border-gold transition-colors duration-300" onClick={e => e.stopPropagation()}>
                        Prenota <RiArrowRightLine size={11} />
                      </Link>
                    </div>
                  </motion.div>
                </motion.div>
              )
              return (
                <ScrollReveal key={room.slug} direction="up" delay={0.1 * i}>
                  {isEditMode ? card : <Link to={`/hotel/${room.slug}`}>{card}</Link>}
                </ScrollReveal>
              )
            })}
          </div>

          <ScrollReveal direction="up" delay={0.3}>
            <div className="mt-10 text-center">
              <Link to="/prenota" className="btn-gold">Richiedi disponibilità</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── AMENITIES ── */}
      <section className="py-12 md:py-20 bg-forest-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <ScrollReveal direction="fade">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="w-8 h-px bg-gold/60" />
                <EditableText tag="span" fileKey="hotel" path={['amenities', 'sectionLabel']} value={h.amenities.sectionLabel} className="section-label" />
                <span className="w-8 h-px bg-gold/60" />
              </div>
              <h2 className="font-script text-4xl text-cream">
                <EditableText tag="span" fileKey="hotel" path={['amenities', 'title']} value={h.amenities.title} className="inline" />{' '}
                <EditableText tag="span" fileKey="hotel" path={['amenities', 'titleItalic']} value={h.amenities.titleItalic} className="italic text-gold-light inline" />
              </h2>
            </div>
          </ScrollReveal>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => {
            const { active: a, over } = e
            if (!over || a.id === over.id) return
            const oldIdx = h.amenities.items.findIndex((_, i) => `am-${i}` === a.id)
            const newIdx = h.amenities.items.findIndex((_, i) => `am-${i}` === over.id)
            reorderItems('hotel', ['amenities', 'items'], oldIdx, newIdx)
          }}>
            <SortableContext items={h.amenities.items.map((_, i) => `am-${i}`)} strategy={verticalListSortingStrategy}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-cream/8">
                {h.amenities.items.map((a, i) => {
                  const Icon = ICON_MAP[a.iconKey] || RiStarLine
                  return (
                    <SortableCard key={`am-${i}`} id={`am-${i}`}
                      onDuplicate={() => duplicateItem('hotel', ['amenities', 'items'], i)}
                      onDelete={() => { if (h.amenities.items.length > 1) removeItem('hotel', ['amenities', 'items'], i) }}
                    >
                      <div className="group bg-forest-dark px-8 py-10 hover:bg-forest transition-colors duration-400 h-full">
                        <div className="w-12 h-12 border border-gold/30 flex items-center justify-center mb-6 group-hover:border-gold/70 transition-colors duration-300">
                          <Icon size={20} className="text-gold" />
                        </div>
                        <EditableText tag="h4" fileKey="hotel" path={['amenities', 'items', i, 'title']} value={a.title} className="font-serif text-lg text-cream mb-2 block" />
                        <EditableText tag="p" fileKey="hotel" path={['amenities', 'items', i, 'desc']} value={a.desc} multiline className="font-sans text-sm text-cream/45 leading-relaxed block" />
                      </div>
                    </SortableCard>
                  )
                })}
              </div>
            </SortableContext>
          </DndContext>
          <AddCardButton onClick={() => addItem('hotel', ['amenities', 'items'], { ...NEW_AMENITY })} label="Aggiungi servizio" className="mt-2 border-cream/20 text-cream/40 hover:border-cream/40" />
        </div>
      </section>

      {/* ── COLAZIONE ── */}
      <section className="py-12 md:py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <ScrollReveal direction="up">
            <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-xl">
              <div className="flex flex-col justify-center px-10 py-14 bg-forest">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-5 h-px bg-gold/70" />
                  <EditableText tag="span" fileKey="hotel" path={['colazione', 'sectionLabel']} value={h.colazione.sectionLabel} className="section-label" />
                </div>
                <h2 className="font-script text-3xl md:text-4xl text-cream mb-5 leading-tight">
                  <EditableText tag="span" fileKey="hotel" path={['colazione', 'title']} value={h.colazione.title} className="inline" />{' '}
                  <EditableText tag="span" fileKey="hotel" path={['colazione', 'titleItalic']} value={h.colazione.titleItalic} className="italic text-gold-light inline" />{' '}
                  <EditableText tag="span" fileKey="hotel" path={['colazione', 'titleSuffix']} value={h.colazione.titleSuffix} className="inline" />
                </h2>
                <EditableText tag="p" fileKey="hotel" path={['colazione', 'para1']} value={h.colazione.para1} multiline className="font-sans text-base text-cream/60 leading-relaxed mb-3 block" />
                <EditableText tag="p" fileKey="hotel" path={['colazione', 'hours']} value={h.colazione.hours} className="font-sans text-sm text-cream/40 block" />
              </div>
              <div className="relative overflow-hidden min-h-72 md:min-h-0">
                <img src={h.colazione.img} alt="Colazione San Michele" className="w-full h-full object-cover" loading="lazy" />
                {isEditMode && <div className="absolute top-2 right-2 z-10"><PhotoBtn fileKey="hotel" path={['colazione', 'img']} /></div>}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-cream-dark text-center">
        <ScrollReveal direction="up">
          <div className="max-w-xl mx-auto px-6">
            <EditableText tag="h2" fileKey="hotel" path={['cta', 'title']} value={h.cta.title} className="font-script text-3xl lg:text-4xl text-forest-dark mb-4 block" />
            <EditableText tag="p" fileKey="hotel" path={['cta', 'body']} value={h.cta.body} multiline className="font-sans text-base text-charcoal/60 mb-8 block" />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/prenota" className="btn-gold">Prenota Ora</Link>
              {isEditMode ? (
                <EditableText tag="span" fileKey="hotel" path={['cta', 'phone']} value={h.cta.phone} className="btn-outline-dark" />
              ) : (
                <a href={`tel:${h.cta.phone.replace(/\s/g, '')}`} className="btn-outline-dark">
                  {h.cta.phone}
                </a>
              )}
            </div>
          </div>
        </ScrollReveal>
      </section>

    </div>
  )
}
