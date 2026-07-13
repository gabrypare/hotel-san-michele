import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { RiMenuLine, RiCloseLine } from 'react-icons/ri'
import SanMicheleLogo from '../ui/SanMicheleLogo'
import navJson from '../../content/nav.json'

const NAV = navJson.items

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isHome   = location.pathname === '/'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    if (open) {
      const y = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${y}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
    } else {
      const y = parseInt(document.body.style.top || '0') * -1
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      window.scrollTo(0, y)
    }
    return () => {
      const y = parseInt(document.body.style.top || '0') * -1
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      if (y) window.scrollTo(0, y)
    }
  }, [open])

  const solid = scrolled || !isHome || open
  const textCls = solid ? 'text-charcoal' : 'text-cream'
  const logoCls = solid ? 'text-forest'   : 'text-cream'

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${solid ? 'bg-cream shadow-sm' : 'bg-transparent'}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" onClick={() => setOpen(false)}>
            <SanMicheleLogo light={!solid} />
          </Link>

          {/* Desktop */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV.map(n => (
              <Link
                key={n.label}
                to={n.href}
                className={`relative font-sans text-[0.78rem] tracking-wide group transition-colors duration-300 hover:text-gold ${
                  location.pathname === n.href ? 'text-gold' : textCls
                }`}
              >
                {n.label}
                <span className={`absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-300 ${
                  location.pathname === n.href ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
            <Link
              to="/prenota"
              className={`font-sans text-[0.72rem] tracking-[0.2em] uppercase px-5 py-2.5 transition-all duration-300 ${
                solid
                  ? 'border border-forest text-forest hover:bg-forest hover:text-cream'
                  : 'border border-cream/80 text-cream hover:bg-cream hover:text-forest'
              }`}
            >
              Prenota
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className={`lg:hidden p-2 ${textCls} transition-colors duration-300`}
            onClick={() => setOpen(v => !v)}
            aria-label="Menu"
          >
            {open ? <RiCloseLine size={26} /> : <RiMenuLine size={26} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-forest-deeper flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center gap-4 sm:gap-7">
              {[...NAV, { label: 'Prenota', href: '/prenota' }].map((n, i) => (
                <motion.div
                  key={n.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4 }}
                >
                  <Link
                    to={n.href}
                    onClick={() => setOpen(false)}
                    className={`font-display text-[1.7rem] sm:text-[2.1rem] md:text-[2.4rem] italic tracking-wide transition-colors duration-300 hover:text-gold-light ${
                      location.pathname === n.href ? 'text-gold' : 'text-cream'
                    }`}
                  >
                    {n.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            <motion.p
              className="absolute bottom-10 font-sans text-[0.65rem] tracking-[0.28em] uppercase text-cream/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Via S. Michele 5 · 25050 Ome (BS)
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
