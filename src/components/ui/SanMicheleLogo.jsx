export default function SanMicheleLogo({ light = false, size = 'md' }) {
  const gold   = '#C9A96E'
  const text   = light ? '#f7f2e8' : '#1c1510'
  const sub    = light ? 'rgba(247,242,232,0.45)' : 'rgba(42,34,24,0.45)'
  const emblem = size === 'lg' ? 52 : 40

  return (
    <div className="flex items-center gap-3 select-none">

      {/* ── EMBLEMA SVG ── */}
      <svg width={emblem} height={emblem} viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">

        {/* Diamante esterno */}
        <polygon
          points="26,1 51,26 26,51 1,26"
          stroke={gold} strokeWidth="0.8" fill="none"
        />
        {/* Diamante interno (sottile) */}
        <polygon
          points="26,7 45,26 26,45 7,26"
          stroke={gold} strokeWidth="0.35" fill="none" opacity="0.55"
        />

        {/* Grappolo d'uva — 7 acini */}
        {/* riga 1 */}
        <circle cx="26"   cy="17"  r="3"   fill={gold}/>
        {/* riga 2 */}
        <circle cx="21.5" cy="22.5" r="3"  fill={gold}/>
        <circle cx="30.5" cy="22.5" r="3"  fill={gold}/>
        {/* riga 3 */}
        <circle cx="17"   cy="28"  r="3"   fill={gold}/>
        <circle cx="26"   cy="28"  r="3"   fill={gold}/>
        <circle cx="35"   cy="28"  r="3"   fill={gold}/>
        {/* riga 4 — singolo */}
        <circle cx="26"   cy="33.5" r="3"  fill={gold}/>

        {/* Raspo / gambo */}
        <path d="M26 13.5 L26 17" stroke={gold} strokeWidth="1" strokeLinecap="round"/>
        {/* Viticcio */}
        <path d="M26 13 Q29.5 9.5 33 10.5 Q31 14 26 13Z" fill={gold}/>
        {/* Fogliolina */}
        <path d="M26 13 Q22.5 9 19.5 11 Q21 14.5 26 13Z" fill={gold} opacity="0.65"/>
      </svg>

      {/* ── TESTO ── */}
      <div className="flex flex-col leading-none">
        <span
          style={{ color: gold, letterSpacing: '0.28em' }}
          className="font-sans text-[0.5rem] uppercase mb-[3px]"
        >
          Hotel · Ristorante
        </span>
        <span
          style={{ color: text, letterSpacing: '0.06em' }}
          className="font-serif text-[1.05rem]"
        >
          San Michele
        </span>
        <span
          style={{ color: sub, letterSpacing: '0.22em' }}
          className="font-sans text-[0.42rem] uppercase mt-[3px]"
        >
          Ome · Franciacorta
        </span>
      </div>

    </div>
  )
}
