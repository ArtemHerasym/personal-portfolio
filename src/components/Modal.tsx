import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import type { Certificate, Project, Transition } from '../types'

function isProject(item: Project | Certificate): item is Project {
  return 'technologies' in item
}

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function Modal({
  selected,
  onClose,
  transition,
}: {
  selected: Project | Certificate | null
  onClose: () => void
  transition: Transition
}) {
  const [slide, setSlide] = useState(0)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const onCloseRef = useRef(onClose)
  const isOpen = selected !== null

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!selected) return
    setSlide(0)
  }, [selected])

  useEffect(() => {
    if (!isOpen) return

    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    document.documentElement.classList.add('modal-open')
    document.body.classList.add('modal-open')
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus())

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab') return

      const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [])
      if (!focusable.length) {
        event.preventDefault()
        dialogRef.current?.focus()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && (document.activeElement === first || !dialogRef.current?.contains(document.activeElement))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.documentElement.classList.remove('modal-open')
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', onKey)
      returnFocusRef.current?.focus()
      returnFocusRef.current = null
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {selected && (
        <motion.div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(event) => { if (event.currentTarget === event.target) onClose() }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
        >
          <motion.div
            ref={dialogRef}
            className={`modal ${isProject(selected) ? 'project-modal' : 'certificate-modal'}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby={isProject(selected) ? 'modal-description' : 'certificate-description'}
            tabIndex={-1}
            initial={{ opacity: 0, y: 35, scale: .97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: .98 }}
            transition={transition}
          >
            <button ref={closeButtonRef} type="button" className="modal-close" onClick={onClose} aria-label="Close dialog">×</button>
            {isProject(selected) ? (
              <>
                <div className={`modal-media ${selected.accent}`}>
                  <span aria-live="polite">Project preview {slide + 1}</span>
                  <div className="modal-art" aria-hidden="true"><i /><i /></div>
                  <div className="media-controls">
                    <button type="button" onClick={() => setSlide((slide + 2) % 3)} aria-label="Previous image">←</button>
                    <p>{slide + 1} / 3</p>
                    <button type="button" onClick={() => setSlide((slide + 1) % 3)} aria-label="Next image">→</button>
                  </div>
                </div>
                <div className="modal-details">
                  <p className="section-kicker">{selected.kind}</p>
                  <h2 id="modal-title">{selected.title}</h2>
                  <p id="modal-description" className="modal-lede">{selected.description}</p>
                  <h3>My contribution</h3>
                  <p>{selected.contribution}</p>
                  <h3>Toolkit</h3>
                  <div className="tag-row">{selected.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div>
                  <button className="primary-button disabled" type="button" disabled={selected.linkLabel === 'Coming soon'}>
                    {selected.linkLabel} <span aria-hidden="true">↗</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="certificate-view">
                <div className={`certificate-paper ${selected.accent}`}>
                  <span className="certificate-seal large" aria-hidden="true">AH</span>
                  <p>Certificate of completion</p>
                  <h2 id="modal-title">{selected.title}</h2>
                  <span>{selected.issuer}</span>
                  <b>{selected.year}</b>
                </div>
                <p id="certificate-description">This is a layout placeholder. A high-resolution certificate image will replace it later.</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
