import api from './client'

export interface Skill {
  id: number
  name: string
  category: string
  proficiency: number
}

export interface SkillCreate {
  name: string
  category: string
  proficiency: number
}

export const skillsApi = {
  list: () => api.get<Skill[]>('/api/skills/').then((r) => r.data),

  create: (data: SkillCreate) =>
    api.post<Skill>('/api/skills/', data).then((r) => r.data),

  update: (id: number, data: SkillCreate) =>
    api.put<Skill>(`/api/skills/${id}`, data).then((r) => r.data),

  delete: (id: number) => api.delete(`/api/skills/${id}`),
}
