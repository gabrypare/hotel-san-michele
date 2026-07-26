import { useRef, useEffect } from 'react'
import { useEditMode } from '../../context/EditModeContext'

/**
 * In edit mode: testo modificabile (nessun link, per evitare che il click apra la chiamata).
 * In normal mode: <a href="tel:..."> con il numero aggiornato.
 * Aggiorna automaticamente phone_href derivandolo da phone (rimuove spazi/trattini).
 */
export default function EditablePhone({ className = '', linkClassName = '' }) {
  const { isEditMode, content, updateField } = useEditMode()
  const ref = useRef(null)

  const phone     = content.settings.contact.phone
  const phoneHref = content.settings.contact.phone_href

  useEffect(() => {
    if (ref.current && ref.current.textContent !== phone) {
      ref.current.textContent = phone
    }
  }, [phone])

  const onBlur = () => {
    if (!ref.current) return
    const newPhone = ref.current.textContent.trim()
    updateField('settings', ['contact', 'phone'], newPhone)
    // Deriva phone_href: rimuove spazi, parentesi, trattini
    const newHref = newPhone.replace(/[\s\-().]/g, '')
    updateField('settings', ['contact', 'phone_href'], newHref)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); ref.current?.blur() }
    if (e.key === 'Escape') { ref.current.textContent = phone; ref.current?.blur() }
  }

  if (isEditMode) {
    return (
      <span
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        className={`${className} outline-none ring-1 ring-blue-400/0 hover:ring-blue-400/60 focus:ring-blue-500 focus:bg-blue-500/5 rounded-[2px] cursor-text transition-all`}
      >
        {phone}
      </span>
    )
  }

  return (
    <a href={`tel:${phoneHref}`} className={linkClassName}>
      {phone}
    </a>
  )
}
