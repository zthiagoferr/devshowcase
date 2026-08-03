import api from './client'

export interface Project {
  id: number
  title: string
  description: string
  technologies: string
  github_url: string
  live_url: string
  image_url: string
  featured: boolean
}

export interface ProjectCreate {
  title: string
  description: string
  technologies?: string
  github_url?: string
  live_url?: string
  image_url?: string
  featured?: boolean
}

export const projectsApi = {
  list: () => api.get<Project[]>('/api/projects/').then((r) => r.data),

  create: (data: ProjectCreate) =>
    api.post<Project>('/api/projects/', data).then((r) => r.data),

  update: (id: number, data: ProjectCreate) =>
    api.put<Project>(`/api/projects/${id}`, data).then((r) => r.data),

  delete: (id: number) => api.delete(`/api/projects/${id}`),
}
