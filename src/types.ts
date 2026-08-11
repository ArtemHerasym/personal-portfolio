export type Theme = 'dark' | 'light'
export type Transition = { duration: number; ease?: readonly [number, number, number, number] }

export type Project = {
  title: string
  kind: string
  description: string
  contribution: string
  technologies: string[]
  accent: string
  linkLabel: string
}

export type Certificate = {
  title: string
  issuer: string
  year: string
  accent: string
}
