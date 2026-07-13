import { useRef, useEffect, useCallback } from 'react'
import { useEditMode } from '../../context/EditModeContext'

/**
 * Renders children normally; in edit mode becomes contenteditable.
 * @param {string}   tag       - HTML tag (default 'span')
 * @param {string}   fileKey   - which JSON file: 'menu','activities','settings',...
 * @param {Array}    path      - path to the value, e.g. ['contact','phone']
 * @param {string}   value     - the current string value
 * @param {string}   className
 * @param {boolean}  multiline - allow Enter key for newlines
 */
export default function EditableText({
  tag: Tag = 'span',
  fileKey,
  path,
  value,
  className = '',
  multiline = false,
  children,
  ...rest
}) {
  const { isEditMode, updateField } = useEditMode()
  const ref = useRef(null)
  const display = value !== undefined ? value : children

  // Sync DOM when value changes externally (e.g. after save reload)
  useEffect(() => {
    if (ref.current && ref.current.textContent !== String(display ?? '')) {
      ref.current.textContent = String(display ?? '')
    }
  }, [display])

  const onBlur = useCallback(() => {
    if (!ref.current || !fileKey || !path) return
    updateField(fileKey, path, ref.current.textContent.trim())
  }, [fileKey, path, updateField])

  const onKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault()
      ref.current?.blur()
    }
    if (e.key === 'Escape') {
      ref.current.textContent = String(display ?? '')
      ref.current?.blur()
    }
  }, [multiline, display])

  if (!isEditMode) {
    return <Tag className={className} {...rest}>{display}</Tag>
  }

  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      className={`${className} outline-none ring-1 ring-blue-400/0 hover:ring-blue-400/60 focus:ring-blue-500 focus:bg-blue-500/5 rounded-[2px] cursor-text transition-all`}
      data-editable="true"
      {...rest}
    >
      {display}
    </Tag>
  )
}
