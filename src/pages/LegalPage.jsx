import { Link } from 'react-router-dom'
import { RiArrowLeftLine } from 'react-icons/ri'
import EditableText from '../components/editor/EditableText'
import { useEditMode } from '../context/EditModeContext'

/* ── Pagina testi legali: doc = 'privacy' | 'cookie' (contenuti in legal.json) ── */
export default function LegalPage({ doc }) {
  const { pick } = useEditMode()
  const d = pick('legal')[doc]

  return (
    <div className="bg-cream">

      {/* ── HEADER ── */}
      <div className="bg-forest-dark pt-36 pb-14">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <Link to="/" className="inline-flex items-center gap-2 text-cream/50 hover:text-gold font-sans text-xs tracking-widest uppercase mb-5 transition-colors duration-300">
            <RiArrowLeftLine size={13} /> Home
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-6 h-px bg-gold opacity-70" />
            <EditableText tag="span" fileKey="legal" path={[doc, 'label']} value={d.label} className="section-label" />
          </div>
          <h1 className="font-script text-4xl sm:text-5xl text-cream leading-tight">
            <EditableText tag="span" fileKey="legal" path={[doc, 'title']} value={d.title} className="inline" />{' '}
            <EditableText tag="span" fileKey="legal" path={[doc, 'titleItalic']} value={d.titleItalic} className="italic text-gold-light inline" />
          </h1>
          <EditableText tag="p" fileKey="legal" path={[doc, 'updated']} value={d.updated} className="font-sans text-xs text-cream/40 mt-4 block" />
        </div>
      </div>

      {/* ── TESTO ── */}
      <section className="py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <EditableText tag="p" fileKey="legal" path={[doc, 'intro']} value={d.intro} multiline
            className="font-display italic text-lg text-charcoal/70 leading-relaxed mb-12 block" />

          <div className="space-y-10">
            {d.sections.map((s, si) => (
              <div key={si}>
                <EditableText tag="h2" fileKey="legal" path={[doc, 'sections', si, 'title']} value={s.title}
                  className="font-serif text-xl text-forest-dark mb-3 block" />
                <div className="space-y-3">
                  {s.paragraphs.map((p, pi) => (
                    <EditableText key={pi} tag="p" fileKey="legal" path={[doc, 'sections', si, 'paragraphs', pi]} value={p} multiline
                      className="font-sans text-sm text-charcoal/70 leading-relaxed block" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
