import api from './client'

export interface PortfolioData {
  user: {
    username: string
    full_name: string
    bio: string
    avatar_url: string
  }
  projects: {
    id: number
    title: string
    description: string
    technologies: string
    github_url: string
    live_url: string
    image_url: string
    featured: boolean
  }[]
  skills: {
    id: number
    name: string
    category: string
    proficiency: number
  }[]
  experiences: {
    id: number
    type: string
    title: string
    organization: string
    description: string
    start_date: string
    end_date: string | null
    current: boolean
  }[]
}

export const portfolioApi = {
  getByUsername: (username: string) =>
    api.get<PortfolioData>(`/api/portfolio/${username}`).then((r) => r.data),
}
