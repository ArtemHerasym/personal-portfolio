import { motion } from 'motion/react'
import type { Transition } from '../types'

export function Hero({ transition }: { transition: Transition }) {
  const withDelay = (delay: number) => ({ ...transition, delay: transition.duration === 0 ? 0 : delay })

  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <motion.div className="hero-copy hero-display" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={transition}>
        <motion.p className="eyebrow" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={withDelay(0.04)}>Hello World!</motion.p>
        <h1 id="hero-title" aria-label="Artem Herasymenko">
          <motion.span className="hero-name hero-name-solid" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={withDelay(0.1)}>Artem</motion.span>
          <motion.span className="hero-name hero-name-secondary" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={withDelay(0.16)}>Herasymenko</motion.span>
        </h1>
        <motion.p className="role-line" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={withDelay(0.22)}>Program Developer <i /> Motion Designer</motion.p>
        <motion.a className="primary-button" href="#gallery" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={withDelay(0.28)}>Explore my work <span aria-hidden="true">↘</span></motion.a>
      </motion.div>
      <div className="scroll-cue" aria-hidden="true"><span>Scroll to discover</span><b>↓</b></div>
    </section>
  )
}
