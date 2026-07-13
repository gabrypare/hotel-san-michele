import { RiAddLine } from 'react-icons/ri'
import { useEditMode } from '../../context/EditModeContext'

export default function AddCardButton({ onClick, label = 'Aggiungi', className = '' }) {
  const { isEditMode } = useEditMode()
  if (!isEditMode) return null

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 w-full border-2 border-dashed border-blue-400/40 text-blue-400 hover:border-blue-400 hover:bg-blue-400/5 transition-all duration-200 py-4 font-sans text-xs tracking-[0.2em] uppercase cursor-pointer ${className}`}
    >
      <RiAddLine size={16} />
      {label}
    </button>
  )
}
