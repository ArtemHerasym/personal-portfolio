import heroArt from '../assets/hero.png'
import type { Transition } from '../types'
import { Reveal } from './Reveal'

export function About({ transition }: { transition: Transition }) {
  return (
    <section className="about section-rise" id="about" aria-labelledby="about-title">
      <div className="section-inner about-grid">
        <Reveal className="about-copy" transition={transition}>
          <p className="section-kicker">About</p>
          <h2 id="about-title">Building at the intersection of <em>logic and motion.</em></h2>
          <p className="lede">I’m Artem, a computer science student who enjoys turning complex ideas into thoughtful digital experiences.</p>
          <p>My work moves between software, design, and storytelling. I’m most energized by curious teams, useful problems, and the moment when an early concept becomes something people can actually use.</p>
          <dl className="mini-stats">
            <div><dt>Focus</dt><dd>Computer Science</dd></div>
            <div><dt>Based in</dt><dd>United States</dd></div>
            <div><dt>Also exploring</dt><dd>Motion Design</dd></div>
          </dl>
        </Reveal>
        <Reveal className="portrait-wrap" transition={transition}>
          <div className="portrait-placeholder">
            <img src={heroArt} alt="" />
            <span>Design × Development</span>
          </div>
          <aside className="personal-note"><span>Currently</span><p>Learning, building, and looking for the next meaningful challenge.</p></aside>
        </Reveal>
      </div>
    </section>
  )
}
