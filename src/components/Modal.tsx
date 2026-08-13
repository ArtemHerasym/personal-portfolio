import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
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

type PageState = {
  root: HTMLElement | null
  rootHadInert: boolean
  rootAriaHidden: string | null
  htmlHadModalOpen: boolean
  bodyHadModalOpen: boolean
}

const modalEase = [0.22, 1, 0.36, 1] as const

export function Modal({
  selected,
  onClose,
  transition,
}: {
  selected: Project | Certificate | null
  onClose: () => void
  transition: Transition
}) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const pageStateRef = useRef<PageState | null>(null)
  const onCloseRef = useRef(onClose)
  const isOpen = selected !== null
  const isOpenRef = useRef(isOpen)
  isOpenRef.current = isOpen

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  const lockPage = useCallback(() => {
    if (pageStateRef.current) return

    const root = document.getElementById('root')
    pageStateRef.current = {
      root,
      rootHadInert: root?.hasAttribute('inert') ?? false,
      rootAriaHidden: root?.getAttribute('aria-hidden') ?? null,
      htmlHadModalOpen: document.documentElement.classList.contains('modal-open'),
      bodyHadModalOpen: document.body.classList.contains('modal-open'),
    }

    root?.setAttribute('inert', '')
    root?.setAttribute('aria-hidden', 'true')
    document.documentElement.classList.add('modal-open')
    document.body.classList.add('modal-open')
  }, [])

  const releasePage = useCallback(() => {
    const pageState = pageStateRef.current
    if (!pageState) return

    if (pageState.root) {
      if (pageState.rootHadInert) pageState.root.setAttribute('inert', '')
      else pageState.root.removeAttribute('inert')

      if (pageState.rootAriaHidden === null) pageState.root.removeAttribute('aria-hidden')
      else pageState.root.setAttribute('aria-hidden', pageState.rootAriaHidden)
    }

    if (!pageState.htmlHadModalOpen) document.documentElement.classList.remove('modal-open')
    if (!pageState.bodyHadModalOpen) document.body.classList.remove('modal-open')
    pageStateRef.current = null

    const returnTarget = returnFocusRef.current
    returnFocusRef.current = null
    if (returnTarget?.isConnected) returnTarget.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    if (!isOpen) return

    if (!pageStateRef.current) {
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    }

    closeButtonRef.current?.focus({ preventScroll: true })
    lockPage()

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
        dialogRef.current?.focus({ preventScroll: true })
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
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, lockPage])

  useEffect(() => () => releasePage(), [releasePage])

  const reducedMotion = transition.duration === 0
  const backdropTransition = reducedMotion ? { duration: 0 } : { duration: 0.18, ease: modalEase }
  const dialogTransition = reducedMotion ? { duration: 0 } : { duration: 0.26, ease: modalEase }

  return createPortal(
    <AnimatePresence
      onExitComplete={() => {
        if (!isOpenRef.current) releasePage()
      }}
    >
      {selected && (
        <motion.div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(event) => { if (event.currentTarget === event.target) onClose() }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={backdropTransition}
        >
          <motion.div
            ref={dialogRef}
            className={`modal ${isProject(selected) ? 'project-modal' : 'certificate-modal'}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby={isProject(selected) ? 'modal-description' : 'certificate-description'}
            tabIndex={-1}
            initial={reducedMotion ? false : { opacity: 0, y: 16, scale: 0.992 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.995 }}
            transition={dialogTransition}
          >
            <button ref={closeButtonRef} type="button" className="modal-close" onClick={onClose} aria-label="Close dialog">×</button>
            {isProject(selected) ? (
              <>
                <div className={`modal-media ${selected.accent}`} role="img" aria-label={`Media placeholder for ${selected.title}`}>
                  <span>Project media coming soon</span>
                </div>
                <div className="modal-details">
                  <p className="section-kicker">{selected.kind}</p>
                  <h2 id="modal-title">{selected.title}</h2>
                  <p id="modal-description" className="modal-lede">{selected.description}</p>
                  <h3>My contribution</h3>
                  <p>{selected.contribution}</p>
                  <h3>Toolkit</h3>
                  <div className="tag-row">{selected.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div>
                  <button className="primary-button disabled" type="button" disabled>
                    {selected.linkLabel === 'Coming soon' ? 'Coming soon' : 'Project link coming soon'} <span aria-hidden="true">↗</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="certificate-view">
                <div className={`certificate-paper certificate-placeholder ${selected.accent}`}>
                  <p className="certificate-placeholder-label">Certificate image coming soon</p>
                </div>
                <div className="certificate-placeholder-meta">
                  <h2 id="modal-title">{selected.title}</h2>
                  <p id="certificate-description">{selected.issuer} <span aria-hidden="true">·</span> {selected.year}</p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
