import api from './client'

export interface Experience {
  id: number
  type: string
  title: string
  organization: string
  description: string
  start_date: string
  end_date: string | null
  current: boolean
}

export interface ExperienceCreate {
  type: string
  title: string
  organization: string
  description?: string
  start_date: string
  end_date?: string | null
  current?: boolean
}

export const experiencesApi = {
  list: () => api.get<Experience[]>('/api/experiences/').then((r) => r.data),

  create: (data: ExperienceCreate) =>
    api.post<Experience>('/api/experiences/', data).then((r) => r.data),

  update: (id: number, data: ExperienceCreate) =>
    api.put<Experience>(`/api/experiences/${id}`, data).then((r) => r.data),

  delete: (id: number) => api.delete(`/api/experiences/${id}`),
}
