import type { Certificate, Project } from './types'

export const experiences = [
  {
    eyebrow: 'Internship',
    title: 'Nobel Internship',
    description: 'A hands-on learning experience centered on technology, collaboration, and solving practical challenges with a team.',
    tags: ['Collaboration', 'Technology'],
    accent: 'violet',
  },
  {
    eyebrow: 'Competition',
    title: 'Hackathon Builder',
    description: 'Turning an idea into a working prototype under a tight deadline, with an emphasis on clear roles and rapid iteration.',
    tags: ['Rapid prototyping', 'Teamwork'],
    accent: 'blue',
  },
  {
    eyebrow: 'Student activity',
    title: 'Basketball Analytics',
    description: 'Exploring how thoughtful data collection and clear visual communication can support better decisions on the court.',
    tags: ['Data', 'Communication'],
    accent: 'amber',
  },
  {
    eyebrow: 'Community',
    title: 'Volunteering',
    description: 'Contributing time and energy to community initiatives while learning to lead through reliability and service.',
    tags: ['Leadership', 'Community'],
    accent: 'green',
  },
]

export const projects: Project[] = [
  {
    title: 'CourtStats',
    kind: 'Basketball analytics',
    description: 'A web application that makes basketball performance data easier to explore, compare, and communicate.',
    contribution: 'Product thinking, interface design, and front-end development. Detailed project notes will be added in the next content pass.',
    technologies: ['React', 'TypeScript', 'Data visualization'],
    accent: 'court',
    linkLabel: 'View project',
  },
  {
    title: 'DormChef',
    kind: 'Hackathon project',
    description: 'A meal-planning concept designed to help students turn a few available ingredients into practical dorm-friendly meals.',
    contribution: 'Collaborative ideation and prototype development during a hackathon. Final repository and story are coming soon.',
    technologies: ['Web app', 'Rapid prototyping', 'UX'],
    accent: 'chef',
    linkLabel: 'View project',
  },
  {
    title: 'Motion Studies',
    kind: 'Selected experiments · Placeholder',
    description: 'A temporary home for motion design explorations, animated identities, and visual storytelling experiments.',
    contribution: 'This card is intentionally temporary and will be replaced with a finished case study.',
    technologies: ['After Effects', 'Motion design'],
    accent: 'motion',
    linkLabel: 'Coming soon',
  },
]

export const certificates: Certificate[] = [
  { title: 'Technical Learning', issuer: 'Certificate placeholder', year: 'Coming soon', accent: 'blue' },
  { title: 'Creative Practice', issuer: 'Certificate placeholder', year: 'Coming soon', accent: 'violet' },
  { title: 'Leadership & Service', issuer: 'Certificate placeholder', year: 'Coming soon', accent: 'amber' },
]

export const skillGroups = [
  { name: 'Programming', skills: ['Python', 'HTML', 'CSS', 'JavaScript', 'TypeScript'] },
  { name: 'Tools', skills: ['Git', 'Figma', 'Canva', 'After Effects'] },
  { name: 'Soft skills', skills: ['Teamwork', 'Communication', 'Leadership', 'Problem solving'] },
  { name: 'Languages', skills: ['Ukrainian', 'English', 'Spanish'] },
]
