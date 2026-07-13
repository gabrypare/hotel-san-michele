import menuJson from '../content/menu.json'

export const ALLERGENS = {
  glutine:      { id: 1,  label: 'Glutine',               color: '#C0692A', bg: '#FFF0E5' },
  crostacei:    { id: 2,  label: 'Crostacei',             color: '#D94F2B', bg: '#FFF0EC' },
  uova:         { id: 3,  label: 'Uova',                  color: '#C8960F', bg: '#FDF9E3' },
  pesce:        { id: 4,  label: 'Pesce',                 color: '#2278B0', bg: '#E6F1FB' },
  arachidi:     { id: 5,  label: 'Arachidi',              color: '#7A4E28', bg: '#F6EDE2' },
  soia:         { id: 6,  label: 'Soia',                  color: '#4A7A35', bg: '#EBF5E6' },
  latte:        { id: 7,  label: 'Latte / Lattosio',      color: '#3A8FAA', bg: '#E4F4FA' },
  fruttaGuscio: { id: 8,  label: 'Frutta a guscio',       color: '#7A5820', bg: '#F6EFE0' },
  sedano:       { id: 9,  label: 'Sedano',                color: '#3A7A3A', bg: '#E6F5E6' },
  senape:       { id: 10, label: 'Senape',                color: '#B89A10', bg: '#FBF8E0' },
  sesamo:       { id: 11, label: 'Semi di sesamo',        color: '#9B7840', bg: '#F6F0E3' },
  solfiti:      { id: 12, label: 'Solfiti / SO₂',         color: '#7055A0', bg: '#F2EEF9' },
  lupini:       { id: 13, label: 'Lupini',                color: '#C04A30', bg: '#FCEEE9' },
  molluschi:    { id: 14, label: 'Molluschi',             color: '#208A78', bg: '#E2F5F2' },
}

export const CATEGORY_KEYS = menuJson.categories.map(c => c.key)

export const MENU = Object.fromEntries(
  menuJson.categories.map(cat => [cat.key, cat])
)
