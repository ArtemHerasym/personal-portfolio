import {
  siCss,
  siFigma,
  siGit,
  siHtml5,
  siJavascript,
  siPython,
  siTypescript,
} from 'simple-icons'
import type { SimpleIcon } from 'simple-icons'
import {
  Clapperboard,
  Flag,
  Languages,
  MessagesSquare,
  Palette,
  Puzzle,
  UsersRound,
  type LucideIcon,
} from 'lucide-react'
import type { SkillIconName } from '../types'

const brandIcons: Partial<Record<SkillIconName, SimpleIcon>> = {
  python: siPython,
  html: siHtml5,
  css: siCss,
  javascript: siJavascript,
  typescript: siTypescript,
  git: siGit,
  figma: siFigma,
}

const interfaceIcons: Partial<Record<SkillIconName, LucideIcon>> = {
  teamwork: UsersRound,
  communication: MessagesSquare,
  leadership: Flag,
  'problem-solving': Puzzle,
  canva: Palette,
  'after-effects': Clapperboard,
  ukrainian: Languages,
  english: Languages,
  spanish: Languages,
}

export function SkillIcon({ name }: { name: SkillIconName }) {
  const brandIcon = brandIcons[name]
  if (brandIcon) {
    return (
      <svg
        className="skill-icon skill-icon-brand"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path d={brandIcon.path} />
      </svg>
    )
  }

  const InterfaceIcon = interfaceIcons[name]
  if (InterfaceIcon) {
    return (
      <InterfaceIcon
        className="skill-icon skill-icon-lucide"
        aria-hidden="true"
        focusable="false"
        strokeWidth={1.8}
      />
    )
  }

  return null
}
