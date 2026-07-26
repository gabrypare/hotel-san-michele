import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import menuJson        from '../content/menu.json'
import roomsJson       from '../content/rooms.json'
import activitiesJson  from '../content/activities.json'
import galleryJson     from '../content/gallery.json'
import settingsJson    from '../content/settings.json'
import navJson         from '../content/nav.json'
import restaurantJson  from '../content/restaurant.json'
import homeJson        from '../content/home.json'
import hotelJson       from '../content/hotel.json'
import locationJson    from '../content/location.json'
import prenotaJson    from '../content/prenota.json'
import clinicaJson    from '../content/clinica.json'

const Ctx = createContext(null)
export const useEditMode = () => useContext(Ctx)

const INITIAL = {
  menu:       menuJson,
  rooms:      roomsJson,
  activities: activitiesJson,
  gallery:    galleryJson,
  settings:   settingsJson,
  nav:        navJson,
  restaurant: restaurantJson,
  home:       homeJson,
  hotel:      hotelJson,
  location:   locationJson,
  prenota:    prenotaJson,
  clinica:    clinicaJson,
}

function deepClone(obj) { return JSON.parse(JSON.stringify(obj)) }

function getIn(obj, path) {
  return path.reduce((o, k) => o?.[k], obj)
}

function setIn(obj, path, value) {
  const next = deepClone(obj)
  let cur = next
  for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]]
  cur[path[path.length - 1]] = value
  return next
}

export function EditModeProvider({ children }) {
  const [isEditMode, setIsEditMode]   = useState(false)
  const [content, setContent]         = useState(deepClone(INITIAL))
  const [isDirty, setIsDirty]         = useState(false)
  const [saveStatus, setSaveStatus]   = useState('idle')
  const passwordRef                   = useRef('')
  const contentRef                    = useRef(content)

  /* Mantieni contentRef sempre aggiornato — così save() legge sempre il valore più recente */
  contentRef.current = content

  /* Carica contenuti aggiornati da GitHub (via funzione Netlify, senza cache CDN) */
  useEffect(() => {
    fetch(`/api/get-content?t=${Date.now()}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setContent(prev => ({ ...prev, ...data }))
        }
      })
      .catch(() => {})
  }, [])

  /* ── Activation ── */
  const activate = useCallback(async (pw) => {
    const res = await fetch('/api/editor-auth', {
      method: 'POST',
      body: JSON.stringify({ password: pw }),
      headers: { 'Content-Type': 'application/json' },
    })
    if (res.ok) {
      passwordRef.current = pw
      setIsEditMode(true)
      setIsDirty(false)
      return true
    }
    return false
  }, [])

  const deactivate = useCallback(() => {
    setIsEditMode(false)
    setIsDirty(false)
    setSaveStatus('idle')
    passwordRef.current = ''
  }, [])

  /* ── Field update ── */
  const updateField = useCallback((fileKey, path, value) => {
    setContent(prev => setIn(prev, [fileKey, ...path], value))
    setIsDirty(true)
  }, [])

  /* ── Array operations ── */
  const addItem = useCallback((fileKey, arrayPath, newItem) => {
    setContent(prev => {
      const next  = deepClone(prev)
      const arr   = getIn(next, [fileKey, ...arrayPath])
      arr.push(newItem)
      return next
    })
    setIsDirty(true)
  }, [])

  const removeItem = useCallback((fileKey, arrayPath, index) => {
    setContent(prev => {
      const next = deepClone(prev)
      getIn(next, [fileKey, ...arrayPath]).splice(index, 1)
      return next
    })
    setIsDirty(true)
  }, [])

  const duplicateItem = useCallback((fileKey, arrayPath, index) => {
    setContent(prev => {
      const next = deepClone(prev)
      const arr  = getIn(next, [fileKey, ...arrayPath])
      arr.splice(index + 1, 0, deepClone(arr[index]))
      return next
    })
    setIsDirty(true)
  }, [])

  const reorderItems = useCallback((fileKey, arrayPath, oldIndex, newIndex) => {
    setContent(prev => {
      const next = deepClone(prev)
      const arr  = getIn(next, [fileKey, ...arrayPath])
      const [item] = arr.splice(oldIndex, 1)
      arr.splice(newIndex, 0, item)
      return next
    })
    setIsDirty(true)
  }, [])

  /* ── Save ── */
  const save = useCallback(async () => {
    setSaveStatus('saving')
    try {
      const res = await fetch('/api/save-content', {
        method: 'POST',
        body: JSON.stringify({ password: passwordRef.current, content: contentRef.current }),
        headers: { 'Content-Type': 'application/json' },
      })
      if (res.ok) {
        setSaveStatus('saved')
        setIsDirty(false)
        setTimeout(() => setSaveStatus('idle'), 6000)
      } else {
        const { error } = await res.json()
        console.error('Save error:', error)
        setSaveStatus('error')
        setTimeout(() => setSaveStatus('idle'), 4000)
      }
    } catch (err) {
      console.error(err)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 4000)
    }
  }, [])

  return (
    <Ctx.Provider value={{
      isEditMode, content, isDirty, saveStatus,
      activate, deactivate,
      updateField, addItem, removeItem, duplicateItem, reorderItems,
      save, passwordRef,
    }}>
      {children}
    </Ctx.Provider>
  )
}

