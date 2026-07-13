import { motion } from 'framer-motion'

const VARIANTS = {
  up:    { hidden: { opacity: 0, y: 50 },   visible: { opacity: 1, y: 0 } },
  down:  { hidden: { opacity: 0, y: -40 },  visible: { opacity: 1, y: 0 } },
  left:  { hidden: { opacity: 0, x: -50 },  visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 50 },   visible: { opacity: 1, x: 0 } },
  fade:  { hidden: { opacity: 0 },           visible: { opacity: 1 } },
  scale: { hidden: { opacity: 0, scale: 0.93 }, visible: { opacity: 1, scale: 1 } },
}

export default function ScrollReveal({ children, direction = 'up', delay = 0, duration = 0.85, className = '', once = true }) {
  return (
    <motion.div
      className={className}
      variants={VARIANTS[direction]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-60px' }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
