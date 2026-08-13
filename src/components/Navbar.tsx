import { motion, useReducedMotion } from 'motion/react'
import { motionDuration, motionEase } from '../motion'
import type { Theme } from '../types'

const links = ['Home', 'About', 'Experience', 'Gallery', 'Contact']

export function Navbar({
  activeSection,
  theme,
  onNavigate,
  onThemeChange,
}: {
  activeSection: string
  theme: Theme
  onNavigate: (section: string) => void
  onThemeChange: (origin: { x: number; y: number }) => void
}) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.header className="nav-wrap" layoutRoot>
      <nav className="glass-nav" aria-label="Main navigation">
        <a
          className="nav-mark"
          href="#home"
          aria-label="Artem Herasymenko, home"
          onClick={(event) => {
            if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) onNavigate('home')
          }}
        >AH</a>
        <div className="nav-links">
          {links.map((label) => {
            const id = label.toLowerCase()
            const isActive = activeSection === id
            return (
              <a
                key={id}
                className={isActive ? 'active' : ''}
                href={`#${id}`}
                aria-current={isActive ? 'location' : undefined}
                onClick={(event) => {
                  if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) onNavigate(id)
                }}
              >
                {isActive && (
                  <motion.span
                    className="nav-active-pill"
                    layoutId="nav-active-pill"
                    initial={false}
                    aria-hidden="true"
                    transition={reduceMotion ? { duration: 0 } : { duration: motionDuration.interface, ease: motionEase }}
                  />
                )}
                <span className="nav-label">{label}</span>
              </a>
            )
          })}
        </div>
        <button
          type="button"
          className="theme-toggle"
          onClick={(event) => {
            const bounds = event.currentTarget.getBoundingClientRect()
            onThemeChange({
              x: bounds.left + bounds.width / 2,
              y: bounds.top + bounds.height / 2,
            })
          }}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          <span aria-hidden="true">{theme === 'dark' ? '☼' : '◐'}</span>
        </button>
      </nav>
    </motion.header>
  )
}
