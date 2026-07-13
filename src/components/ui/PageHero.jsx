import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { RiArrowLeftLine } from 'react-icons/ri'

export default function PageHero({ img, label, title, titleItalic, subtitle, backTo = '/', backLabel = 'Home' }) {
  return (
    <div className="relative h-[55vh] min-h-[400px] flex items-end overflow-hidden">
      <motion.img
        src={img}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1 }}
        animate={{ scale: 1.06 }}
        transition={{ duration: 18, ease: 'linear' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-deeper/95 via-forest-deeper/55 to-forest-deeper/20" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pb-12">
        <Link
          to={backTo}
          className="inline-flex items-center gap-2 text-cream/50 hover:text-gold font-sans text-xs tracking-widest uppercase mb-5 transition-colors duration-300"
        >
          <RiArrowLeftLine size={13} /> {backLabel}
        </Link>

        {label && (
          <motion.div
            className="flex items-center gap-3 mb-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <span className="w-6 h-px bg-gold opacity-70" />
            <span className="section-label">{label}</span>
          </motion.div>
        )}

        <motion.h1
          className="font-serif text-4xl sm:text-5xl md:text-6xl text-cream leading-tight"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {title}{' '}
          {titleItalic && <span className="italic text-gold-light">{titleItalic}</span>}
        </motion.h1>

        {subtitle && (
          <motion.p
            className="font-display italic text-cream/65 text-lg mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  )
}
