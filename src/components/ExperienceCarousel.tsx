import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import { experiences } from '../data'
import { motionDuration, motionEase } from '../motion'
import type { Transition } from '../types'
import { Reveal } from './Reveal'

const swipeThreshold = 52

export function ExperienceCarousel({ transition }: { transition: Transition }) {
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)
  const reduceMotion = useReducedMotion()
  const item = experiences[active]
  const slotWidth = 100 / experiences.length
  const move = useCallback((delta: number) => {
    setDirection(delta < 0 ? -1 : 1)
    setActive((index) => (index + delta + experiences.length) % experiences.length)
  }, [])

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

  const itemTransition = reduceMotion
    ? { duration: 0 }
    : { duration: motionDuration.carousel, ease: motionEase }

  return (
    <section className="experience" id="experience" aria-labelledby="experience-title">
      <div className="section-inner">
        <Reveal className="section-heading split-heading" transition={transition}>
          <div><p className="section-kicker">Experience</p><h2 id="experience-title">Beyond the classroom.</h2></div>
          <p>Places where I’ve learned by doing, collaborating, and showing up with curiosity.</p>
        </Reveal>
        <Reveal transition={transition}>
          <div className="experience-shell" tabIndex={0} role="region" aria-roledescription="carousel" aria-label="Experience carousel. Swipe or use arrow keys to navigate.">
            <div className="experience-stage">
              <AnimatePresence initial={false} custom={direction}>
                <motion.article
                  key={active}
                  custom={direction}
                  className="experience-card"
                  variants={{
                    enter: (travelDirection: number) => ({
                      opacity: reduceMotion ? 1 : 0,
                      x: reduceMotion ? 0 : travelDirection * 14,
                    }),
                    center: { opacity: 1, x: 0 },
                    exit: (travelDirection: number) => ({
                      opacity: reduceMotion ? 1 : 0,
                      x: reduceMotion ? 0 : travelDirection * -10,
                    }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={itemTransition}
                  onPanEnd={(_, info) => {
                    const horizontalTravel = Math.abs(info.offset.x)
                    const verticalTravel = Math.abs(info.offset.y)
                    if (horizontalTravel < swipeThreshold || horizontalTravel <= verticalTravel * 1.2) return
                    move(info.offset.x < 0 ? 1 : -1)
                  }}
                  style={{ touchAction: 'pan-y' }}
                >
                  <div className={`experience-visual ${item.accent}`}>
                    <span className="experience-placeholder-label">Photo coming soon</span>
                  </div>
                  <motion.div
                    className="experience-copy"
                    initial={reduceMotion ? false : { opacity: 0, x: direction * 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={reduceMotion ? { duration: 0 } : { duration: motionDuration.modal, delay: 0.055, ease: motionEase }}
                  >
                    <p className="eyebrow">{item.eyebrow}</p>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <div className="tag-row">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  </motion.div>
                </motion.article>
              </AnimatePresence>
            </div>
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
                  transition={reduceMotion ? { duration: 0 } : { duration: motionDuration.interface, ease: motionEase }}
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
