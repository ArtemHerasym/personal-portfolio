import { motion } from 'motion/react'
import type { Transition } from '../types'

export function Hero({ transition }: { transition: Transition }) {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="hero-orbit" aria-hidden="true" />
      <motion.div className="hero-copy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={transition}>
        <p className="eyebrow">Hello, I’m</p>
        <h1 id="hero-title">Artem<br /><span>Herasymenko</span></h1>
        <p className="role-line">Program Developer <i /> Motion Designer</p>
        <a className="primary-button" href="#gallery">Explore my work <span aria-hidden="true">↘</span></a>
      </motion.div>
      <div className="scroll-cue" aria-hidden="true"><span>Scroll to discover</span><b>↓</b></div>
    </section>
  )
}
