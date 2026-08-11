import type { Theme } from '../types'

const links = ['Home', 'About', 'Experience', 'Gallery', 'Contact']

export function Navbar({ activeSection, theme, onThemeChange }: { activeSection: string; theme: Theme; onThemeChange: () => void }) {
  return (
    <header className="nav-wrap">
      <nav className="glass-nav" aria-label="Main navigation">
        <a className="nav-mark" href="#home" aria-label="Artem Herasymenko, home">AH</a>
        <div className="nav-links">
          {links.map((label) => {
            const id = label.toLowerCase()
            return <a key={id} className={activeSection === id ? 'active' : ''} href={`#${id}`}>{label}</a>
          })}
        </div>
        <button className="theme-toggle" onClick={onThemeChange} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
          <span aria-hidden="true">{theme === 'dark' ? '☼' : '◐'}</span>
        </button>
      </nav>
    </header>
  )
}
