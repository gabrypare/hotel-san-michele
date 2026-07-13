import { useSortable } from '@dnd-kit/sortable'
import { CSS }         from '@dnd-kit/utilities'
import { useEditMode } from '../../context/EditModeContext'
import { RiDraggable, RiDeleteBin6Line, RiFileCopyLine } from 'react-icons/ri'

/**
 * Wraps any card to make it sortable + editable with duplicate/delete controls.
 */
export default function SortableCard({ id, onDuplicate, onDelete, children, className = '' }) {
  const { isEditMode } = useEditMode()
  const {
    attributes, listeners,
    setNodeRef, transform, transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity:  isDragging ? 0.4 : 1,
    zIndex:   isDragging ? 50  : 'auto',
  }

  if (!isEditMode) return <div className={className}>{children}</div>

  return (
    <div ref={setNodeRef} style={style} className={`group/sc relative ${className}`}>

      {/* Control bar — appears on hover */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-0 opacity-0 group-hover/sc:opacity-100 transition-opacity duration-200 shadow-lg">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          title="Tieni premuto e trascina per spostare"
          className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-500 text-white text-[0.6rem] tracking-widest uppercase cursor-grab active:cursor-grabbing select-none"
        >
          <RiDraggable size={13} />
          <span className="hidden sm:inline">Sposta</span>
        </button>
        {/* Duplicate */}
        <button
          onClick={onDuplicate}
          title="Duplica riquadro"
          className="flex items-center gap-1 px-2.5 py-1.5 bg-forest text-cream text-[0.6rem] tracking-widest uppercase hover:bg-forest-dark transition-colors select-none"
        >
          <RiFileCopyLine size={13} />
          <span className="hidden sm:inline">Duplica</span>
        </button>
        {/* Delete */}
        <button
          onClick={onDelete}
          title="Elimina riquadro"
          className="flex items-center gap-1 px-2.5 py-1.5 bg-red-500 text-white text-[0.6rem] tracking-widest uppercase hover:bg-red-600 transition-colors select-none"
        >
          <RiDeleteBin6Line size={13} />
          <span className="hidden sm:inline">Elimina</span>
        </button>
      </div>

      {/* Ring highlight on hover */}
      <div className="ring-2 ring-transparent group-hover/sc:ring-blue-400/50 rounded-[2px] transition-all duration-200">
        {children}
      </div>
    </div>
  )
}
