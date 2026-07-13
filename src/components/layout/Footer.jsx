import { Link } from 'react-router-dom'
import { RiInstagramLine, RiFacebookCircleLine, RiMapPin2Line, RiPhoneLine, RiMailLine } from 'react-icons/ri'
import SanMicheleLogo from '../ui/SanMicheleLogo'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-forest-deeper text-cream/65 font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="mb-5">
            <SanMicheleLogo light size="lg" />
          </div>
          <p className="text-sm leading-relaxed text-cream/50 mb-6 max-w-xs">
            Nel cuore dei colli di Ome, dove i vigneti della Franciacorta incontrano l'ospitalità autentica e la cucina del territorio.
          </p>
          <div className="flex gap-3">
            {[RiInstagramLine, RiFacebookCircleLine].map((Icon, i) => (
              <a key={i} href="#" target="_blank" rel="noreferrer"
                className="w-9 h-9 border border-cream/20 flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-300">
                <Icon size={16} />
              </a>
            ))}
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
              <span className="text-cream/50 leading-relaxed">Via S. Michele, 5a<br />25050 Ome (BS) — Franciacorta</span>
            </li>
            <li className="flex gap-3 items-center">
              <RiPhoneLine size={15} className="text-gold shrink-0" />
              <a href="tel:+390306527167" className="text-cream/50 hover:text-gold transition-colors duration-300">
                +39 030 652 7167
              </a>
            </li>
            <li className="flex gap-3 items-center">
              <RiMailLine size={15} className="text-gold shrink-0" />
              <a href="mailto:info@sanmicheleome.it" className="text-cream/50 hover:text-gold transition-colors duration-300">
                info@sanmicheleome.it
              </a>
            </li>
          </ul>
          <div className="mt-5 text-sm text-cream/50">
            <p className="text-cream/70 font-medium mb-1">Ristorante</p>
            <p>Pranzo: 12:00 – 14:30</p>
            <p>Cena: 19:30 – 22:00</p>
            <p className="text-cream/30 text-xs mt-1">Chiuso il martedì</p>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/8">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[0.68rem] text-cream/30">
          <p>© {year} Hotel Ristorante San Michele · P.IVA 00000000000</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-gold transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-gold transition-colors duration-300">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
