import { motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { ExperienceCarousel } from './components/ExperienceCarousel'
import { Gallery } from './components/Gallery'
import { Hero } from './components/Hero'
import { Navbar } from './components/Navbar'
import { motionDuration, motionEase } from './motion'
import type { Theme } from './types'

const sections = ['home', 'about', 'experience', 'gallery', 'contact'] as const

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'

  try {
    return window.localStorage.getItem('portfolio-theme') === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [activeSection, setActiveSection] = useState('home')
  const reduceMotion = useReducedMotion()
  const pendingSection = useRef<string | null>(null)
  const pendingTimer = useRef<number | null>(null)

  const findCurrentSection = useCallback(() => {
    const atPageEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
    if (atPageEnd) return 'contact'
    const probe = window.innerHeight * 0.42
    return sections.find((id) => {
      const bounds = document.getElementById(id)?.getBoundingClientRect()
      return bounds && bounds.top <= probe && bounds.bottom > probe
    })
  }, [])

  const handleNavigate = useCallback((section: string) => {
    pendingSection.current = section
    setActiveSection(section)
    if (pendingTimer.current) window.clearTimeout(pendingTimer.current)
    pendingTimer.current = window.setTimeout(() => {
      pendingSection.current = null
      pendingTimer.current = null
      const current = findCurrentSection()
      if (current) setActiveSection(current)
    }, 1400)
  }, [findCurrentSection])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      window.localStorage.setItem('portfolio-theme', theme)
    } catch {
      // Storage may be unavailable in restricted or privacy-focused browser contexts.
    }
    document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute(
      'content',
      theme === 'dark' ? '#04050b' : '#f8f5e6',
    )
  }, [theme])

  useEffect(() => {
    let frame = 0
    const updateActiveSection = () => {
      frame = 0
      const atPageEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      const probe = window.innerHeight * 0.42
      const pending = pendingSection.current
      if (pending) {
        const target = document.getElementById(pending)?.getBoundingClientRect()
        const reachedTarget = pending === 'contact'
          ? atPageEnd
          : Boolean(target && target.top <= probe && target.bottom > probe)
        if (!reachedTarget) return
        pendingSection.current = null
        if (pendingTimer.current) window.clearTimeout(pendingTimer.current)
        pendingTimer.current = null
      }

      if (atPageEnd) {
        setActiveSection('contact')
        return
      }

      const current = findCurrentSection()
      if (current) setActiveSection(current)
    }
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveSection)
    }

    updateActiveSection()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      if (pendingTimer.current) window.clearTimeout(pendingTimer.current)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [findCurrentSection])

  const transition = useMemo(
    () => (reduceMotion ? { duration: 0 } : { duration: motionDuration.reveal, ease: motionEase }),
    [reduceMotion],
  )

  return (
    <motion.div
      className="site-shell"
      initial={{ opacity: 0.82 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.28 }}
    >
      <a className="skip-link" href="#about">Skip to content</a>
      <Navbar
        activeSection={activeSection}
        theme={theme}
        onNavigate={handleNavigate}
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
  )
}

export default App
