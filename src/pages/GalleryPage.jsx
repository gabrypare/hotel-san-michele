import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHero from '../components/ui/PageHero'
import ScrollReveal from '../components/ui/ScrollReveal'
import { RiCloseLine, RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri'
import galleryJson from '../content/gallery.json'

const HERO_IMG = galleryJson.heroImg
const PHOTOS   = galleryJson.photos
const CATS     = ['tutti', ...galleryJson.categories.filter(c => c.key !== 'tutti').map(c => c.key)]
const CAT_LABEL = Object.fromEntries(galleryJson.categories.map(c => [c.key, c.label]))

export default function GalleryPage() {
  const [cat, setCat]         = useState('tutti')
  const [lightbox, setLightbox] = useState(null)

  const filtered = PHOTOS.filter(p => cat === 'tutti' || p.cat === cat)

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
      <PageHero
        img={HERO_IMG}
        label="Le immagini"
        title="La"
        titleItalic="Galleria"
        subtitle="Hotel, ristorante, cucina e territorio in scatti"
        backLabel="Home"
      />

      {/* Filter pills */}
      <div className="bg-cream py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-wrap justify-center gap-2.5">
          {CATS.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`relative px-5 py-2 font-sans text-[0.7rem] tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer border whitespace-nowrap
                ${cat === c
                  ? 'bg-forest-dark text-cream border-forest-dark'
                  : 'bg-transparent text-charcoal/50 border-charcoal/20 hover:border-charcoal/50 hover:text-charcoal/80'}`}
            >
              {CAT_LABEL[c]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
        >
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
                <img
                  src={photo.src}
                  alt={photo.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
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
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/60 hover:text-cream transition-colors z-10 p-3" onClick={e => { e.stopPropagation(); prev() }}>
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
            <button
              className="absolute top-5 right-5 text-cream/60 hover:text-cream w-10 h-10 flex items-center justify-center z-10"
              onClick={() => setLightbox(null)}
            >
              <RiCloseLine size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
