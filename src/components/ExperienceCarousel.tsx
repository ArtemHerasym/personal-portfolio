import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { experiences } from '../data'
import type { Transition } from '../types'
import { Reveal } from './Reveal'

export function ExperienceCarousel({ transition }: { transition: Transition }) {
  const [active, setActive] = useState(0)
  const item = experiences[active]
  const move = (delta: number) => setActive((index) => (index + delta + experiences.length) % experiences.length)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (document.activeElement?.closest('.experience-shell')) {
        if (event.key === 'ArrowRight') move(1)
        if (event.key === 'ArrowLeft') move(-1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <section className="experience" id="experience" aria-labelledby="experience-title">
      <div className="section-inner">
        <Reveal className="section-heading split-heading" transition={transition}>
          <div><p className="section-kicker">02 · Experience & activities</p><h2 id="experience-title">Beyond the classroom.</h2></div>
          <p>Places where I’ve learned by doing, collaborating, and showing up with curiosity.</p>
        </Reveal>
        <Reveal transition={transition}>
          <div className="experience-shell" tabIndex={0} aria-label="Experience carousel. Use arrow keys to navigate.">
            <AnimatePresence mode="wait" initial={false}>
              <motion.article key={active} className="experience-card" initial={{ opacity: 0, x: 55 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -55 }} transition={transition}>
                <div className={`experience-visual ${item.accent}`}>
                  <span className="visual-index">0{active + 1}</span>
                  <div className="visual-rings"><i /><i /><i /></div>
                  <p>Image placeholder</p>
                </div>
                <div className="experience-copy">
                  <p className="eyebrow">{item.eyebrow}</p>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="tag-row">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                </div>
              </motion.article>
            </AnimatePresence>
            <div className="carousel-controls">
              <div className="carousel-progress"><span style={{ width: `${((active + 1) / experiences.length) * 100}%` }} /></div>
              <p><b>0{active + 1}</b> / 0{experiences.length}</p>
              <div><button onClick={() => move(-1)} aria-label="Previous experience">←</button><button onClick={() => move(1)} aria-label="Next experience">→</button></div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
