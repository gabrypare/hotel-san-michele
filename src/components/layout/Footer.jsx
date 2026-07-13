import { Link } from 'react-router-dom'
import { RiInstagramLine, RiFacebookCircleLine, RiMapPin2Line, RiPhoneLine, RiMailLine } from 'react-icons/ri'
import SanMicheleLogo from '../ui/SanMicheleLogo'
import settings from '../../content/settings.json'
import { useEditMode } from '../../context/EditModeContext'
import EditableText from '../editor/EditableText'

const { hotel, contact, hours, social, legal } = settings

export default function Footer() {
  const year = new Date().getFullYear()
  const { isEditMode, content } = useEditMode()

  const s = isEditMode ? content.settings : settings

  return (
    <footer className="bg-forest-deeper text-cream/65 font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="mb-5">
            <SanMicheleLogo light size="lg" />
          </div>
          <EditableText tag="p" fileKey="settings" path={['hotel', 'tagline']} value={s.hotel.tagline}
            multiline className="text-sm leading-relaxed text-cream/50 mb-6 max-w-xs block" />
          <div className="flex gap-3">
            <a href={s.social.instagram} target="_blank" rel="noreferrer"
              className="w-9 h-9 border border-cream/20 flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-300">
              <RiInstagramLine size={16} />
            </a>
            <a href={s.social.facebook} target="_blank" rel="noreferrer"
              className="w-9 h-9 border border-cream/20 flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-300">
              <RiFacebookCircleLine size={16} />
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <p className="section-label text-gold mb-5">Esplora</p>
          <ul className="space-y-3 text-sm">
            {[
              { label: "L'Hotel",       href: '/hotel' },
              { label: 'Il Ristorante', href: '/ristorante' },
              { label: 'Il Menù',       href: '/menu' },
              { label: 'Location',      href: '/location' },
              { label: 'Galleria',      href: '/galleria' },
              { label: 'Prenota',       href: '/prenota' },
            ].map(l => (
              <li key={l.label}>
                <Link to={l.href} className="text-cream/50 hover:text-gold transition-colors duration-300">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Menu */}
        <div>
          <p className="section-label text-gold mb-5">Il Menù</p>
          <ul className="space-y-3 text-sm">
            {['Antipasti', 'Primi Piatti', 'Secondi Piatti', 'Dolci', 'Carta dei Vini'].map(m => (
              <li key={m}>
                <Link to="/menu" className="text-cream/50 hover:text-gold transition-colors duration-300">{m}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="section-label text-gold mb-5">Contatti</p>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3 items-start">
              <RiMapPin2Line size={15} className="text-gold mt-0.5 shrink-0" />
              <span className="text-cream/50 leading-relaxed">
                <EditableText tag="span" fileKey="settings" path={['contact', 'address']} value={s.contact.address}
                  className="block" />
                <EditableText tag="span" fileKey="settings" path={['contact', 'city']} value={s.contact.city}
                  className="block" />
              </span>
            </li>
            <li className="flex gap-3 items-center">
              <RiPhoneLine size={15} className="text-gold shrink-0" />
              <EditableText tag="span" fileKey="settings" path={['contact', 'phone']} value={s.contact.phone}
                className="text-cream/50 hover:text-gold transition-colors duration-300" />
            </li>
            <li className="flex gap-3 items-center">
              <RiMailLine size={15} className="text-gold shrink-0" />
              <EditableText tag="span" fileKey="settings" path={['contact', 'email']} value={s.contact.email}
                className="text-cream/50 hover:text-gold transition-colors duration-300" />
            </li>
          </ul>
          <div className="mt-5 text-sm text-cream/50">
            <p className="text-cream/70 font-medium mb-1">Ristorante</p>
            <p>
              <EditableText tag="span" fileKey="settings" path={['hours', 'lunch_label']} value={s.hours.lunch_label} className="inline" />
              {': '}
              <EditableText tag="span" fileKey="settings" path={['hours', 'lunch']} value={s.hours.lunch} className="inline" />
            </p>
            <p>
              <EditableText tag="span" fileKey="settings" path={['hours', 'dinner_label']} value={s.hours.dinner_label} className="inline" />
              {': '}
              <EditableText tag="span" fileKey="settings" path={['hours', 'dinner']} value={s.hours.dinner} className="inline" />
            </p>
            <EditableText tag="p" fileKey="settings" path={['hours', 'closed']} value={s.hours.closed}
              className="text-cream/30 text-xs mt-1 block" />
          </div>
        </div>
      </div>

      <div className="border-t border-cream/8">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[0.68rem] text-cream/30">
          <p>© {year} {s.hotel.name} · P.IVA {s.hotel.piva}</p>
          <div className="flex gap-5">
            <a href={legal.privacy_href} className="hover:text-gold transition-colors duration-300">Privacy Policy</a>
            <a href={legal.cookie_href} className="hover:text-gold transition-colors duration-300">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
