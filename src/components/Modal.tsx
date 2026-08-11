import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import type { Certificate, Project, Transition } from '../types'

function isProject(item: Project | Certificate): item is Project { return 'technologies' in item }

export function Modal({ selected, onClose, transition }: { selected: Project | Certificate | null; onClose: () => void; transition: Transition }) {
  const [slide, setSlide] = useState(0)
  useEffect(() => {
    if (!selected) return
    setSlide(0)
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    document.body.classList.add('modal-open')
    window.addEventListener('keydown', onKey)
    return () => { document.body.classList.remove('modal-open'); window.removeEventListener('keydown', onKey) }
  }, [selected, onClose])
  return (
    <AnimatePresence>
      {selected && <motion.div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose() }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transition}>
        <motion.div className={`modal ${isProject(selected) ? 'project-modal' : 'certificate-modal'}`} role="dialog" aria-modal="true" aria-labelledby="modal-title" initial={{ opacity: 0, y: 35, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: .98 }} transition={transition}>
          <button className="modal-close" onClick={onClose} aria-label="Close dialog">×</button>
          {isProject(selected) ? <>
            <div className={`modal-media ${selected.accent}`}>
              <span>Project preview {slide + 1}</span><div className="modal-art"><i /><i /><i /></div>
              <div className="media-controls"><button onClick={() => setSlide((slide + 2) % 3)} aria-label="Previous image">←</button><p>{slide + 1} / 3</p><button onClick={() => setSlide((slide + 1) % 3)} aria-label="Next image">→</button></div>
            </div>
            <div className="modal-details"><p className="section-kicker">{selected.kind}</p><h2 id="modal-title">{selected.title}</h2><p className="modal-lede">{selected.description}</p><h3>My contribution</h3><p>{selected.contribution}</p><h3>Toolkit</h3><div className="tag-row">{selected.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div><button className="primary-button disabled" disabled={selected.linkLabel === 'Coming soon'}>{selected.linkLabel} <span>↗</span></button></div>
          </> : <div className="certificate-view"><div className={`certificate-paper ${selected.accent}`}><span className="certificate-seal large">AH</span><p>Certificate of completion</p><h2 id="modal-title">{selected.title}</h2><span>{selected.issuer}</span><b>{selected.year}</b></div><p>This is a layout placeholder. A high-resolution certificate image will replace it later.</p></div>}
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  )
}
