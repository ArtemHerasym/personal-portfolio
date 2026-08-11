import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { ExperienceCarousel } from './components/ExperienceCarousel'
import { Gallery } from './components/Gallery'
import { Hero } from './components/Hero'
import { Navbar } from './components/Navbar'
import type { Theme } from './types'

const sections = ['home', 'about', 'experience', 'gallery', 'contact'] as const

function App() {
  const [theme, setTheme] = useState<Theme>(() =>
    localStorage.getItem('portfolio-theme') === 'light' ? 'light' : 'dark',
  )
  const [activeSection, setActiveSection] = useState('home')
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveSection(visible.target.id)
      },
      { rootMargin: '-30% 0px -58%', threshold: [0.05, 0.3, 0.6] },
    )
    sections.forEach((id) => {
      const node = document.getElementById(id)
      if (node) observer.observe(node)
    })
    return () => observer.disconnect()
  }, [])

  const transition = useMemo(
    () => (reduceMotion ? { duration: 0 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }),
    [reduceMotion],
  )

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={theme}
        className="site-shell"
        initial={{ opacity: 0.82 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.28 }}
      >
        <a className="skip-link" href="#about">Skip to content</a>
        <Navbar
          activeSection={activeSection}
          theme={theme}
          onThemeChange={() => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))}
        />
        <main>
          <Hero transition={transition} />
          <About transition={transition} />
          <ExperienceCarousel transition={transition} />
          <Gallery transition={transition} />
        </main>
        <Contact transition={transition} />
      </motion.div>
    </AnimatePresence>
  )
}

export default App
