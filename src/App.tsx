import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/hero'
import About from './components/About'
import Contact from './components/Contact'
import AboutPage from './pages/AboutPage'

function Home() {
  return (
    <>
      <Hero />
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
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  )
}
