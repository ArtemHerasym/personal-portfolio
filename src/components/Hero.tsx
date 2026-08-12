import { motion } from 'motion/react'
import type { Transition } from '../types'

export function Hero({ transition }: { transition: Transition }) {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <motion.div className="hero-copy hero-display" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={transition}>
        <p className="eyebrow">Hello World!</p>
        <h1 id="hero-title" aria-label="Artem Herasymenko">
          <span className="hero-name hero-name-solid">Artem</span>
          <span className="hero-name hero-name-outline">Herasymenko</span>
        </h1>
        <p className="role-line">Program Developer <i /> Motion Designer</p>
        <a className="primary-button" href="#gallery">Explore my work <span aria-hidden="true">↘</span></a>
      </motion.div>
      <div className="scroll-cue" aria-hidden="true"><span>Scroll to discover</span><b>↓</b></div>
    </section>
  )
}
