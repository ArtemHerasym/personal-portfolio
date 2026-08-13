import { AnimatePresence, motion, type PanInfo } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motionDuration, motionEase } from '../motion'
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

const swipeThreshold = 48

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
  const [activeMediaIndex, setActiveMediaIndex] = useState(0)
  const [mediaDirection, setMediaDirection] = useState(0)
  const isOpen = selected !== null
  const isOpenRef = useRef(isOpen)
  const project = selected && isProject(selected) ? selected : null
  const mediaCount = project?.media.length ?? 0
  const visibleMediaIndex = mediaCount ? Math.min(activeMediaIndex, mediaCount - 1) : 0
  const activeMedia = project?.media[visibleMediaIndex]
  isOpenRef.current = isOpen

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    setActiveMediaIndex(0)
    setMediaDirection(0)
  }, [project])

  const moveMedia = useCallback((offset: number) => {
    if (mediaCount < 2) return

    setMediaDirection(offset > 0 ? 1 : -1)
    setActiveMediaIndex((current) => (current + offset + mediaCount) % mediaCount)
  }, [mediaCount])

  const selectMedia = useCallback((index: number) => {
    if (index === visibleMediaIndex) return

    setMediaDirection(index > visibleMediaIndex ? 1 : -1)
    setActiveMediaIndex(index)
  }, [visibleMediaIndex])

  const handleMediaPanEnd = useCallback((_: PointerEvent, info: PanInfo) => {
    const horizontalTravel = Math.abs(info.offset.x)
    const verticalTravel = Math.abs(info.offset.y)
    if (horizontalTravel < swipeThreshold || horizontalTravel <= verticalTravel * 1.2) return

    moveMedia(info.offset.x < 0 ? 1 : -1)
  }, [moveMedia])

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

      if (project && mediaCount > 1) {
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          moveMedia(-1)
          return
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault()
          moveMedia(1)
          return
        }
        if (event.key === 'Home') {
          event.preventDefault()
          selectMedia(0)
          return
        }
        if (event.key === 'End') {
          event.preventDefault()
          selectMedia(mediaCount - 1)
          return
        }
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
  }, [isOpen, lockPage, mediaCount, moveMedia, project, selectMedia])

  useEffect(() => () => releasePage(), [releasePage])

  const reducedMotion = transition.duration === 0
  const backdropTransition = reducedMotion ? { duration: 0 } : { duration: motionDuration.fast, ease: motionEase }
  const dialogTransition = reducedMotion ? { duration: 0 } : { duration: motionDuration.modal, ease: motionEase }
  const mediaTransition = reducedMotion ? { duration: 0 } : { duration: motionDuration.interface, ease: motionEase }

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
            <button ref={closeButtonRef} type="button" className="modal-close" onClick={onClose} aria-label="Close dialog">&times;</button>
            {isProject(selected) ? (
              <>
                <div
                  className={`modal-media ${selected.accent}`}
                  role="region"
                  aria-roledescription="carousel"
                  aria-label={`${selected.title} project images`}
                >
                  {activeMedia && (
                    <motion.div
                      className="project-media-viewport"
                      onPanEnd={handleMediaPanEnd}
                      style={{ touchAction: 'pan-y' }}
                    >
                      <motion.div
                        key={activeMedia.id}
                        id="project-media-slide"
                        className="project-media-slide"
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${activeMedia.label}, ${visibleMediaIndex + 1} of ${mediaCount}`}
                        initial={reducedMotion ? false : { opacity: 0, x: mediaDirection * 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={mediaTransition}
                      >
                        {activeMedia.src ? (
                          <img
                            src={activeMedia.src}
                            alt={activeMedia.alt ?? `${selected.title} ${activeMedia.label}`}
                            draggable={false}
                          />
                        ) : (
                          <div className="project-media-placeholder">
                            <span className="project-media-label">{activeMedia.label}</span>
                            <p>Image coming soon</p>
                          </div>
                        )}
                      </motion.div>
                    </motion.div>
                  )}

                  {mediaCount > 1 && (
                    <div className="project-media-controls">
                      <button
                        type="button"
                        className="project-media-arrow"
                        onClick={() => moveMedia(-1)}
                        aria-label="Previous project image"
                        aria-controls="project-media-slide"
                      >
                        <span aria-hidden="true">&larr;</span>
                      </button>
                      <div className="project-media-dots" role="group" aria-label="Choose project image">
                        {selected.media.map((media, index) => (
                          <button
                            key={media.id}
                            type="button"
                            className={`project-media-dot${index === visibleMediaIndex ? ' active' : ''}`}
                            onClick={() => selectMedia(index)}
                            aria-label={`Show project image ${index + 1} of ${mediaCount}`}
                            aria-current={index === visibleMediaIndex ? 'true' : undefined}
                            aria-controls="project-media-slide"
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        className="project-media-arrow"
                        onClick={() => moveMedia(1)}
                        aria-label="Next project image"
                        aria-controls="project-media-slide"
                      >
                        <span aria-hidden="true">&rarr;</span>
                      </button>
                    </div>
                  )}
                  <p className="sr-only" aria-live="polite" aria-atomic="true">
                    Project image {visibleMediaIndex + 1} of {mediaCount}
                  </p>
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
                  <p id="certificate-description">{selected.issuer} <span aria-hidden="true">&middot;</span> {selected.year}</p>
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
