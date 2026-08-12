import type { Transition } from '../types'
import { Reveal } from './Reveal'

export function Contact({ transition }: { transition: Transition }) {
  return (
    <footer className="contact" id="contact" aria-labelledby="contact-title">
      <Reveal className="contact-content" transition={transition}>
        <p className="section-kicker">Let’s build something thoughtful</p>
        <h2 id="contact-title">Find me online.</h2>
        <p>I’m always open to good conversations, new ideas, and opportunities to learn.</p>
        <div className="social-links">
          <a href="https://github.com/" target="_blank" rel="noreferrer">GitHub <span>↗</span></a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn <span>↗</span></a>
        </div>
      </Reveal>
      <div className="footer-line"><span>© {new Date().getFullYear()} Artem Herasymenko</span><a href="#home">Back to top ↑</a></div>
    </footer>
  )
}
