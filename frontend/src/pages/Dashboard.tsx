import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { projectsApi, type Project, type ProjectCreate } from '../api/projects'
import { skillsApi, type Skill, type SkillCreate } from '../api/skills'
import { experiencesApi, type Experience, type ExperienceCreate } from '../api/experiences'

type Tab = 'projects' | 'skills' | 'experiences'

const emptyProject: ProjectCreate = {
  title: '',
  description: '',
  technologies: '',
  github_url: '',
  live_url: '',
  image_url: '',
  featured: false,
}

const emptySkill: SkillCreate = { name: '', category: '', proficiency: 50 }

const emptyExperience: ExperienceCreate = {
  type: 'work',
  title: '',
  organization: '',
  description: '',
  start_date: '',
  end_date: null,
  current: false,
}

export default function Dashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState<Tab>('projects')

  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])

  const [editingProject, setEditingProject] = useState<ProjectCreate>(emptyProject)
  const [editingSkill, setEditingSkill] = useState<SkillCreate>(emptySkill)
  const [editingExperience, setEditingExperience] = useState<ExperienceCreate>(emptyExperience)

  const [projectId, setProjectId] = useState<number | null>(null)
  const [skillId, setSkillId] = useState<number | null>(null)
  const [experienceId, setExperienceId] = useState<number | null>(null)

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const fetchAll = async () => {
    try {
      const [p, s, e] = await Promise.all([
        projectsApi.list(),
        skillsApi.list(),
        experiencesApi.list(),
      ])
      setProjects(p)
      setSkills(s)
      setExperiences(e)
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const showMsg = (msg: string) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  const resetProjectForm = () => {
    setEditingProject(emptyProject)
    setProjectId(null)
  }

  const resetSkillForm = () => {
    setEditingSkill(emptySkill)
    setSkillId(null)
  }

  const resetExperienceForm = () => {
    setEditingExperience(emptyExperience)
    setExperienceId(null)
  }

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (projectId) {
        await projectsApi.update(projectId, editingProject)
        showMsg('Projeto atualizado!')
      } else {
        await projectsApi.create(editingProject)
        showMsg('Projeto criado!')
      }
      resetProjectForm()
      await fetchAll()
    } catch {
      showMsg('Erro ao salvar projeto')
    } finally {
      setLoading(false)
    }
  }

  const handleSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (skillId) {
        await skillsApi.update(skillId, editingSkill)
        showMsg('Skill atualizada!')
      } else {
        await skillsApi.create(editingSkill)
        showMsg('Skill criada!')
      }
      resetSkillForm()
      await fetchAll()
    } catch {
      showMsg('Erro ao salvar skill')
    } finally {
      setLoading(false)
    }
  }

  const handleExperienceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (experienceId) {
        await experiencesApi.update(experienceId, editingExperience)
        showMsg('Experiência atualizada!')
      } else {
        await experiencesApi.create(editingExperience)
        showMsg('Experiência criada!')
      }
      resetExperienceForm()
      await fetchAll()
    } catch {
      showMsg('Erro ao salvar experiência')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Remover este projeto?')) return
    await projectsApi.delete(id)
    showMsg('Projeto removido!')
    fetchAll()
  }

  const handleDeleteSkill = async (id: number) => {
    if (!confirm('Remover esta skill?')) return
    await skillsApi.delete(id)
    showMsg('Skill removida!')
    fetchAll()
  }

  const handleDeleteExperience = async (id: number) => {
    if (!confirm('Remover esta experiência?')) return
    await experiencesApi.delete(id)
    showMsg('Experiência removida!')
    fetchAll()
  }

  const portfolioUrl = user
    ? `https://devshowcase-ynqy.onrender.com/api/portfolio/${user.username}`
    : ''

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {user && (
          <a
            href={portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-purple-400 hover:underline"
          >
            Ver portfólio público →
          </a>
        )}
      </div>

      {message && (
        <div className="bg-green-900/50 border border-green-700 text-green-300 px-4 py-2 rounded mb-4 text-sm">
          {message}
        </div>
      )}

      <div className="flex gap-1 mb-6 border-b border-gray-700">
        {(['projects', 'skills', 'experiences'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
              tab === t
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {t === 'projects' ? 'Projetos' : t === 'skills' ? 'Skills' : 'Experiências'}
          </button>
        ))}
      </div>

      {tab === 'projects' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <form onSubmit={handleProjectSubmit} className="lg:col-span-1 space-y-3 bg-gray-800/30 border border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold">
              {projectId ? 'Editar Projeto' : 'Novo Projeto'}
            </h3>
            <input
              placeholder="Título *"
              value={editingProject.title}
              onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-purple-500"
              required
            />
            <textarea
              placeholder="Descrição *"
              value={editingProject.description}
              onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-purple-500"
              rows={3}
              required
            />
            <input
              placeholder="Tecnologias (Python, FastAPI, React)"
              value={editingProject.technologies}
              onChange={(e) => setEditingProject({ ...editingProject, technologies: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-purple-500"
            />
            <input
              placeholder="URL GitHub"
              value={editingProject.github_url}
              onChange={(e) => setEditingProject({ ...editingProject, github_url: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-purple-500"
            />
            <input
              placeholder="URL Demo"
              value={editingProject.live_url}
              onChange={(e) => setEditingProject({ ...editingProject, live_url: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-purple-500"
            />
            <label className="flex items-center gap-2 text-sm text-gray-400">
              <input
                type="checkbox"
                checked={editingProject.featured}
                onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                className="accent-purple-500"
              />
              Destaque
            </label>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 py-1.5 rounded text-sm transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Salvando...' : projectId ? 'Atualizar' : 'Criar'}
              </button>
              {projectId && (
                <button
                  type="button"
                  onClick={resetProjectForm}
                  className="px-3 py-1.5 border border-gray-600 rounded text-sm hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <div className="lg:col-span-2 space-y-3">
            {projects.length === 0 && (
              <p className="text-gray-500 text-sm">Nenhum projeto cadastrado.</p>
            )}
            {projects.map((p) => (
              <div key={p.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{p.title}</h4>
                  <p className="text-gray-400 text-sm line-clamp-2">{p.description}</p>
                </div>
                <div className="flex gap-2 text-xs ml-4 shrink-0">
                  <button
                    onClick={() => {
                      setProjectId(p.id)
                      setEditingProject({
                        title: p.title,
                        description: p.description,
                        technologies: p.technologies,
                        github_url: p.github_url,
                        live_url: p.live_url,
                        image_url: p.image_url,
                        featured: p.featured,
                      })
                    }}
                    className="text-purple-400 hover:underline cursor-pointer"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteProject(p.id)}
                    className="text-red-400 hover:underline cursor-pointer"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'skills' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <form onSubmit={handleSkillSubmit} className="lg:col-span-1 space-y-3 bg-gray-800/30 border border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold">{skillId ? 'Editar Skill' : 'Nova Skill'}</h3>
            <input
              placeholder="Nome *"
              value={editingSkill.name}
              onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-purple-500"
              required
            />
            <input
              placeholder="Categoria (Backend, Frontend, Banco de Dados...)"
              value={editingSkill.category}
              onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-purple-500"
            />
            <div>
              <label className="text-sm text-gray-400">Proficiência: {editingSkill.proficiency}%</label>
              <input
                type="range"
                min={0}
                max={100}
                value={editingSkill.proficiency}
                onChange={(e) => setEditingSkill({ ...editingSkill, proficiency: Number(e.target.value) })}
                className="w-full accent-purple-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 py-1.5 rounded text-sm transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Salvando...' : skillId ? 'Atualizar' : 'Criar'}
              </button>
              {skillId && (
                <button
                  type="button"
                  onClick={resetSkillForm}
                  className="px-3 py-1.5 border border-gray-600 rounded text-sm hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <div className="lg:col-span-2 space-y-2">
            {skills.length === 0 && (
              <p className="text-gray-500 text-sm">Nenhuma skill cadastrada.</p>
            )}
            {skills.map((s) => (
              <div key={s.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <span className="font-medium text-sm min-w-[80px]">{s.name}</span>
                  <span className="text-xs text-gray-500">{s.category}</span>
                  <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${s.proficiency}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{s.proficiency}%</span>
                </div>
                <div className="flex gap-2 text-xs ml-4">
                  <button
                    onClick={() => {
                      setSkillId(s.id)
                      setEditingSkill({
                        name: s.name,
                        category: s.category,
                        proficiency: s.proficiency,
                      })
                    }}
                    className="text-purple-400 hover:underline cursor-pointer"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteSkill(s.id)}
                    className="text-red-400 hover:underline cursor-pointer"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'experiences' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <form onSubmit={handleExperienceSubmit} className="lg:col-span-1 space-y-3 bg-gray-800/30 border border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold">
              {experienceId ? 'Editar Experiência' : 'Nova Experiência'}
            </h3>
            <select
              value={editingExperience.type}
              onChange={(e) => setEditingExperience({ ...editingExperience, type: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-purple-500"
            >
              <option value="work">Trabalho</option>
              <option value="education">Formação</option>
            </select>
            <input
              placeholder="Título *"
              value={editingExperience.title}
              onChange={(e) => setEditingExperience({ ...editingExperience, title: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-purple-500"
              required
            />
            <input
              placeholder="Organização *"
              value={editingExperience.organization}
              onChange={(e) => setEditingExperience({ ...editingExperience, organization: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-purple-500"
              required
            />
            <textarea
              placeholder="Descrição"
              value={editingExperience.description || ''}
              onChange={(e) => setEditingExperience({ ...editingExperience, description: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-purple-500"
              rows={2}
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-400">Início</label>
                <input
                  type="date"
                  value={editingExperience.start_date}
                  onChange={(e) => setEditingExperience({ ...editingExperience, start_date: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">Fim</label>
                <input
                  type="date"
                  value={editingExperience.end_date || ''}
                  onChange={(e) => setEditingExperience({ ...editingExperience, end_date: e.target.value || null })}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-purple-500"
                  disabled={editingExperience.current}
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-400">
              <input
                type="checkbox"
                checked={editingExperience.current}
                onChange={(e) => setEditingExperience({ ...editingExperience, current: e.target.checked })}
                className="accent-purple-500"
              />
              Atual
            </label>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 py-1.5 rounded text-sm transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Salvando...' : experienceId ? 'Atualizar' : 'Criar'}
              </button>
              {experienceId && (
                <button
                  type="button"
                  onClick={resetExperienceForm}
                  className="px-3 py-1.5 border border-gray-600 rounded text-sm hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <div className="lg:col-span-2 space-y-3">
            {experiences.length === 0 && (
              <p className="text-gray-500 text-sm">Nenhuma experiência cadastrada.</p>
            )}
            {experiences.map((e) => (
              <div key={e.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{e.title}</h4>
                    <span className="text-xs bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded">
                      {e.type === 'work' ? 'Trabalho' : 'Formação'}
                    </span>
                  </div>
                  <p className="text-purple-400 text-sm">{e.organization}</p>
                  <p className="text-gray-500 text-xs">
                    {e.start_date} — {e.current ? 'Atual' : e.end_date || ''}
                  </p>
                </div>
                <div className="flex gap-2 text-xs ml-4 shrink-0">
                  <button
                    onClick={() => {
                      setExperienceId(e.id)
                      setEditingExperience({
                        type: e.type,
                        title: e.title,
                        organization: e.organization,
                        description: e.description,
                        start_date: e.start_date,
                        end_date: e.end_date,
                        current: e.current,
                      })
                    }}
                    className="text-purple-400 hover:underline cursor-pointer"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteExperience(e.id)}
                    className="text-red-400 hover:underline cursor-pointer"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
