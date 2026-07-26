import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri'
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
      const filename = `ristorante-${Date.now()}.jpg`
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
      <button
        onClick={() => inputRef.current?.click()}
        className="bg-gold text-forest text-[0.6rem] tracking-widest uppercase font-semibold px-2 py-1 shadow-lg hover:bg-gold/80 transition-colors whitespace-nowrap"
      >
        {uploading ? 'Carico...' : label}
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </>
  )
}


const NEW_CARD = { icon: '✨', title: 'Nuovo valore', body: 'Descrizione del valore.' }
const NEW_DISH = { name: 'Nuovo Piatto Firma', desc: 'Descrizione del piatto.', cat: 'Categoria · Firma', img: '' }
const NEW_SLOT = { label: 'Servizio', value: 'Lunedì – Domenica', time: '00:00 – 00:00' }

export default function RistorantePage() {
  const { isEditMode, content, addItem, removeItem, duplicateItem, reorderItems } = useEditMode()
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))
  const r = content.restaurant

  return (
    <div className="bg-cream">

      {/* ── HERO ── */}
      <div className="relative h-[55vh] min-h-[400px] flex items-end overflow-hidden">
        <motion.img
          src={r.hero.img}
          alt="Ristorante San Michele"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1 }}
          animate={{ scale: 1.06 }}
          transition={{ duration: 18, ease: 'linear' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deeper/95 via-forest-deeper/55 to-forest-deeper/20" />
        {isEditMode && (
          <div className="absolute top-4 right-4 z-20">
            <PhotoBtn fileKey="restaurant" path={['hero', 'img']} label="Cambia foto hero" />
          </div>
        )}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-cream/50 hover:text-gold font-sans text-xs tracking-widest uppercase mb-5 transition-colors duration-300">
            <RiArrowLeftLine size={13} /> Home
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-6 h-px bg-gold opacity-70" />
            <EditableText tag="span" fileKey="restaurant" path={['hero', 'label']} value={r.hero.label} className="section-label" />
          </div>
          <h1 className="font-script text-4xl sm:text-5xl md:text-6xl text-cream leading-tight">
            <EditableText tag="span" fileKey="restaurant" path={['hero', 'title']} value={r.hero.title} className="inline" />{' '}
            <EditableText tag="span" fileKey="restaurant" path={['hero', 'titleItalic']} value={r.hero.titleItalic} className="italic text-gold-light inline" />
          </h1>
          <EditableText tag="p" fileKey="restaurant" path={['hero', 'subtitle']} value={r.hero.subtitle} className="font-display italic text-cream/65 text-lg mt-3 block" />
        </div>
      </div>

      {/* ── STORIA ── */}
      <section className="py-12 md:py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-6 h-px bg-gold/70" />
                <EditableText tag="span" fileKey="restaurant" path={['storia', 'sectionLabel']} value={r.storia.sectionLabel} className="section-label" />
              </div>
              <h2 className="font-script text-3xl md:text-4xl lg:text-5xl text-forest-dark mb-6 leading-tight">
                <EditableText tag="span" fileKey="restaurant" path={['storia', 'title']} value={r.storia.title} className="inline" />{' '}
                <EditableText tag="span" fileKey="restaurant" path={['storia', 'titleItalic']} value={r.storia.titleItalic} className="italic text-gold inline" />
              </h2>
              {r.storia.paragraphs.map((p, i) => (
                <EditableText key={i} tag="p" fileKey="restaurant" path={['storia', 'paragraphs', i]} value={p} multiline
                  className="font-sans text-base text-charcoal/72 leading-relaxed mb-5 block" />
              ))}
              <div className="flex flex-wrap gap-4 mt-3">
                <Link to="/menu" className="btn-gold inline-flex items-center gap-2">
                  Vedi il Menù <RiArrowRightLine size={13} />
                </Link>
                <Link to="/prenota" className="btn-outline-dark">Prenota un Tavolo</Link>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.15}>
              <div className="grid grid-cols-2 gap-3">
                {/* Colonna sinistra — foto alta */}
                <div className="relative img-zoom aspect-[3/4] overflow-hidden col-span-1">
                  <img src={r.storia.images[0]} alt="Sala ristorante" className="w-full h-full object-cover" loading="lazy" />
                  {isEditMode && <div className="absolute top-2 right-2 z-10"><PhotoBtn fileKey="restaurant" path={['storia', 'images', 0]} /></div>}
                </div>
                {/* Colonna destra — 2 foto quadrate */}
                <div className="flex flex-col gap-3">
                  {[1, 2].map(i => (
                    <div key={i} className="relative img-zoom aspect-square overflow-hidden">
                      <img src={r.storia.images[i]} alt="Ristorante" className="w-full h-full object-cover" loading="lazy" />
                      {isEditMode && <div className="absolute top-2 right-2 z-10"><PhotoBtn fileKey="restaurant" path={['storia', 'images', i]} /></div>}
                    </div>
                  ))}
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
                <EditableText tag="span" fileKey="restaurant" path={['filosofia', 'sectionLabel']} value={r.filosofia.sectionLabel} className="section-label" />
                <span className="w-8 h-px bg-gold/60" />
              </div>
              <h2 className="font-script text-4xl text-cream">
                <EditableText tag="span" fileKey="restaurant" path={['filosofia', 'title']} value={r.filosofia.title} className="inline" />{' '}
                <EditableText tag="span" fileKey="restaurant" path={['filosofia', 'titleItalic']} value={r.filosofia.titleItalic} className="italic text-gold-light inline" />
              </h2>
            </div>
          </ScrollReveal>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => {
            const { active: a, over } = e
            if (!over || a.id === over.id) return
            const oldIdx = r.filosofia.cards.findIndex((_, i) => `filo-${i}` === a.id)
            const newIdx = r.filosofia.cards.findIndex((_, i) => `filo-${i}` === over.id)
            reorderItems('restaurant', ['filosofia', 'cards'], oldIdx, newIdx)
          }}>
            <SortableContext items={r.filosofia.cards.map((_, i) => `filo-${i}`)} strategy={verticalListSortingStrategy}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {r.filosofia.cards.map((f, i) => (
                  <SortableCard key={`filo-${i}`} id={`filo-${i}`}
                    onDuplicate={() => duplicateItem('restaurant', ['filosofia', 'cards'], i)}
                    onDelete={() => { if (r.filosofia.cards.length > 1) removeItem('restaurant', ['filosofia', 'cards'], i) }}
                  >
                    <div className="border border-cream/10 p-8 hover:border-gold/40 transition-colors duration-300 h-full">
                      <EditableText tag="div" fileKey="restaurant" path={['filosofia', 'cards', i, 'icon']} value={f.icon} className="text-3xl mb-4 block" />
                      <EditableText tag="h3" fileKey="restaurant" path={['filosofia', 'cards', i, 'title']} value={f.title} className="font-serif text-xl text-gold-light mb-3 block" />
                      <EditableText tag="p" fileKey="restaurant" path={['filosofia', 'cards', i, 'body']} value={f.body} multiline className="font-sans text-sm text-cream/55 leading-relaxed block" />
                    </div>
                  </SortableCard>
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <AddCardButton onClick={() => addItem('restaurant', ['filosofia', 'cards'], { ...NEW_CARD })} label="Aggiungi valore" className="mt-6" />
        </div>
      </section>

      {/* ── PIATTI FIRMA ── */}
      <section className="py-12 md:py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <ScrollReveal direction="fade">
            <div className="text-center mb-10 md:mb-14">
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="w-8 h-px bg-gold/60" />
                <EditableText tag="span" fileKey="restaurant" path={['signature', 'sectionLabel']} value={r.signature.sectionLabel} className="section-label" />
                <span className="w-8 h-px bg-gold/60" />
              </div>
              <h2 className="font-script text-4xl text-forest-dark">
                <EditableText tag="span" fileKey="restaurant" path={['signature', 'title']} value={r.signature.title} className="inline" />{' '}
                <EditableText tag="span" fileKey="restaurant" path={['signature', 'titleItalic']} value={r.signature.titleItalic} className="italic text-gold inline" />{' '}
                <EditableText tag="span" fileKey="restaurant" path={['signature', 'titleSuffix']} value={r.signature.titleSuffix} className="inline" />
              </h2>
            </div>
          </ScrollReveal>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => {
            const { active: a, over } = e
            if (!over || a.id === over.id) return
            const oldIdx = r.signature.dishes.findIndex((_, i) => `sig-${i}` === a.id)
            const newIdx = r.signature.dishes.findIndex((_, i) => `sig-${i}` === over.id)
            reorderItems('restaurant', ['signature', 'dishes'], oldIdx, newIdx)
          }}>
            <SortableContext items={r.signature.dishes.map((_, i) => `sig-${i}`)} strategy={verticalListSortingStrategy}>
              <div className="space-y-0">
                {r.signature.dishes.map((dish, i) => (
                  <SortableCard key={`sig-${i}`} id={`sig-${i}`}
                    onDuplicate={() => duplicateItem('restaurant', ['signature', 'dishes'], i)}
                    onDelete={() => { if (r.signature.dishes.length > 1) removeItem('restaurant', ['signature', 'dishes'], i) }}
                  >
                    <div className={`grid grid-cols-1 lg:grid-cols-2 lg:h-[320px] ${i % 2 !== 0 ? 'lg:grid-flow-dense' : ''}`}>
                      <div className={`relative img-zoom overflow-hidden min-h-[220px] ${i % 2 !== 0 ? 'lg:col-start-2' : ''}`}>
                        <img src={dish.img} alt={dish.name} className="w-full h-full object-cover object-center" loading="lazy" />
                        {isEditMode && <div className="absolute top-2 right-2 z-10"><PhotoBtn fileKey="restaurant" path={['signature', 'dishes', i, 'img']} /></div>}
                      </div>
                      <div className={`flex flex-col justify-center px-10 lg:px-16 py-10 ${i % 2 !== 0 ? 'bg-cream-dark lg:col-start-1' : 'bg-forest-dark'}`}>
                        <EditableText tag="span" fileKey="restaurant" path={['signature', 'dishes', i, 'cat']} value={dish.cat} className="section-label block mb-4" />
                        <EditableText tag="h3" fileKey="restaurant" path={['signature', 'dishes', i, 'name']} value={dish.name}
                          className={`font-script text-3xl mb-4 leading-tight block ${i % 2 !== 0 ? 'text-forest-dark' : 'text-cream'}`} />
                        <EditableText tag="p" fileKey="restaurant" path={['signature', 'dishes', i, 'desc']} value={dish.desc} multiline
                          className={`font-sans text-base leading-relaxed mb-6 block ${i % 2 !== 0 ? 'text-charcoal/65' : 'text-cream/60'}`} />
                        <Link to="/menu"
                          className={`inline-flex items-center gap-2 font-sans text-xs tracking-[0.22em] uppercase border-b pb-0.5 transition-colors duration-300 w-fit ${
                            i % 2 !== 0 ? 'text-forest border-forest/40 hover:border-forest' : 'text-gold border-gold/40 hover:border-gold'}`}
                        >
                          Vedi il menù completo <RiArrowRightLine size={12} />
                        </Link>
                      </div>
                    </div>
                  </SortableCard>
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <AddCardButton onClick={() => addItem('restaurant', ['signature', 'dishes'], { ...NEW_DISH })} label="Aggiungi piatto firma" className="mt-4" />
        </div>
      </section>

      {/* ── I VINI ── */}
      <section className="py-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[440px]">
          <div className="relative img-zoom overflow-hidden min-h-[300px]">
            <img src={r.vini.img} alt="Vini Franciacorta" className="w-full h-full object-cover" loading="lazy" />
            {isEditMode && <div className="absolute top-2 right-2 z-10"><PhotoBtn fileKey="restaurant" path={['vini', 'img']} /></div>}
          </div>
          <ScrollReveal direction="right" className="flex flex-col justify-center px-10 lg:px-16 py-16 bg-cream">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-6 h-px bg-gold/70" />
              <EditableText tag="span" fileKey="restaurant" path={['vini', 'sectionLabel']} value={r.vini.sectionLabel} className="section-label" />
            </div>
            <h2 className="font-script text-4xl text-forest-dark mb-5 leading-tight">
              <EditableText tag="span" fileKey="restaurant" path={['vini', 'title']} value={r.vini.title} className="inline" />{' '}
              <EditableText tag="span" fileKey="restaurant" path={['vini', 'titleItalic']} value={r.vini.titleItalic} className="italic text-gold inline" />{' '}
              <EditableText tag="span" fileKey="restaurant" path={['vini', 'titleSuffix']} value={r.vini.titleSuffix} className="inline" />
            </h2>
            <EditableText tag="p" fileKey="restaurant" path={['vini', 'body1']} value={r.vini.body1} multiline className="font-sans text-base text-charcoal/70 leading-relaxed mb-4 block" />
            <EditableText tag="p" fileKey="restaurant" path={['vini', 'body2']} value={r.vini.body2} multiline className="font-sans text-sm text-charcoal/55 leading-relaxed mb-8 block" />
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
            <EditableText tag="h3" fileKey="restaurant" path={['orari', 'title']} value={r.orari.title} className="font-serif text-2xl text-forest-dark mb-8 block" />
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => {
              const { active: a, over } = e
              if (!over || a.id === over.id) return
              const oldIdx = r.orari.slots.findIndex((_, i) => `slot-${i}` === a.id)
              const newIdx = r.orari.slots.findIndex((_, i) => `slot-${i}` === over.id)
              reorderItems('restaurant', ['orari', 'slots'], oldIdx, newIdx)
            }}>
              <SortableContext items={r.orari.slots.map((_, i) => `slot-${i}`)} strategy={verticalListSortingStrategy}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {r.orari.slots.map((o, i) => (
                    <SortableCard key={`slot-${i}`} id={`slot-${i}`}
                      onDuplicate={() => duplicateItem('restaurant', ['orari', 'slots'], i)}
                      onDelete={() => { if (r.orari.slots.length > 1) removeItem('restaurant', ['orari', 'slots'], i) }}
                    >
                      <div className="border border-charcoal/10 p-6">
                        <EditableText tag="p" fileKey="restaurant" path={['orari', 'slots', i, 'label']} value={o.label} className="section-label block mb-2" />
                        <EditableText tag="p" fileKey="restaurant" path={['orari', 'slots', i, 'value']} value={o.value} className="font-sans text-sm text-charcoal/70 block" />
                        <EditableText tag="p" fileKey="restaurant" path={['orari', 'slots', i, 'time']} value={o.time} className="font-sans text-base font-medium text-charcoal mt-1 block" />
                      </div>
                    </SortableCard>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
            <AddCardButton onClick={() => addItem('restaurant', ['orari', 'slots'], { ...NEW_SLOT })} label="Aggiungi orario" className="mt-4" />
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
