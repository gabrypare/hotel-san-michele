import { ALLERGENS } from '../../data/menuData'

export default function AllergenBadge({ type, size = 'sm' }) {
  const a = ALLERGENS[type]
  if (!a) return null
  const dim = size === 'sm' ? 22 : 28
  const fs  = size === 'sm' ? '0.6rem' : '0.7rem'

  return (
    <span className="allergen-wrap" style={{ lineHeight: 0 }}>
      <span
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: dim, height: dim, borderRadius: '50%',
          border: `1.5px solid ${a.color}`, backgroundColor: a.bg, color: a.color,
          fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: fs,
          cursor: 'help', userSelect: 'none',
          transition: 'transform 0.15s',
        }}
        onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.2)')}
        onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
        aria-label={a.label}
      >
        {a.id}
      </span>
      <span className="allergen-tooltip">{a.label}</span>
    </span>
  )
}
