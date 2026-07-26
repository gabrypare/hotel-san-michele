import { useRef, useState, useEffect, useCallback } from 'react'
import { useEditMode } from '../../context/EditModeContext'
import { RiImageAddLine, RiDeleteBin6Line, RiLoaderLine } from 'react-icons/ri'

const QUALITY = 0.88
const MIN_SIZE = 48
const MAX_SIZE = 220

function resizeAndEncode(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      const MAX_PX = 900
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

/**
 * Props:
 *   src        — URL immagine corrente
 *   fileKey    — chiave JSON ('menu', ...)
 *   path       — path al campo photo
 *   sizePath   — path al campo photoSize (numero px)
 *   size       — dimensione corrente in px (default 72)
 *   className  — classi extra per l'img (object-cover ecc.)
 */
export default function EditableImage({ src, fileKey, path, sizePath, size = 72, className = '' }) {
  const { isEditMode, updateField, passwordRef } = useEditMode()
  const inputRef   = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState('')
  const [liveSize, setLiveSize]   = useState(size)

  /* Sincronizza liveSize quando size cambia dall'esterno */
  useEffect(() => { setLiveSize(size) }, [size])

  /* ── Resize drag ── */
  const startResize = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    const startX   = e.clientX
    const startSize = liveSize

    const onMove = (ev) => {
      const next = Math.max(MIN_SIZE, Math.min(MAX_SIZE, startSize + ev.clientX - startX))
      setLiveSize(next)
    }
    const onUp = (ev) => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
      const final = Math.max(MIN_SIZE, Math.min(MAX_SIZE, startSize + ev.clientX - startX))
      setLiveSize(final)
      if (sizePath) updateField(fileKey, sizePath, final)
    }
    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
  }, [liveSize, fileKey, sizePath, updateField])

  /* ── Upload ── */
  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const base64   = await resizeAndEncode(file)
      const filename = `dish-${Date.now()}.jpg`
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordRef.current, base64, filename }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Errore upload')
      updateField(fileKey, path, data.path)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  /* ── Modalità normale ── */
  if (!isEditMode) {
    return src
      ? <img src={src} alt="" style={{ width: liveSize, height: liveSize }} className={`object-cover rounded-sm ${className}`} loading="lazy" />
      : null
  }

  /* ── Modalità modifica ── */
  return (
    <div className="relative shrink-0 select-none" style={{ width: liveSize, height: liveSize }}>

      {/* Immagine o placeholder */}
      {src ? (
        <img src={src} alt="" className={`w-full h-full object-cover rounded-sm ${className}`} loading="lazy" />
      ) : (
        <div className="w-full h-full bg-charcoal/8 border border-dashed border-charcoal/20 rounded-sm flex items-center justify-center">
          <RiImageAddLine size={20} className="text-charcoal/30" />
        </div>
      )}

      {/* Bordo blu edit */}
      <div className="absolute inset-0 ring-2 ring-blue-400/60 rounded-sm pointer-events-none" />

      {/* Pulsanti in alto a destra — sempre visibili in edit mode */}
      <div className="absolute -top-7 right-0 flex items-center gap-0.5">
        {uploading ? (
          <span className="bg-gold text-forest text-[0.55rem] px-2 py-1 flex items-center gap-1">
            <RiLoaderLine size={10} className="animate-spin" /> Carico...
          </span>
        ) : (
          <>
            <button
              onClick={() => inputRef.current?.click()}
              className="bg-gold text-forest text-[0.55rem] tracking-widest uppercase font-semibold px-2 py-1 hover:bg-gold/80 transition-colors whitespace-nowrap"
            >
              {src ? 'Cambia' : '+ Foto'}
            </button>
            {src && (
              <button
                onClick={() => updateField(fileKey, path, '')}
                className="bg-red-500 text-white text-[0.55rem] tracking-widest uppercase px-2 py-1 hover:bg-red-600 transition-colors"
              >
                ✕
              </button>
            )}
          </>
        )}
      </div>

      {/* Handle resize — angolo in basso a destra */}
      {sizePath && (
        <div
          onPointerDown={startResize}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-10 flex items-end justify-end p-0.5"
          title="Trascina per ridimensionare"
        >
          {/* Triangolo visivo */}
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path d="M10 0 L10 10 L0 10 Z" fill="#3b82f6" opacity="0.8" />
          </svg>
        </div>
      )}

      {error && (
        <p className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-[0.5rem] text-center px-1 py-0.5">
          {error}
        </p>
      )}

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  )
}
