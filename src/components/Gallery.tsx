import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react'
import { useCallback, useRef, useState, type KeyboardEvent } from 'react'
import { certificates, projects, skillGroups } from '../data'
import { motionDuration, motionEase } from '../motion'
import type { Certificate, Project, Transition } from '../types'
import { Modal } from './Modal'
import { Reveal } from './Reveal'
import { SkillIcon } from './SkillIcon'

const galleryTabs = ['Projects', 'Certificates', 'Skills'] as const
type Tab = (typeof galleryTabs)[number]

export function Gallery({ transition }: { transition: Transition }) {
  const [tab, setTab] = useState<Tab>('Projects')
  const [selected, setSelected] = useState<Project | Certificate | null>(null)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const reduceMotion = useReducedMotion()
  const closeModal = useCallback(() => setSelected(null), [])
  const itemTransition = (index: number) => reduceMotion
    ? { duration: 0 }
    : { duration: 0.4, delay: index * 0.055, ease: motionEase }

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
                        transition={reduceMotion ? { duration: 0 } : { duration: motionDuration.interface, ease: motionEase }}
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
              exit={{ opacity: 0, y: -8 }}
              transition={reduceMotion ? { duration: 0 } : { duration: motionDuration.interface, ease: motionEase }}
            >
              {tab === 'Projects' && (
                <div className="project-grid">
                  {projects.map((project, index) => (
                    <motion.button
                      type="button"
                      aria-haspopup="dialog"
                      className={`project-card ${project.accent}`}
                      key={project.title}
                      onClick={() => setSelected(project)}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.16 }}
                      transition={itemTransition(index)}
                    >
                      <span className="project-placeholder-label" aria-hidden="true">Project image coming soon</span>
                      <span className="project-meta"><small>{project.kind}</small><strong>{project.title}</strong></span>
                      <span className="card-arrow" aria-hidden="true">↗</span>
                    </motion.button>
                  ))}
                </div>
              )}
              {tab === 'Certificates' && (
                <div className="certificate-grid">
                  {certificates.map((certificate, index) => (
                    <motion.button
                      type="button"
                      aria-haspopup="dialog"
                      key={certificate.title}
                      className={`certificate-card ${certificate.accent}`}
                      onClick={() => setSelected(certificate)}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.16 }}
                      transition={itemTransition(index)}
                    >
                      <span className="certificate-preview" aria-hidden="true" />
                      <span><small>{certificate.issuer}</small><strong>{certificate.title}</strong><em>{certificate.year}</em></span>
                      <b>View <span aria-hidden="true">↗</span></b>
                    </motion.button>
                  ))}
                </div>
              )}
              {tab === 'Skills' && (
                <div className="skills-list">
                  {skillGroups.map((group, index) => (
                    <motion.div
                      className="skill-row"
                      key={group.name}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={itemTransition(index)}
                    >
                      <h3>{group.name}</h3>
                      <div>
                        {group.skills.map((skill) => (
                          <span className="skill-item" key={skill.name}>
                            <SkillIcon name={skill.icon} />
                            <span className="skill-label">{skill.name}</span>
                          </span>
                        ))}
                      </div>
                    </motion.div>
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
