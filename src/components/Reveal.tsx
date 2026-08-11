import { motion } from 'motion/react'
import type { PropsWithChildren } from 'react'
import type { Transition } from '../types'

export function Reveal({ children, className = '', transition }: PropsWithChildren<{ className?: string; transition: Transition }>) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={transition}
    >
      {children}
    </motion.div>
  )
}
