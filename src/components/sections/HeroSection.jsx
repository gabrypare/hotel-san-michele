import { motion } from 'framer-motion'

const HERO_IMG = 'https://images.unsplash.com/photo-1506377585622-bedcbb027afc?auto=format&fit=crop&w=1920&q=80'

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function HeroSection() {
  return (
    <section className="relative h-screen min-h-[620px] flex items-center justify-center overflow-hidden">

      {/* Background image — Ken Burns via motion */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1 }}
        animate={{ scale: 1.09 }}
        transition={{ duration: 22, ease: 'linear' }}
      >
        <img
          src={HERO_IMG}
          alt="Vigneti della Franciacorta"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </motion.div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest-deeper/75 via-forest-deeper/55 to-forest-deeper/80 pointer-events-none" />

      {/* Grain texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">

        {/* Location badge */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9 }}
        >
          <span className="flex-shrink-0 w-10 h-px bg-gold" />
          <span className="font-sans text-[0.68rem] tracking-[0.38em] uppercase text-gold">
            Franciacorta · Ome · Brescia
          </span>
          <span className="flex-shrink-0 w-10 h-px bg-gold" />
        </motion.div>

        {/* Title */}
        <motion.h1
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] text-cream leading-[1.05] mb-5"
          initial={{ opacity: 0, y: 45 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Hotel Ristorante
          <br />
          <em className="not-italic" style={{ color: '#d4aa52' }}>San Michele</em>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="font-display text-lg sm:text-xl md:text-2xl text-cream/75 italic mb-12 leading-snug"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.9 }}
        >
          "Dove la storia della Franciacorta incontra l'eccellenza"
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <button onClick={() => scrollTo('hotel')} className="btn-gold w-52">
            Scopri l'Hotel
          </button>
          <button onClick={() => scrollTo('ristorante')} className="btn-outline-cream w-52">
            Il Ristorante
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer text-cream/50 hover:text-gold transition-colors duration-300"
        onClick={() => scrollTo('about')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        <span className="font-sans text-[0.62rem] tracking-[0.35em] uppercase">Scopri</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="w-px h-8 bg-current"
        />
      </motion.div>
    </section>
  )
}
