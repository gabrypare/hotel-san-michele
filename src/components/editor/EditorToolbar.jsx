import { useState } from 'react'
import { useEditMode } from '../../context/EditModeContext'
import { RiSaveLine, RiCloseLine, RiEdit2Line, RiCheckLine, RiErrorWarningLine, RiLoaderLine } from 'react-icons/ri'

/* ── Password Modal ── */
function PasswordModal({ onClose }) {
  const { activate } = useEditMode()
  const [pw, setPw]       = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const ok = await activate(pw)
    setLoading(false)
    if (ok) {
      onClose()
    } else {
      setError('Password errata')
      setPw('')
    }
  }

  return (
    <div className="fixed inset-0 z-[300] bg-forest-deeper/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-cream w-full max-w-sm shadow-2xl">
        <div className="px-8 py-7">
          <div className="flex items-center gap-3 mb-6">
            <RiEdit2Line size={20} className="text-gold" />
            <h2 className="font-display italic text-2xl text-forest">Modalità Modifica</h2>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block font-sans text-[0.72rem] tracking-[0.2em] uppercase text-charcoal/50 mb-2">
                Password
              </label>
              <input
                type="password"
                value={pw}
                onChange={e => setPw(e.target.value)}
                autoFocus
                className="w-full bg-white border border-charcoal/15 px-4 py-3 font-sans text-sm text-charcoal focus:outline-none focus:border-gold transition-colors"
                placeholder="Inserisci la password"
              />
              {error && <p className="mt-2 text-red-500 font-sans text-xs">{error}</p>}
            </div>
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={!pw || loading}
                className="flex-1 bg-forest text-cream font-sans text-xs tracking-[0.2em] uppercase py-3 hover:bg-forest-dark transition-colors disabled:opacity-40"
              >
                {loading ? 'Verifica...' : 'Accedi'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 border border-charcoal/20 text-charcoal/60 font-sans text-xs tracking-[0.2em] uppercase hover:border-charcoal/40 transition-colors"
              >
                Annulla
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

/* ── Toolbar ── */
export default function EditorToolbar() {
  const { isEditMode, isDirty, saveStatus, save, deactivate } = useEditMode()
  const [showModal, setShowModal] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const timerRef = { current: null }

  const handleLogoClick = () => {
    setClickCount(c => {
      const next = c + 1
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setClickCount(0), 2000)
      if (next >= 5) {
        setClickCount(0)
        setShowModal(true)
      }
      return next
    })
  }

  if (!isEditMode) {
    return (
      <>
        {/* Hidden trigger — inject via URL param ?edit or 5-click on logo */}
        <div
          data-editor-trigger
          onClick={handleLogoClick}
          style={{ position: 'fixed', bottom: 0, right: 0, width: 60, height: 60, zIndex: 9999, cursor: 'default' }}
        />
        {showModal && <PasswordModal onClose={() => setShowModal(false)} />}
      </>
    )
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] bg-forest-deeper shadow-xl" style={{ height: 56 }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-full flex items-center justify-between gap-4">

        {/* Left */}
        <div className="flex items-center gap-3">
          <RiEdit2Line size={16} className="text-gold shrink-0" />
          <span className="font-sans text-[0.7rem] tracking-[0.22em] uppercase text-cream/70 hidden sm:block">
            Modalità Modifica
          </span>
          {isDirty && (
            <span className="font-sans text-[0.65rem] text-gold/70 hidden sm:block">
              — modifiche non salvate
            </span>
          )}
        </div>

        {/* Center hint */}
        <p className="font-sans text-[0.62rem] text-cream/30 tracking-wide hidden lg:block">
          Passa il cursore su testi e riquadri per modificarli · trascina ≡ per riordinare
        </p>

        {/* Right */}
        <div className="flex items-center gap-2 shrink-0">
          {saveStatus === 'saving' && (
            <span className="flex items-center gap-1.5 font-sans text-xs text-gold animate-pulse">
              <RiLoaderLine size={14} className="animate-spin" /> Salvataggio...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="flex items-center gap-1.5 font-sans text-xs text-emerald-400">
              <RiCheckLine size={14} /> Salvato — deploy in corso (~30s)
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="flex items-center gap-1.5 font-sans text-xs text-red-400">
              <RiErrorWarningLine size={14} /> Errore — riprova
            </span>
          )}

          <button
            onClick={save}
            disabled={!isDirty || saveStatus === 'saving'}
            className="flex items-center gap-1.5 px-4 py-2 bg-gold text-forest font-sans text-[0.7rem] tracking-[0.18em] uppercase font-medium hover:bg-gold-light transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
          >
            <RiSaveLine size={13} />
            Salva
          </button>

          <button
            onClick={deactivate}
            className="flex items-center gap-1.5 px-3 py-2 border border-cream/20 text-cream/60 font-sans text-[0.7rem] tracking-[0.18em] uppercase hover:border-cream/50 hover:text-cream transition-colors"
          >
            <RiCloseLine size={14} />
            Esci
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Exported trigger helper (used by Navbar logo) ── */
export function useEditorTrigger() {
  const [showModal, setShowModal] = useState(false)
  const count = { current: 0 }
  const timer = { current: null }

  const onLogoClick = () => {
    count.current++
    clearTimeout(timer.current)
    timer.current = setTimeout(() => { count.current = 0 }, 2000)
    if (count.current >= 5) {
      count.current = 0
      setShowModal(true)
    }
  }

  return { onLogoClick, modal: showModal ? <PasswordModal onClose={() => setShowModal(false)} /> : null }
}
