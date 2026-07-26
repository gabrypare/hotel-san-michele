import { useRef, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import ScrollReveal from '../components/ui/ScrollReveal'
import EditableText from '../components/editor/EditableText'
import SortableCard from '../components/editor/SortableCard'
import AddCardButton from '../components/editor/AddCardButton'
import { useEditMode } from '../context/EditModeContext'
import {
  RiArrowLeftLine, RiCheckLine, RiArrowRightLine,
  RiArrowLeftSLine, RiArrowRightSLine, RiCloseLine,
} from 'react-icons/ri'

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

function PhotoBtn({ roomIdx, photoIdx, label = 'Cambia foto' }) {
  const { updateField, passwordRef } = useEditMode()
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const base64  = await resizeAndEncode(file)
      const filename = `room-${Date.now()}.jpg`
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordRef.current, base64, filename }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      updateField('rooms', ['rooms', roomIdx, 'photos', photoIdx], data.path)
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

export default function RoomPage() {
  const { slug } = useParams()
  const { isEditMode, content, addItem, removeItem, duplicateItem, reorderItems } = useEditMode()
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const rooms = content.rooms.rooms
  const roomIdx = rooms.findIndex(r => r.slug === slug)
  const room = rooms[roomIdx]

  const [activePhoto, setActivePhoto] = useState(0)
  const [lightbox, setLightbox]       = useState(false)

  if (!room) return <Navigate to="/hotel" replace />

  const prev = () => setActivePhoto(i => (i - 1 + room.photos.length) % room.photos.length)
  const next = () => setActivePhoto(i => (i + 1) % room.photos.length)

  const prevRoom = rooms[roomIdx - 1] ?? null
  const nextRoom = rooms[roomIdx + 1] ?? null

  return (
    <div className="bg-cream min-h-screen">

      {/* ── HERO PHOTO + GALLERY ── */}
      <section className="relative">
        <div className="relative h-[55vh] md:h-[80vh] min-h-[280px] md:min-h-[520px] bg-forest-deeper flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={activePhoto}
              src={room.photos[activePhoto]}
              alt={`${room.name} — foto ${activePhoto + 1}`}
              className="max-h-full max-w-full object-contain"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          </AnimatePresence>

          <Link
            to="/hotel"
            className="absolute top-6 left-6 z-10 inline-flex items-center gap-2 text-cream/80 hover:text-gold font-sans text-xs tracking-widest uppercase transition-colors duration-300 bg-forest-deeper/50 backdrop-blur-sm px-3 py-2"
          >
            <RiArrowLeftLine size={12} /> Le camere
          </Link>

          {isEditMode && (
            <div className="absolute top-6 right-6 z-20 flex gap-2">
              <PhotoBtn roomIdx={roomIdx} photoIdx={activePhoto} label={`Cambia foto ${activePhoto + 1}`} />
              {room.photos.length > 1 && (
                <button
                  onClick={() => {
                    removeItem('rooms', ['rooms', roomIdx, 'photos'], activePhoto)
                    setActivePhoto(i => Math.min(i, room.photos.length - 2))
                  }}
                  className="bg-red-500 text-white text-[0.6rem] tracking-widest uppercase font-semibold px-2 py-1 shadow-lg hover:bg-red-600 transition-colors"
                >
                  ✕ Elimina
                </button>
              )}
              <button
                onClick={() => {
                  addItem('rooms', ['rooms', roomIdx, 'photos'], room.photos[activePhoto])
                  setActivePhoto(room.photos.length)
                }}
                className="bg-gold/80 text-forest text-[0.6rem] tracking-widest uppercase font-semibold px-2 py-1 shadow-lg hover:bg-gold transition-colors"
              >
                + Duplica
              </button>
            </div>
          )}

          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-forest-deeper/60 hover:bg-gold text-cream hover:text-forest-dark flex items-center justify-center transition-all duration-300">
            <RiArrowLeftSLine size={24} />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-forest-deeper/60 hover:bg-gold text-cream hover:text-forest-dark flex items-center justify-center transition-all duration-300">
            <RiArrowRightSLine size={24} />
          </button>

          <div className="absolute bottom-5 right-6 z-10 font-sans text-[0.65rem] tracking-[0.2em] uppercase text-cream/50">
            {activePhoto + 1} / {room.photos.length}
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className="bg-forest-dark py-3 px-6">
          <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto scrollbar-none">
            {room.photos.map((src, i) => (
              <button
                key={i}
                onClick={() => setActivePhoto(i)}
                className={`shrink-0 w-20 h-14 overflow-hidden transition-all duration-300 border-2 ${
                  i === activePhoto ? 'border-gold opacity-100' : 'border-transparent opacity-45 hover:opacity-75'
                }`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-14">

            {/* Description */}
            <div className="lg:col-span-3">
              <ScrollReveal direction="left">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-6 h-px bg-gold/70" />
                  <EditableText tag="span" fileKey="rooms" path={['rooms', roomIdx, 'label']} value={room.label} className="section-label" />
                </div>
                <EditableText tag="h1" fileKey="rooms" path={['rooms', roomIdx, 'name']} value={room.name} className="font-script text-4xl lg:text-5xl text-forest-dark mb-2 leading-tight block" />
                <EditableText tag="p" fileKey="rooms" path={['rooms', roomIdx, 'tagline']} value={room.tagline} className="font-display italic text-xl text-gold mb-8 block" />

                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-charcoal/10">
                  {[
                    { label: 'Superficie', field: 'size' },
                    { label: 'Ospiti',     field: 'guests' },
                    { label: 'Prezzo',     field: 'price' },
                  ].map(d => (
                    <div key={d.label}>
                      <p className="font-sans text-[0.62rem] tracking-[0.22em] uppercase text-stone mb-1">{d.label}</p>
                      <EditableText tag="p" fileKey="rooms" path={['rooms', roomIdx, d.field]} value={room[d.field]} className="font-display italic text-lg text-forest-dark block" />
                    </div>
                  ))}
                </div>

                <EditableText
                  tag="p"
                  fileKey="rooms"
                  path={['rooms', roomIdx, 'desc']}
                  value={room.desc}
                  multiline
                  className="font-sans text-base text-charcoal/70 leading-relaxed mb-10 block"
                />

                <Link to="/prenota" className="btn-gold inline-flex items-center gap-2">
                  Prenota questa camera <RiArrowRightLine size={13} />
                </Link>
              </ScrollReveal>
            </div>

            {/* Features */}
            <div className="lg:col-span-2">
              <ScrollReveal direction="right" delay={0.15}>
                <div className="bg-forest-dark p-8">
                  <p className="font-sans text-[0.68rem] tracking-[0.25em] uppercase text-gold mb-6">Dotazioni</p>

                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => {
                    const { active: a, over } = e
                    if (!over || a.id === over.id) return
                    const oldI = room.features.findIndex((_, i) => `feat-${i}` === a.id)
                    const newI = room.features.findIndex((_, i) => `feat-${i}` === over.id)
                    reorderItems('rooms', ['rooms', roomIdx, 'features'], oldI, newI)
                  }}>
                    <SortableContext items={room.features.map((_, i) => `feat-${i}`)} strategy={verticalListSortingStrategy}>
                      <ul className="space-y-3">
                        {room.features.map((f, i) => (
                          <SortableCard key={`feat-${i}`} id={`feat-${i}`}
                            onDuplicate={() => duplicateItem('rooms', ['rooms', roomIdx, 'features'], i)}
                            onDelete={() => { if (room.features.length > 1) removeItem('rooms', ['rooms', roomIdx, 'features'], i) }}
                            compact
                          >
                            <li className="flex items-start gap-3 font-sans text-sm text-cream/65">
                              <RiCheckLine size={14} className="text-gold shrink-0 mt-0.5" />
                              <EditableText tag="span" fileKey="rooms" path={['rooms', roomIdx, 'features', i]} value={f} className="flex-1" />
                            </li>
                          </SortableCard>
                        ))}
                      </ul>
                    </SortableContext>
                  </DndContext>
                  <AddCardButton
                    onClick={() => addItem('rooms', ['rooms', roomIdx, 'features'], 'Nuova dotazione')}
                    label="Aggiungi dotazione"
                    className="mt-2 border-cream/20 text-cream/40 hover:border-cream/40"
                  />

                  <div className="mt-8 pt-6 border-t border-cream/10">
                    <EditableText tag="p" fileKey="rooms" path={['rooms', roomIdx, 'price']} value={room.price} className="font-display italic text-2xl text-gold-light mb-1 block" />
                    <p className="font-sans text-xs text-cream/40 mb-5">Colazione inclusa · Cancellazione gratuita</p>
                    <Link to="/prenota" className="btn-gold w-full text-center block">
                      Prenota ora
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── NAVIGATE OTHER ROOMS ── */}
      {(prevRoom || nextRoom) && (
        <section className="border-t border-charcoal/10 bg-cream-dark">
          <div className="max-w-6xl mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-2">
              {prevRoom ? (
                <Link to={`/hotel/${prevRoom.slug}`} className="group flex items-center gap-4 py-8 pr-8 border-r border-charcoal/10 hover:text-gold transition-colors duration-300">
                  <RiArrowLeftLine size={18} className="text-stone group-hover:text-gold transition-colors shrink-0" />
                  <div>
                    <p className="font-sans text-[0.62rem] tracking-[0.2em] uppercase text-stone mb-1">Camera precedente</p>
                    <p className="font-serif text-lg text-forest-dark group-hover:text-gold transition-colors">{prevRoom.name}</p>
                  </div>
                </Link>
              ) : <div />}
              {nextRoom ? (
                <Link to={`/hotel/${nextRoom.slug}`} className="group flex items-center justify-end gap-4 py-8 pl-8 hover:text-gold transition-colors duration-300">
                  <div className="text-right">
                    <p className="font-sans text-[0.62rem] tracking-[0.2em] uppercase text-stone mb-1">Camera successiva</p>
                    <p className="font-serif text-lg text-forest-dark group-hover:text-gold transition-colors">{nextRoom.name}</p>
                  </div>
                  <RiArrowRightLine size={18} className="text-stone group-hover:text-gold transition-colors shrink-0" />
                </Link>
              ) : <div />}
            </div>
          </div>
        </section>
      )}

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-50 bg-forest-deeper/96 flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
          >
            <button className="absolute top-5 right-5 w-10 h-10 border border-cream/30 flex items-center justify-center text-cream hover:border-gold hover:text-gold transition-all duration-300" onClick={() => setLightbox(false)}>
              <RiCloseLine size={20} />
            </button>
            <button className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 border border-cream/30 flex items-center justify-center text-cream hover:border-gold hover:text-gold transition-all duration-300" onClick={e => { e.stopPropagation(); prev() }}>
              <RiArrowLeftSLine size={24} />
            </button>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 border border-cream/30 flex items-center justify-center text-cream hover:border-gold hover:text-gold transition-all duration-300" onClick={e => { e.stopPropagation(); next() }}>
              <RiArrowRightSLine size={24} />
            </button>
            <motion.img
              key={activePhoto}
              src={room.photos[activePhoto]}
              alt={room.name}
              className="max-h-[85vh] max-w-[90vw] object-contain"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={e => e.stopPropagation()}
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {room.photos.map((_, i) => (
                <button key={i} onClick={e => { e.stopPropagation(); setActivePhoto(i) }}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === activePhoto ? 'bg-gold w-5' : 'bg-cream/40'}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
