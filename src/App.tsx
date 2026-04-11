import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/hero'
import ProjectGrid from './components/ProjectGrid'
import About from './components/About'
import Contact from './components/Contact'
import CaseStudy from './pages/CaseStudy'
import AboutPage from './pages/AboutPage'

function Home() {
  return (
    <>
      <Hero />
      <ProjectGrid />
      <About />
      <Contact />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter basename="/">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:id" element={<CaseStudy />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  )
}
