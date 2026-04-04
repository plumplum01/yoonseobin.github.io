import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProjectGrid from './components/ProjectGrid'
import About from './components/About'
import Contact from './components/Contact'
import CaseStudy from './pages/CaseStudy'

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
    <BrowserRouter basename="/yoonseobin.github.io">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:id" element={<CaseStudy />} />
      </Routes>
    </BrowserRouter>
  )
}
