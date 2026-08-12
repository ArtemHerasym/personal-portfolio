import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import { experiences } from '../data'
import type { Transition } from '../types'
import { Reveal } from './Reveal'

export function ExperienceCarousel({ transition }: { transition: Transition }) {
  const [active, setActive] = useState(0)
  const reduceMotion = useReducedMotion()
  const item = experiences[active]
  const slotWidth = 100 / experiences.length
  const move = useCallback(
    (delta: number) => setActive((index) => (index + delta + experiences.length) % experiences.length),
    [],
  )

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (document.activeElement?.closest('.experience-shell')) {
        if (event.key === 'ArrowRight') {
          event.preventDefault()
          move(1)
        }
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          move(-1)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [move])

  return (
    <section className="experience" id="experience" aria-labelledby="experience-title">
      <div className="section-inner">
        <Reveal className="section-heading split-heading" transition={transition}>
          <div><p className="section-kicker">Experience</p><h2 id="experience-title">Beyond the classroom.</h2></div>
          <p>Places where I’ve learned by doing, collaborating, and showing up with curiosity.</p>
        </Reveal>
        <Reveal transition={transition}>
          <div className="experience-shell" tabIndex={0} role="region" aria-roledescription="carousel" aria-label="Experience carousel. Use arrow keys to navigate.">
            <AnimatePresence mode="wait" initial={false}>
              <motion.article key={active} className="experience-card" initial={{ opacity: 0, x: 55 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -55 }} transition={transition}>
                <div className={`experience-visual ${item.accent}`}>
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
              <div
                className="carousel-progress"
                role="progressbar"
                aria-label="Experience position"
                aria-valuemin={1}
                aria-valuemax={experiences.length}
                aria-valuenow={active + 1}
                aria-valuetext={`${item.title}, experience ${active + 1} of ${experiences.length}`}
              >
                <motion.span
                  initial={false}
                  animate={{ left: `${active * slotWidth}%` }}
                  style={{ width: `${slotWidth}%` }}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <p className="sr-only" aria-live="polite">Experience {active + 1} of {experiences.length}: {item.title}</p>
              <div><button type="button" onClick={() => move(-1)} aria-label="Previous experience">←</button><button type="button" onClick={() => move(1)} aria-label="Next experience">→</button></div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
