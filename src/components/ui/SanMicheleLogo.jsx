export default function SanMicheleLogo({ light = false, size = 'md' }) {
  const height  = size === 'lg' ? 88 : 72
  const gold    = '#C9A96E'
  const text    = light ? '#f7f2e8'               : '#1c1510'
  const sub     = light ? 'rgba(247,242,232,0.50)' : 'rgba(42,34,24,0.45)'

  return (
    <div className="flex items-center gap-3.5 select-none">

      {/* ── Logo SVG ── */}
      <img
        src="/images/logo.svg"
        alt="Hotel San Michele"
        height={height}
        style={{
          height,
          width: 'auto',
          display: 'block',
          filter: light ? 'brightness(0) invert(1)' : 'none',
          transition: 'filter 0.4s',
        }}
        draggable={false}
      />

      {/* ── Testo a fianco ── */}
      <div className="flex flex-col leading-none">
        <span
          style={{ color: gold, letterSpacing: '0.28em' }}
          className="font-sans text-[0.6rem] uppercase mb-[4px]"
        >
          Hotel · Ristorante
        </span>
        <span
          style={{ color: text, letterSpacing: '0.06em' }}
          className="font-serif text-[1.2rem]"
        >
          San Michele
        </span>
        <span
          style={{ color: sub, letterSpacing: '0.22em' }}
          className="font-sans text-[0.5rem] uppercase mt-[4px]"
        >
          Ome · Franciacorta
        </span>
      </div>

    </div>
  )
}
