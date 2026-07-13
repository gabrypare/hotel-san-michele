import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollReveal from '../ui/ScrollReveal'

const PHOTOS = [
  {
    src: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/3c/d5/79/caption.jpg?w=800&h=600&s=1',
    label: "L'Hotel",
    aspect: 'tall',
  },
  {
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
    label: 'Il Ristorante',
    aspect: 'normal',
  },
  {
    src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    label: 'La Cucina',
    aspect: 'normal',
  },
  {
    src: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
    label: 'Le Camere',
    aspect: 'normal',
  },
  {
    src: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/f8/32/c2/photo4jpg.jpg?w=800&h=600&s=1',
    label: 'La Terrazza',
    aspect: 'tall',
  },
  {
    src: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
    label: 'Il Franciacorta',
    aspect: 'normal',
  },
  {
    src: 'https://images.unsplash.com/photo-1506377585622-bedcbb027afc?auto=format&fit=crop&w=800&q=80',
    label: 'I Vigneti',
    aspect: 'wide',
  },
  {
    src: 'https://images.unsplash.com/photo-1533920379810-6bedac961555?auto=format&fit=crop&w=800&q=80',
    label: 'La Colazione',
    aspect: 'normal',
  },
]

export default function GallerySection() {
  const [lightbox, setLightbox] = useState(null)

  return (
    <section id="galleria" className="bg-forest-darker section-py" style={{ background: '#111d14' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6">
          <div>
            <ScrollReveal direction="fade">
              <div className="flex items-center gap-4 mb-4">
                <span className="w-8 h-px bg-gold opacity-60" />
                <span className="font-sans text-[0.68rem] tracking-[0.35em] uppercase text-gold">
                  Immagini
                </span>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="left" delay={0.1}>
              <h2 className="font-serif text-4xl lg:text-5xl text-cream leading-tight">
                La <span className="italic text-gold-light">Galleria</span>
              </h2>
            </ScrollReveal>
          </div>
          <ScrollReveal direction="right" delay={0.1}>
            <p className="font-sans text-sm text-cream/45 max-w-xs leading-relaxed">
              Scorci dell'hotel, della cucina, del paesaggio. Il San Michele in immagini.
            </p>
          </ScrollReveal>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {PHOTOS.map((photo, i) => (
            <ScrollReveal key={i} direction="scale" delay={0.05 * i}>
              <div
                className={`gallery-item cursor-pointer ${
                  photo.aspect === 'tall' ? 'row-span-2' : ''
                } ${photo.aspect === 'wide' ? 'col-span-2' : ''}`}
                style={{ aspectRatio: photo.aspect === 'tall' ? '3/4' : photo.aspect === 'wide' ? '16/7' : '1/1' }}
                onClick={() => setLightbox(photo)}
              >
                <img
                  src={photo.src}
                  alt={photo.label}
                  loading="lazy"
                />
                <div className="gallery-overlay">
                  <span>{photo.label}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-4xl max-h-[85vh]"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={lightbox.src}
                alt={lightbox.label}
                className="max-w-full max-h-[80vh] object-contain"
              />
              <p className="text-center text-cream/60 font-sans text-xs tracking-widest uppercase mt-3">
                {lightbox.label}
              </p>
              <button
                className="absolute top-3 right-3 text-cream/60 hover:text-cream text-2xl font-light w-8 h-8 flex items-center justify-center"
                onClick={() => setLightbox(null)}
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
