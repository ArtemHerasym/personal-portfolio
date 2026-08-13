export type Theme = 'dark' | 'light'
export type Transition = { duration: number; ease?: readonly [number, number, number, number] }

export type ProjectMedia = {
  id: string
  label: string
  src?: string
  alt?: string
}

export type Project = {
  title: string
  kind: string
  description: string
  contribution: string
  technologies: string[]
  media: ProjectMedia[]
  accent: string
  linkLabel: string
}

export type Certificate = {
  title: string
  issuer: string
  year: string
  accent: string
}

export type SkillIconName =
  | 'python'
  | 'html'
  | 'css'
  | 'javascript'
  | 'typescript'
  | 'git'
  | 'figma'
  | 'canva'
  | 'after-effects'
  | 'teamwork'
  | 'communication'
  | 'leadership'
  | 'problem-solving'
  | 'ukrainian'
  | 'english'
  | 'spanish'

export type Skill = {
  name: string
  icon: SkillIconName
}

export type SkillGroup = {
  name: string
  skills: Skill[]
}
