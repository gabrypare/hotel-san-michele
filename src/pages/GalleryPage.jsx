import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import ScrollReveal from '../components/ui/ScrollReveal'
import EditableText from '../components/editor/EditableText'
import SortableCard from '../components/editor/SortableCard'
import AddCardButton from '../components/editor/AddCardButton'
import { useEditMode } from '../context/EditModeContext'
import { RiCloseLine, RiArrowLeftSLine, RiArrowRightSLine, RiArrowLeftLine } from 'react-icons/ri'

const SPAN_OPTIONS = [
  { value: '',                    label: 'Normale (1×1)' },
  { value: 'col-span-2',          label: 'Largo (2×1)' },
  { value: 'col-span-2 row-span-2', label: 'Grande (2×2)' },
  { value: 'col-span-3',          label: 'Panoramico (3×1)' },
]

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

function PhotoBtn({ path, label = 'Cambia foto' }) {
  const { updateField, passwordRef } = useEditMode()
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const base64   = await resizeAndEncode(file)
      const filename = `gallery-${Date.now()}.jpg`
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordRef.current, base64, filename }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      updateField('gallery', path, data.path)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }
  return (
    <>
      <button onClick={() => inputRef.current?.click()}
        className="bg-gold text-forest text-[0.6rem] tracking-widest uppercase font-semibold px-2 py-1 shadow hover:bg-gold/80 transition-colors whitespace-nowrap">
        {uploading ? 'Carico...' : label}
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </>
  )
}

const NEW_PHOTO = { src: '/images/hotel-1.jpg', label: 'Nuova foto', cat: 'hotel', span: '' }

export default function GalleryPage() {
  const { isEditMode, content, addItem, removeItem, duplicateItem, reorderItems, updateField } = useEditMode()
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const g = content.gallery
  const [cat, setCat]         = useState('tutti')
  const [lightbox, setLightbox] = useState(null)

  const catKeys  = ['tutti', ...g.categories.filter(c => c.key !== 'tutti').map(c => c.key)]
  const catLabel = Object.fromEntries(g.categories.map(c => [c.key, c.label]))
  const filtered = g.photos.filter(p => cat === 'tutti' || p.cat === cat)

  const prev = () => {
    const idx = filtered.findIndex(p => p.src === lightbox.src)
    setLightbox(filtered[(idx - 1 + filtered.length) % filtered.length])
  }
  const next = () => {
    const idx = filtered.findIndex(p => p.src === lightbox.src)
    setLightbox(filtered[(idx + 1) % filtered.length])
  }

  return (
    <div className="bg-cream min-h-screen">

      {/* ── HERO ── */}
      <div className="relative h-[55vh] min-h-[400px] flex items-end overflow-hidden">
        <motion.img
          src={g.heroImg}
          alt="Galleria Hotel San Michele"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1 }}
          animate={{ scale: 1.06 }}
          transition={{ duration: 18, ease: 'linear' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deeper/95 via-forest-deeper/55 to-forest-deeper/20" />
        {isEditMode && (
          <div className="absolute top-4 right-4 z-20">
            <PhotoBtn path={['heroImg']} label="Cambia foto hero" />
          </div>
        )}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-cream/50 hover:text-gold font-sans text-xs tracking-widest uppercase mb-5 transition-colors duration-300">
            <RiArrowLeftLine size={13} /> Home
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-6 h-px bg-gold opacity-70" />
            <EditableText tag="span" fileKey="gallery" path={['heroLabel']} value={g.heroLabel} className="section-label" />
          </div>
          <h1 className="font-script text-4xl sm:text-5xl md:text-6xl text-cream leading-tight">
            <EditableText tag="span" fileKey="gallery" path={['heroTitle']} value={g.heroTitle} className="inline" />{' '}
            <EditableText tag="span" fileKey="gallery" path={['heroTitleItalic']} value={g.heroTitleItalic} className="italic text-gold-light inline" />
          </h1>
          <EditableText tag="p" fileKey="gallery" path={['heroSubtitle']} value={g.heroSubtitle} className="font-display italic text-cream/65 text-lg mt-3 block" />
        </div>
      </div>

      {/* ── CATEGORIE (edit: gestione, normal: filtro pill) ── */}
      <div className="bg-cream py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {isEditMode ? (
            <div>
              <p className="font-sans text-[0.65rem] tracking-widest uppercase text-charcoal/40 mb-3">Categorie (pill filtro)</p>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => {
                const { active: a, over } = e
                if (!over || a.id === over.id) return
                const oldI = g.categories.findIndex((_, i) => `cat-${i}` === a.id)
                const newI = g.categories.findIndex((_, i) => `cat-${i}` === over.id)
                reorderItems('gallery', ['categories'], oldI, newI)
              }}>
                <SortableContext items={g.categories.map((_, i) => `cat-${i}`)} strategy={verticalListSortingStrategy}>
                  <div className="flex flex-wrap gap-2">
                    {g.categories.map((c, i) => (
                      <SortableCard key={`cat-${i}`} id={`cat-${i}`}
                        onDuplicate={() => duplicateItem('gallery', ['categories'], i)}
                        onDelete={() => { if (g.categories.length > 1) removeItem('gallery', ['categories'], i) }}
                      >
                        <div className="px-4 py-2 border border-charcoal/20 bg-white flex items-center gap-2">
                          <EditableText tag="span" fileKey="gallery" path={['categories', i, 'key']} value={c.key} className="font-sans text-[0.65rem] text-charcoal/40 uppercase tracking-widest" />
                          <span className="text-charcoal/20">·</span>
                          <EditableText tag="span" fileKey="gallery" path={['categories', i, 'label']} value={c.label} className="font-sans text-[0.7rem] text-charcoal/70" />
                        </div>
                      </SortableCard>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
              <AddCardButton
                onClick={() => addItem('gallery', ['categories'], { key: 'nuova', label: 'Nuova categoria' })}
                label="Aggiungi categoria"
                className="mt-2"
              />
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-2.5">
              {catKeys.map(c => (
                <button key={c} onClick={() => setCat(c)}
                  className={`relative px-5 py-2 font-sans text-[0.7rem] tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer border whitespace-nowrap
                    ${cat === c
                      ? 'bg-forest-dark text-cream border-forest-dark'
                      : 'bg-transparent text-charcoal/50 border-charcoal/20 hover:border-charcoal/50 hover:text-charcoal/80'}`}>
                  {catLabel[c] ?? c}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── FOTO ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        {isEditMode ? (
          /* Edit mode: lista gestione foto */
          <div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => {
              const { active: a, over } = e
              if (!over || a.id === over.id) return
              const oldI = g.photos.findIndex((_, i) => `ph-${i}` === a.id)
              const newI = g.photos.findIndex((_, i) => `ph-${i}` === over.id)
              reorderItems('gallery', ['photos'], oldI, newI)
            }}>
              <SortableContext items={g.photos.map((_, i) => `ph-${i}`)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-3">
                  {g.photos.map((photo, i) => (
                    <SortableCard key={`ph-${i}`} id={`ph-${i}`}
                      onDuplicate={() => duplicateItem('gallery', ['photos'], i)}
                      onDelete={() => { if (g.photos.length > 1) removeItem('gallery', ['photos'], i) }}
                    >
                      <div className="flex items-center gap-4 bg-white border border-charcoal/10 p-3">
                        {/* Thumbnail */}
                        <div className="relative shrink-0 w-24 h-16 overflow-hidden bg-charcoal/5">
                          <img src={photo.src} alt={photo.label} className="w-full h-full object-cover" />
                          <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-1">
                            <PhotoBtn path={['photos', i, 'src']} label="Cambia" />
                          </div>
                        </div>
                        {/* Label */}
                        <div className="flex-1 min-w-0">
                          <p className="font-sans text-[0.6rem] text-charcoal/40 uppercase tracking-widest mb-0.5">Didascalia</p>
                          <EditableText tag="span" fileKey="gallery" path={['photos', i, 'label']} value={photo.label} className="font-sans text-sm text-charcoal block" />
                        </div>
                        {/* Categoria */}
                        <div className="shrink-0">
                          <p className="font-sans text-[0.6rem] text-charcoal/40 uppercase tracking-widest mb-1">Categoria</p>
                          <select
                            value={photo.cat}
                            onChange={e => updateField('gallery', ['photos', i, 'cat'], e.target.value)}
                            className="font-sans text-xs border border-charcoal/20 px-2 py-1.5 bg-white text-charcoal focus:outline-none focus:border-gold"
                          >
                            {g.categories.filter(c => c.key !== 'tutti').map(c => (
                              <option key={c.key} value={c.key}>{c.label}</option>
                            ))}
                          </select>
                        </div>
                        {/* Dimensione */}
                        <div className="shrink-0">
                          <p className="font-sans text-[0.6rem] text-charcoal/40 uppercase tracking-widest mb-1">Dimensione</p>
                          <select
                            value={photo.span}
                            onChange={e => updateField('gallery', ['photos', i, 'span'], e.target.value)}
                            className="font-sans text-xs border border-charcoal/20 px-2 py-1.5 bg-white text-charcoal focus:outline-none focus:border-gold"
                          >
                            {SPAN_OPTIONS.map(o => (
                              <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </SortableCard>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
            <AddCardButton onClick={() => addItem('gallery', ['photos'], { ...NEW_PHOTO })} label="Aggiungi foto" className="mt-3" />
          </div>
        ) : (
          /* Normal mode: griglia masonry con lightbox */
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <AnimatePresence>
              {filtered.map((photo, i) => {
                const responsiveSpan = (photo.span || '')
                  .replace('col-span-3', 'sm:col-span-2 lg:col-span-3')
                  .replace('col-span-2 row-span-2', 'sm:col-span-2 sm:row-span-2')
                  .replace(/^col-span-2$/, 'sm:col-span-2')
                return (
                  <motion.div
                    key={photo.src}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: i * 0.04 }}
                    className={`group relative overflow-hidden cursor-pointer ${responsiveSpan}`}
                    style={{ aspectRatio: photo.span?.includes('row-span-2') ? '1/1' : photo.span?.includes('col-span-3') ? '21/7' : photo.span?.includes('col-span-2') ? '16/7' : '1/1' }}
                    onClick={() => setLightbox(photo)}
                  >
                    <img src={photo.src} alt={photo.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-forest-deeper/0 group-hover:bg-forest-deeper/45 transition-all duration-400 flex items-center justify-center">
                      <span className="font-display italic text-cream text-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        {photo.label}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/60 hover:text-cream transition-colors z-10 p-3" onClick={e => { e.stopPropagation(); prev() }}>
              <RiArrowLeftSLine size={32} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.3 }}
              className="relative max-w-5xl max-h-[85vh]"
              onClick={e => e.stopPropagation()}
            >
              <img src={lightbox.src} alt={lightbox.label} className="max-w-full max-h-[78vh] object-contain" />
              <p className="text-center text-cream/55 font-sans text-xs tracking-widest uppercase mt-3">{lightbox.label}</p>
            </motion.div>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/60 hover:text-cream transition-colors z-10 p-3" onClick={e => { e.stopPropagation(); next() }}>
              <RiArrowRightSLine size={32} />
            </button>
            <button className="absolute top-5 right-5 text-cream/60 hover:text-cream w-10 h-10 flex items-center justify-center z-10" onClick={() => setLightbox(null)}>
              <RiCloseLine size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
