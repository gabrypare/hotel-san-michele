import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar       from './components/layout/Navbar'
import Footer       from './components/layout/Footer'
import { EditModeProvider, useEditMode } from './context/EditModeContext'
import EditorToolbar from './components/editor/EditorToolbar'
import HomePage     from './pages/HomePage'
import HotelPage    from './pages/HotelPage'
import RistorantePage from './pages/RistorantePage'
import MenuPage     from './pages/MenuPage'
import LocationPage from './pages/LocationPage'
import GalleryPage  from './pages/GalleryPage'
import PrenotaPage  from './pages/PrenotaPage'
import RoomPage     from './pages/RoomPage'
import ClinicaPage  from './pages/ClinicaPage'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])
  return null
}

const PAGE_TRANSITION = {
  initial:  { opacity: 0, y: 12 },
  animate:  { opacity: 1, y: 0 },
  exit:     { opacity: 0, y: -8 },
  transition: { duration: 0.4, ease: 'easeOut' },
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} {...PAGE_TRANSITION} className="overflow-x-hidden">
        <Routes location={location}>
          <Route path="/"          element={<HomePage />} />
          <Route path="/hotel"     element={<HotelPage />} />
          <Route path="/ristorante" element={<RistorantePage />} />
          <Route path="/menu"      element={<MenuPage />} />
          <Route path="/location"  element={<LocationPage />} />
          <Route path="/galleria"  element={<GalleryPage />} />
          <Route path="/prenota"   element={<PrenotaPage />} />
          <Route path="/hotel/:slug" element={<RoomPage />} />
          <Route path="/clinica"   element={<ClinicaPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

function AppInner() {
  const { isEditMode } = useEditMode()
  return (
    <>
      <EditorToolbar />
      <ScrollTop />
      <div className={isEditMode ? 'pt-14' : ''}>
        <Navbar />
        <AnimatedRoutes />
        <Footer />
      </div>
    </>
  )
}

export default function App() {
  return (
    <EditModeProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </EditModeProvider>
  )
}
