import api from './client'

export interface LoginParams {
  username: string
  password: string
}

export interface RegisterParams {
  username: string
  email: string
  password: string
  full_name: string
}

export const authApi = {
  login: (params: LoginParams) =>
    api.post('/api/auth/login', null, { params }).then((r) => r.data),

  register: (data: RegisterParams) =>
    api.post('/api/auth/register', data).then((r) => r.data),
}
