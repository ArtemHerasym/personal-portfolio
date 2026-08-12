import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react'
import { useCallback, useRef, useState, type KeyboardEvent } from 'react'
import { certificates, projects, skillGroups } from '../data'
import type { Certificate, Project, Transition } from '../types'
import { Modal } from './Modal'
import { Reveal } from './Reveal'

const galleryTabs = ['Projects', 'Certificates', 'Skills'] as const
type Tab = (typeof galleryTabs)[number]

export function Gallery({ transition }: { transition: Transition }) {
  const [tab, setTab] = useState<Tab>('Projects')
  const [selected, setSelected] = useState<Project | Certificate | null>(null)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const reduceMotion = useReducedMotion()
  const closeModal = useCallback(() => setSelected(null), [])

  const activateTab = (index: number) => {
    const nextIndex = (index + galleryTabs.length) % galleryTabs.length
    setTab(galleryTabs[nextIndex])
    tabRefs.current[nextIndex]?.focus()
  }

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      activateTab(index + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      activateTab(index - 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      activateTab(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      activateTab(galleryTabs.length - 1)
    }
  }

  return (
    <section className="gallery" id="gallery" aria-labelledby="gallery-title">
      <div className="section-inner">
        <Reveal className="section-heading gallery-heading" transition={transition}>
          <h2 id="gallery-title">Gallery</h2>
          <LayoutGroup id="gallery-tabs">
            <div className="gallery-tabs" role="tablist" aria-label="Gallery categories" aria-orientation="horizontal">
              {galleryTabs.map((name, index) => {
                const active = tab === name
                const id = name.toLowerCase()
                return (
                  <button
                    key={name}
                    ref={(node) => { tabRefs.current[index] = node }}
                    id={`gallery-tab-${id}`}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-controls="gallery-panel"
                    tabIndex={active ? 0 : -1}
                    className={active ? 'active' : ''}
                    onClick={() => setTab(name)}
                    onKeyDown={(event) => handleTabKeyDown(event, index)}
                  >
                    {active && (
                      <motion.span
                        className="gallery-tab-pill"
                        layoutId="gallery-active-pill"
                        initial={false}
                        aria-hidden="true"
                        transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 520, damping: 42, mass: 0.62 }}
                      />
                    )}
                    <span className="gallery-tab-label">{name}</span>
                  </button>
                )
              })}
            </div>
          </LayoutGroup>
        </Reveal>

        <div
          id="gallery-panel"
          role="tabpanel"
          aria-labelledby={`gallery-tab-${tab.toLowerCase()}`}
          tabIndex={0}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              className="gallery-content"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={transition}
            >
              {tab === 'Projects' && (
                <div className="project-grid">
                  {projects.map((project) => (
                    <button
                      type="button"
                      aria-haspopup="dialog"
                      className={`project-card ${project.accent}`}
                      key={project.title}
                      onClick={() => setSelected(project)}
                    >
                      <span className="project-art" aria-hidden="true"><i /><i /></span>
                      <span className="project-meta"><small>{project.kind}</small><strong>{project.title}</strong></span>
                      <span className="card-arrow" aria-hidden="true">↗</span>
                    </button>
                  ))}
                </div>
              )}
              {tab === 'Certificates' && (
                <div className="certificate-grid">
                  {certificates.map((certificate) => (
                    <button
                      type="button"
                      aria-haspopup="dialog"
                      key={certificate.title}
                      className={`certificate-card ${certificate.accent}`}
                      onClick={() => setSelected(certificate)}
                    >
                      <span className="certificate-seal" aria-hidden="true">AH</span>
                      <span><small>{certificate.issuer}</small><strong>{certificate.title}</strong><em>{certificate.year}</em></span>
                      <b>View <span aria-hidden="true">↗</span></b>
                    </button>
                  ))}
                </div>
              )}
              {tab === 'Skills' && (
                <div className="skills-list">
                  {skillGroups.map((group) => (
                    <div className="skill-row" key={group.name}>
                      <h3>{group.name}</h3>
                      <div>{group.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <Modal selected={selected} onClose={closeModal} transition={transition} />
    </section>
  )
}
