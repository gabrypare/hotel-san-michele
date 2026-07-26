import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import ScrollReveal from '../components/ui/ScrollReveal'
import EditableText from '../components/editor/EditableText'
import SortableCard from '../components/editor/SortableCard'
import AddCardButton from '../components/editor/AddCardButton'
import { useEditMode } from '../context/EditModeContext'
import EditablePhone from '../components/editor/EditablePhone'
import { RiMapPin2Line, RiPhoneLine, RiMailLine, RiTimeLine, RiCheckLine, RiCameraLine } from 'react-icons/ri'

/* ── helpers ──────────────────────────────────────────────── */
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

/* ── form initial state ───────────────────────────────────── */
const INIT = { nome: '', email: '', telefono: '', arrivo: '', partenza: '', ospiti: '2', tipo: 'camera', messaggio: '' }

/* ── component ────────────────────────────────────────────── */
export default function PrenotaPage() {
  const { isEditMode, content, updateField, addItem, removeItem, duplicateItem, reorderItems } = useEditMode()
  const [form, setForm] = useState(INIT)
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')

  const pre  = content.prenota
  const set  = content.settings
  const hero = pre.hero
  const info = pre.info
  const hrs  = pre.hours
  const why  = pre.whyDirect

  const setF = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const submit = async (e) => {
    e.preventDefault()
    setSending(true)
    setSendError('')
    try {
      const res = await fetch('/api/send-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setSent(true)
        setForm(INIT)
      } else {
        setSendError(data.error ?? 'Errore durante l\'invio. Riprova.')
      }
    } catch {
      setSendError('Errore di rete. Controlla la connessione e riprova.')
    } finally {
      setSending(false)
    }
  }

  /* dnd for why-direct items */
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))
  const handleDndEnd = (e) => {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const oldIdx = why.items.findIndex((_, i) => `whydirect-${i}` === active.id)
    const newIdx = why.items.findIndex((_, i) => `whydirect-${i}` === over.id)
    reorderItems('prenota', ['whyDirect', 'items'], oldIdx, newIdx)
  }

  return (
    <div className="bg-cream min-h-screen">

      {/* ── HERO ──────────────────────────────────────────── */}
      <div className="relative h-[55vh] min-h-[380px] overflow-hidden">
        <img src={hero.img} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-forest-dark/60" />
        <PhotoBtn
          onUpload={(path) => updateField('prenota', ['hero', 'img'], path)}
          className="bottom-4 right-4"
        />
        <div className="relative h-full flex flex-col justify-end px-8 md:px-16 pb-14 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-px bg-gold/70" />
              <EditableText
                tag="span"
                fileKey="prenota" path={['hero', 'label']}
                value={hero.label}
                className="section-label text-cream/70"
              />
            </div>
            <h1 className="font-script text-5xl md:text-6xl text-cream leading-tight">
              <EditableText
                tag="span"
                fileKey="prenota" path={['hero', 'title']}
                value={hero.title}
              />{' '}
              <EditableText
                tag="em"
                fileKey="prenota" path={['hero', 'titleItalic']}
                value={hero.titleItalic}
                className="text-gold"
              />
            </h1>
            <EditableText
              tag="p"
              fileKey="prenota" path={['hero', 'subtitle']}
              value={hero.subtitle}
              className="font-sans text-sm text-cream/65 mt-3 tracking-wide"
            />
          </motion.div>
        </div>
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-5 gap-14">

          {/* ── INFO COLUMN ── */}
          <div className="lg:col-span-2">
            <ScrollReveal direction="left">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-6 h-px bg-gold/70" />
                <EditableText
                  tag="span"
                  fileKey="prenota" path={['info', 'sectionLabel']}
                  value={info.sectionLabel}
                  className="section-label"
                />
              </div>
              <h2 className="font-script text-3xl text-forest-dark mb-5 leading-tight">
                <EditableText tag="span" fileKey="prenota" path={['info', 'title']}      value={info.title} />{' '}
                <EditableText tag="span" fileKey="prenota" path={['info', 'titleItalic']} value={info.titleItalic} className="italic text-gold" />{' '}
                <EditableText tag="span" fileKey="prenota" path={['info', 'titleSuffix']} value={info.titleSuffix} />
              </h2>
              <EditableText
                tag="p"
                fileKey="prenota" path={['info', 'intro']}
                value={info.intro}
                multiline
                className="font-sans text-sm text-charcoal/65 leading-relaxed mb-8"
              />

              {/* Contact items */}
              <ul className="space-y-6">
                <li className="flex gap-4 items-start">
                  <div className="w-10 h-10 border border-gold/40 flex items-center justify-center shrink-0">
                    <RiMapPin2Line size={15} className="text-gold" />
                  </div>
                  <div>
                    <p className="font-sans text-[0.68rem] tracking-[0.22em] uppercase text-stone mb-1">Indirizzo</p>
                    <EditableText tag="p" fileKey="settings" path={['contact', 'address']} value={set.contact.address}
                      className="font-sans text-sm text-charcoal/80" />
                    <EditableText tag="p" fileKey="settings" path={['contact', 'city']}    value={set.contact.city}
                      className="font-sans text-sm text-charcoal/80" />
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="w-10 h-10 border border-gold/40 flex items-center justify-center shrink-0">
                    <RiPhoneLine size={15} className="text-gold" />
                  </div>
                  <div>
                    <p className="font-sans text-[0.68rem] tracking-[0.22em] uppercase text-stone mb-1">Telefono</p>
                    <EditablePhone
                      className="font-sans text-sm text-charcoal/80"
                      linkClassName="font-sans text-sm text-charcoal/80 hover:text-gold transition-colors duration-300"
                    />
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="w-10 h-10 border border-gold/40 flex items-center justify-center shrink-0">
                    <RiMailLine size={15} className="text-gold" />
                  </div>
                  <div>
                    <p className="font-sans text-[0.68rem] tracking-[0.22em] uppercase text-stone mb-1">Email</p>
                    <a href={`mailto:${set.contact.email}`} className="font-sans text-sm text-charcoal/80 hover:text-gold transition-colors duration-300">
                      <EditableText tag="span" fileKey="settings" path={['contact', 'email']} value={set.contact.email} />
                    </a>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="w-10 h-10 border border-gold/40 flex items-center justify-center shrink-0">
                    <RiTimeLine size={15} className="text-gold" />
                  </div>
                  <div>
                    <EditableText tag="p" fileKey="prenota" path={['hours', 'label']} value={hrs.label}
                      className="font-sans text-[0.68rem] tracking-[0.22em] uppercase text-stone mb-2" />
                    <div className="space-y-1 font-sans text-sm text-charcoal/80">
                      <EditableText tag="p" fileKey="prenota" path={['hours', 'reception']} value={hrs.reception} />
                      <EditableText tag="p" fileKey="prenota" path={['hours', 'lunch']}     value={hrs.lunch} />
                      <EditableText tag="p" fileKey="prenota" path={['hours', 'dinner']}    value={hrs.dinner} />
                      <EditableText tag="p" fileKey="prenota" path={['hours', 'closed']}    value={hrs.closed}
                        className="text-charcoal/45 text-xs mt-1" />
                    </div>
                  </div>
                </li>
              </ul>

              {/* Why book direct */}
              <div className="mt-10 bg-forest-dark p-6">
                <EditableText tag="p" fileKey="prenota" path={['whyDirect', 'title']} value={why.title}
                  className="font-sans text-xs tracking-[0.22em] uppercase text-gold mb-4" />
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDndEnd}>
                  <SortableContext
                    items={why.items.map((_, i) => `whydirect-${i}`)}
                    strategy={verticalListSortingStrategy}
                  >
                    <ul className="space-y-2">
                      {why.items.map((item, i) => (
                        <SortableCard
                          key={`whydirect-${i}`}
                          id={`whydirect-${i}`}
                          onDuplicate={() => duplicateItem('prenota', ['whyDirect', 'items'], i)}
                          onDelete={() => removeItem('prenota', ['whyDirect', 'items'], i)}
                        >
                          <li className="flex items-start gap-2 font-sans text-sm text-cream/60">
                            <RiCheckLine size={14} className="text-gold mt-0.5 shrink-0" />
                            <EditableText tag="span" fileKey="prenota" path={['whyDirect', 'items', i]} value={item} />
                          </li>
                        </SortableCard>
                      ))}
                    </ul>
                  </SortableContext>
                </DndContext>
                {isEditMode && (
                  <AddCardButton
                    onClick={() => addItem('prenota', ['whyDirect', 'items'], 'Nuovo vantaggio')}
                    className="mt-4"
                  />
                )}
              </div>
            </ScrollReveal>
          </div>

          {/* ── FORM ── */}
          <div className="lg:col-span-3">
            <ScrollReveal direction="right" delay={0.15}>
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="py-20 text-center"
                  >
                    <div className="w-16 h-16 border border-gold flex items-center justify-center mx-auto mb-6">
                      <RiCheckLine size={28} className="text-gold" />
                    </div>
                    <h3 className="font-serif text-2xl text-forest-dark mb-3">Messaggio Inviato</h3>
                    <p className="font-sans text-sm text-charcoal/60 max-w-xs mx-auto">
                      Grazie! Ti risponderemo entro 24 ore all'indirizzo email indicato.
                    </p>
                    <button onClick={() => setSent(false)} className="btn-outline-dark mt-8">
                      Invia un'altra richiesta
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onSubmit={submit}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block font-sans text-[0.68rem] tracking-[0.22em] uppercase text-stone mb-2">Nome e Cognome *</label>
                        <input type="text" name="nome" value={form.nome} onChange={setF} required placeholder="Mario Rossi"
                          className="w-full bg-transparent border border-charcoal/20 focus:border-gold outline-none px-4 py-3 font-sans text-sm text-charcoal placeholder-stone/60 transition-colors duration-300" />
                      </div>
                      <div>
                        <label className="block font-sans text-[0.68rem] tracking-[0.22em] uppercase text-stone mb-2">Email *</label>
                        <input type="email" name="email" value={form.email} onChange={setF} required placeholder="mario@esempio.it"
                          className="w-full bg-transparent border border-charcoal/20 focus:border-gold outline-none px-4 py-3 font-sans text-sm text-charcoal placeholder-stone/60 transition-colors duration-300" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block font-sans text-[0.68rem] tracking-[0.22em] uppercase text-stone mb-2">Telefono</label>
                        <input type="tel" name="telefono" value={form.telefono} onChange={setF} placeholder="+39 000 0000000"
                          className="w-full bg-transparent border border-charcoal/20 focus:border-gold outline-none px-4 py-3 font-sans text-sm text-charcoal placeholder-stone/60 transition-colors duration-300" />
                      </div>
                      <div>
                        <label className="block font-sans text-[0.68rem] tracking-[0.22em] uppercase text-stone mb-2">Tipo di richiesta</label>
                        <select name="tipo" value={form.tipo} onChange={setF}
                          className="w-full bg-cream border border-charcoal/20 focus:border-gold outline-none px-4 py-3 font-sans text-sm text-charcoal transition-colors duration-300 cursor-pointer">
                          <option value="camera">Prenotazione camera</option>
                          <option value="ristorante">Prenotazione ristorante</option>
                          <option value="evento">Evento / Banchetto</option>
                          <option value="info">Informazioni generali</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-5">
                      <div>
                        <label className="block font-sans text-[0.68rem] tracking-[0.22em] uppercase text-stone mb-2">Arrivo</label>
                        <input type="date" name="arrivo" value={form.arrivo} onChange={setF}
                          className="w-full bg-transparent border border-charcoal/20 focus:border-gold outline-none px-4 py-3 font-sans text-sm text-charcoal transition-colors duration-300" />
                      </div>
                      <div>
                        <label className="block font-sans text-[0.68rem] tracking-[0.22em] uppercase text-stone mb-2">Partenza</label>
                        <input type="date" name="partenza" value={form.partenza} onChange={setF}
                          className="w-full bg-transparent border border-charcoal/20 focus:border-gold outline-none px-4 py-3 font-sans text-sm text-charcoal transition-colors duration-300" />
                      </div>
                      <div>
                        <label className="block font-sans text-[0.68rem] tracking-[0.22em] uppercase text-stone mb-2">Ospiti</label>
                        <input type="number" name="ospiti" value={form.ospiti} onChange={setF} min="1" max="20"
                          className="w-full bg-transparent border border-charcoal/20 focus:border-gold outline-none px-4 py-3 font-sans text-sm text-charcoal transition-colors duration-300" />
                      </div>
                    </div>

                    <div>
                      <label className="block font-sans text-[0.68rem] tracking-[0.22em] uppercase text-stone mb-2">Messaggio</label>
                      <textarea name="messaggio" value={form.messaggio} onChange={setF} rows={5}
                        placeholder="Richieste speciali, allergie alimentari, preferenze di camera, occasioni speciali..."
                        className="w-full bg-transparent border border-charcoal/20 focus:border-gold outline-none px-4 py-3 font-sans text-sm text-charcoal placeholder-stone/60 transition-colors duration-300 resize-none" />
                    </div>

                    <div>
                      <button type="submit" disabled={sending}
                        className="btn-gold w-full sm:w-auto sm:px-14 disabled:opacity-60 disabled:cursor-not-allowed">
                        {sending ? 'Invio in corso…' : 'Invia Richiesta'}
                      </button>
                      {sendError && (
                        <p className="font-sans text-sm text-red-600 mt-3">{sendError}</p>
                      )}
                      <p className="font-sans text-[0.65rem] text-charcoal/35 mt-3">
                        I dati sono trattati ai sensi del GDPR (Reg. UE 2016/679). Non verranno condivisi con terze parti.
                      </p>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  )
}
