import { useRef } from 'react'
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
  RiArrowRightLine, RiMapPin2Line, RiPhoneLine, RiCameraLine,
  RiRestaurantLine, RiTaxiLine, RiPercentLine, RiHeartLine,
  RiHospitalLine, RiCarLine, RiStarLine, RiLeafLine,
} from 'react-icons/ri'

/* ── icon map per vantaggi ── */
const ICON_MAP = {
  heart:      RiHeartLine,
  restaurant: RiRestaurantLine,
  taxi:       RiTaxiLine,
  percent:    RiPercentLine,
  map:        RiMapPin2Line,
  hospital:   RiHospitalLine,
  car:        RiCarLine,
  star:       RiStarLine,
  leaf:       RiLeafLine,
}
const ICON_OPTIONS = Object.keys(ICON_MAP)

/* ── helpers ── */
async function resizeAndEncode(file, maxW = 1800) {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const scale = Math.min(1, maxW / img.width)
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const c = document.createElement('canvas')
      c.width = w; c.height = h
      c.getContext('2d').drawImage(img, 0, 0, w, h)
      URL.revokeObjectURL(url)
      resolve(c.toDataURL('image/jpeg', 0.88))
    }
    img.src = url
  })
}

function PhotoBtn({ onUpload, className = '' }) {
  const inputRef = useRef(null)
  const { isEditMode } = useEditMode()
  if (!isEditMode) return null
  const handle = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const b64 = await resizeAndEncode(file)
    const res = await fetch('/api/upload-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: b64 }),
    })
    if (res.ok) {
      const data = await res.json()
      onUpload(data.path)
    }
    e.target.value = ''
  }
  return (
    <>
      <button
        onClick={() => inputRef.current?.click()}
        className={`absolute z-20 flex items-center gap-1.5 bg-blue-500 text-white text-[0.6rem] tracking-widest uppercase px-3 py-1.5 hover:bg-blue-600 transition-colors ${className}`}
      >
        <RiCameraLine size={12} /> Cambia foto
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handle} />
    </>
  )
}

/* ── component ── */
export default function ClinicaPage() {
  const { isEditMode, content, updateField, addItem, removeItem, duplicateItem, reorderItems } = useEditMode()

  const cl  = content.clinica
  const hero = cl.hero
  const intro = cl.intro
  const sc  = cl.sconto
  const nav = cl.navetta
  const van = cl.vantaggi
  const dov = cl.dove
  const cta = cl.cta

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))
  const handleDndEnd = (e) => {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const oldIdx = van.items.findIndex((_, i) => `vantaggio-${i}` === active.id)
    const newIdx = van.items.findIndex((_, i) => `vantaggio-${i}` === over.id)
    reorderItems('clinica', ['vantaggi', 'items'], oldIdx, newIdx)
  }

  return (
    <div className="bg-cream">

      {/* ── HERO ── */}
      <div className="relative h-[55vh] min-h-[380px] overflow-hidden">
        <img src={hero.img} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-forest-dark/60" />
        <PhotoBtn
          onUpload={(path) => updateField('clinica', ['hero', 'img'], path)}
          className="bottom-4 right-4"
        />
        <div className="relative h-full flex flex-col justify-end px-8 md:px-16 pb-14 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-px bg-gold/70" />
              <EditableText tag="span" fileKey="clinica" path={['hero', 'label']} value={hero.label}
                className="section-label text-cream/70" />
            </div>
            <h1 className="font-script text-5xl md:text-6xl text-cream leading-tight">
              <EditableText tag="span" fileKey="clinica" path={['hero', 'title']} value={hero.title} />{' '}
              <EditableText tag="em" fileKey="clinica" path={['hero', 'titleItalic']} value={hero.titleItalic}
                className="text-gold" />
            </h1>
            <EditableText tag="p" fileKey="clinica" path={['hero', 'subtitle']} value={hero.subtitle}
              className="font-sans text-sm text-cream/65 mt-3 tracking-wide" />
          </motion.div>
        </div>
      </div>

      {/* ── INTRO ── */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <ScrollReveal direction="up">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-5">
                <span className="w-6 h-px bg-gold/70" />
                <EditableText tag="span" fileKey="clinica" path={['intro', 'sectionLabel']} value={intro.sectionLabel}
                  className="section-label" />
                <span className="w-6 h-px bg-gold/70" />
              </div>
              <h2 className="font-script text-4xl lg:text-5xl text-forest-dark mb-6 leading-tight">
                <EditableText tag="span" fileKey="clinica" path={['intro', 'title']} value={intro.title} /><br />
                <EditableText tag="span" fileKey="clinica" path={['intro', 'titleItalic']} value={intro.titleItalic}
                  className="italic text-gold" />
              </h2>
              <EditableText tag="p" fileKey="clinica" path={['intro', 'para']} value={intro.para} multiline
                className="font-sans text-base text-charcoal/65 leading-relaxed" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── DUE SERVIZI PRINCIPALI ── */}
      <section className="pb-20 bg-cream">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Sconto ristorante */}
          <ScrollReveal direction="left">
            <div className="bg-forest-dark p-10 h-full flex flex-col">
              <div className="w-14 h-14 border border-gold/40 flex items-center justify-center mb-8">
                <RiPercentLine size={22} className="text-gold" />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-5 h-px bg-gold/50" />
                <EditableText tag="span" fileKey="clinica" path={['sconto', 'sectionLabel']} value={sc.sectionLabel}
                  className="font-sans text-[0.65rem] tracking-[0.22em] uppercase text-gold/70" />
              </div>
              <h3 className="font-script text-3xl lg:text-4xl text-cream mb-5 leading-tight">
                <EditableText tag="span" fileKey="clinica" path={['sconto', 'title']} value={sc.title} /><br />
                <EditableText tag="span" fileKey="clinica" path={['sconto', 'titleItalic']} value={sc.titleItalic}
                  className="italic text-gold" />
              </h3>
              <EditableText tag="p" fileKey="clinica" path={['sconto', 'desc']} value={sc.desc} multiline
                className="font-sans text-sm text-cream/60 leading-relaxed mb-6 flex-1" />
              <div className="border-t border-cream/10 pt-6">
                <EditableText tag="p" fileKey="clinica" path={['sconto', 'footerLabel']} value={sc.footerLabel}
                  className="font-sans text-xs text-cream/35 tracking-wide mb-4" />
                <a href="tel:+390303378060" className="btn-gold inline-flex items-center gap-2 text-sm">
                  +39 030 3378060
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* Servizio navetta */}
          <ScrollReveal direction="right" delay={0.1}>
            <div className="border border-charcoal/12 p-10 h-full flex flex-col">
              <div className="w-14 h-14 border border-gold/40 flex items-center justify-center mb-8">
                <RiTaxiLine size={22} className="text-gold" />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-5 h-px bg-gold/50" />
                <EditableText tag="span" fileKey="clinica" path={['navetta', 'sectionLabel']} value={nav.sectionLabel}
                  className="font-sans text-[0.65rem] tracking-[0.22em] uppercase text-gold/70" />
              </div>
              <h3 className="font-script text-3xl lg:text-4xl text-forest-dark mb-5 leading-tight">
                <EditableText tag="span" fileKey="clinica" path={['navetta', 'title']} value={nav.title} /><br />
                <EditableText tag="span" fileKey="clinica" path={['navetta', 'titleItalic']} value={nav.titleItalic}
                  className="italic text-gold" />
              </h3>
              <EditableText tag="p" fileKey="clinica" path={['navetta', 'desc']} value={nav.desc} multiline
                className="font-sans text-sm text-charcoal/60 leading-relaxed mb-6 flex-1" />
              <div className="border-t border-charcoal/10 pt-6">
                <EditableText tag="p" fileKey="clinica" path={['navetta', 'footerLabel']} value={nav.footerLabel}
                  className="font-sans text-xs text-charcoal/35 tracking-wide mb-4" />
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/prenota" className="btn-gold inline-flex items-center gap-2 text-sm">
                    Prenota l'Hotel <RiArrowRightLine size={13} />
                  </Link>
                  <a href="tel:+390303378060" className="btn-outline-dark inline-flex items-center gap-2 text-sm">
                    +39 030 3378060
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ── VANTAGGI ── */}
      <section className="py-20 bg-forest-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <ScrollReveal direction="up">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-px bg-gold/70" />
              <EditableText tag="span" fileKey="clinica" path={['vantaggi', 'sectionLabel']} value={van.sectionLabel}
                className="section-label text-cream/60" />
            </div>
            <h2 className="font-script text-4xl text-cream mb-14 leading-tight max-w-lg">
              <EditableText tag="span" fileKey="clinica" path={['vantaggi', 'title']} value={van.title} /><br />
              <EditableText tag="span" fileKey="clinica" path={['vantaggi', 'titleItalic']} value={van.titleItalic}
                className="italic text-gold" />
            </h2>
          </ScrollReveal>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDndEnd}>
            <SortableContext
              items={van.items.map((_, i) => `vantaggio-${i}`)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-cream/10">
                {van.items.map((item, i) => {
                  const Icon = ICON_MAP[item.icon] ?? RiStarLine
                  return (
                    <SortableCard
                      key={`vantaggio-${i}`}
                      id={`vantaggio-${i}`}
                      onDuplicate={() => duplicateItem('clinica', ['vantaggi', 'items'], i)}
                      onDelete={() => removeItem('clinica', ['vantaggi', 'items'], i)}
                    >
                      <ScrollReveal direction="up" delay={0.08 * i}>
                        <div className="bg-forest-dark p-8">
                          <Icon size={20} className="text-gold mb-5" />
                          {isEditMode && (
                            <select
                              value={item.icon}
                              onChange={e => updateField('clinica', ['vantaggi', 'items', i, 'icon'], e.target.value)}
                              className="mb-3 bg-forest text-cream/60 text-[0.6rem] tracking-widest uppercase border border-cream/20 px-2 py-1 outline-none w-full"
                            >
                              {ICON_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
                            </select>
                          )}
                          <EditableText tag="h4" fileKey="clinica" path={['vantaggi', 'items', i, 'title']} value={item.title}
                            className="font-serif text-lg text-cream mb-3" />
                          <EditableText tag="p" fileKey="clinica" path={['vantaggi', 'items', i, 'desc']} value={item.desc} multiline
                            className="font-sans text-sm text-cream/45 leading-relaxed" />
                        </div>
                      </ScrollReveal>
                    </SortableCard>
                  )
                })}
              </div>
            </SortableContext>
          </DndContext>
          {isEditMode && (
            <AddCardButton
              onClick={() => addItem('clinica', ['vantaggi', 'items'], { icon: 'star', title: 'Nuovo vantaggio', desc: 'Descrizione del vantaggio.' })}
              className="mt-6"
            />
          )}
        </div>
      </section>

      {/* ── DOVE SIAMO ── */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <ScrollReveal direction="up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-6 h-px bg-gold/70" />
                  <EditableText tag="span" fileKey="clinica" path={['dove', 'sectionLabel']} value={dov.sectionLabel}
                    className="section-label" />
                </div>
                <h2 className="font-script text-3xl text-forest-dark mb-4 leading-tight">
                  <EditableText tag="span" fileKey="clinica" path={['dove', 'title']} value={dov.title} /><br />
                  <EditableText tag="span" fileKey="clinica" path={['dove', 'titleItalic']} value={dov.titleItalic}
                    className="italic text-gold" />
                </h2>
                <EditableText tag="p" fileKey="clinica" path={['dove', 'para']} value={dov.para} multiline
                  className="font-sans text-sm text-charcoal/60 leading-relaxed mb-8" />
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 border border-gold/30 flex items-center justify-center shrink-0">
                      <RiMapPin2Line size={14} className="text-gold" />
                    </div>
                    <div>
                      <EditableText tag="p" fileKey="clinica" path={['dove', 'clinicaLabel']} value={dov.clinicaLabel}
                        className="font-sans text-[0.65rem] tracking-[0.22em] uppercase text-stone mb-0.5" />
                      <EditableText tag="p" fileKey="clinica" path={['dove', 'clinicaAddress']} value={dov.clinicaAddress}
                        className="font-sans text-sm text-charcoal/80" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 border border-gold/30 flex items-center justify-center shrink-0">
                      <RiPhoneLine size={14} className="text-gold" />
                    </div>
                    <div>
                      <EditableText tag="p" fileKey="clinica" path={['dove', 'clinicaPhoneLabel']} value={dov.clinicaPhoneLabel}
                        className="font-sans text-[0.65rem] tracking-[0.22em] uppercase text-stone mb-0.5" />
                      <EditableText tag="p" fileKey="clinica" path={['dove', 'clinicaPhone']} value={dov.clinicaPhone}
                        className="font-sans text-sm text-charcoal/80" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-forest-dark p-8">
                <EditableText tag="p" fileKey="clinica" path={['dove', 'hotelLabel']} value={dov.hotelLabel}
                  className="font-sans text-[0.65rem] tracking-[0.22em] uppercase text-cream/40 mb-2" />
                <EditableText tag="p" fileKey="clinica" path={['dove', 'hotelAddress']} value={dov.hotelAddress}
                  className="font-serif text-2xl text-cream mb-1" />
                <EditableText tag="p" fileKey="clinica" path={['dove', 'distanza']} value={dov.distanza}
                  className="font-sans text-sm text-gold mb-6" />
                <div className="border-t border-cream/10 pt-6 flex flex-col sm:flex-row gap-3">
                  <Link to="/prenota" className="btn-gold text-sm">Prenota una camera</Link>
                  <a href="tel:+390303378060" className="btn-outline-light text-sm">
                    +39 030 3378060
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-cream-dark text-center">
        <ScrollReveal direction="up">
          <div className="max-w-xl mx-auto px-6">
            <h2 className="font-script text-3xl lg:text-4xl text-forest-dark mb-4">
              <EditableText tag="span" fileKey="clinica" path={['cta', 'title']} value={cta.title} />
            </h2>
            <EditableText tag="p" fileKey="clinica" path={['cta', 'para']} value={cta.para} multiline
              className="font-sans text-base text-charcoal/60 mb-8" />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/prenota" className="btn-gold">Contattaci</Link>
              <a href="tel:+390303378060" className="btn-outline-dark">+39 030 3378060</a>
            </div>
          </div>
        </ScrollReveal>
      </section>

    </div>
  )
}
