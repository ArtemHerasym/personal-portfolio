import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { certificates, projects, skillGroups } from '../data'
import type { Certificate, Project, Transition } from '../types'
import { Modal } from './Modal'
import { Reveal } from './Reveal'

type Tab = 'Projects' | 'Certificates' | 'Skills'

export function Gallery({ transition }: { transition: Transition }) {
  const [tab, setTab] = useState<Tab>('Projects')
  const [selected, setSelected] = useState<Project | Certificate | null>(null)
  return (
    <section className="gallery" id="gallery" aria-labelledby="gallery-title">
      <div className="section-inner">
        <Reveal className="section-heading gallery-heading" transition={transition}>
          <div><p className="section-kicker">03 · Selected work</p><h2 id="gallery-title">Gallery</h2></div>
          <div className="gallery-tabs" role="tablist" aria-label="Gallery categories">
            {(['Projects', 'Certificates', 'Skills'] as Tab[]).map((name) => <button key={name} role="tab" aria-selected={tab === name} className={tab === name ? 'active' : ''} onClick={() => setTab(name)}>{name}</button>)}
          </div>
        </Reveal>
        <AnimatePresence mode="wait">
          <motion.div key={tab} className="gallery-content" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={transition}>
            {tab === 'Projects' && <div className="project-grid">{projects.map((project, index) => <button className={`project-card ${project.accent}`} key={project.title} onClick={() => setSelected(project)}><span className="project-number">0{index + 1}</span><span className="project-art"><i /><i /><i /></span><span className="project-meta"><small>{project.kind}</small><strong>{project.title}</strong></span><span className="card-arrow">↗</span></button>)}</div>}
            {tab === 'Certificates' && <div className="certificate-grid">{certificates.map((certificate) => <button key={certificate.title} className={`certificate-card ${certificate.accent}`} onClick={() => setSelected(certificate)}><span className="certificate-seal">AH</span><span><small>{certificate.issuer}</small><strong>{certificate.title}</strong><em>{certificate.year}</em></span><b>View ↗</b></button>)}</div>}
            {tab === 'Skills' && <div className="skills-list">{skillGroups.map((group) => <div className="skill-row" key={group.name}><h3>{group.name}</h3><div>{group.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div>)}</div>}
          </motion.div>
        </AnimatePresence>
      </div>
      <Modal selected={selected} onClose={() => setSelected(null)} transition={transition} />
    </section>
  )
}
