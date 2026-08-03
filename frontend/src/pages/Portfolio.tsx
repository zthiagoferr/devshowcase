import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { portfolioApi, type PortfolioData } from '../api/portfolio'

export default function Portfolio() {
  const { username } = useParams<{ username: string }>()
  const [data, setData] = useState<PortfolioData | null>(null)
  const [error, setError] = useState('')
  const [search, setSearch] = useState(username || '')
  const [loading, setLoading] = useState(false)

  const fetchPortfolio = async (u: string) => {
    if (!u) return
    setLoading(true)
    setError('')
    try {
      const result = await portfolioApi.getByUsername(u)
      if ('error' in result) {
        setError(result.error as string)
        setData(null)
      } else {
        setData(result)
        setError('')
      }
    } catch {
      setError('Usuário não encontrado')
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (username) fetchPortfolio(username)
  }, [username])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    window.history.pushState({}, '', `/portfolio/${search}`)
    fetchPortfolio(search)
  }

  if (!username) {
    return (
      <div className="max-w-md mx-auto mt-16">
        <h2 className="text-2xl font-bold mb-4 text-center">Portfólio</h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Digite um username..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Buscar
          </button>
        </form>
      </div>
    )
  }

  if (loading) {
    return <p className="text-center mt-16 text-gray-400">Carregando...</p>
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-16">
        <h2 className="text-2xl font-bold mb-4 text-center">Portfólio</h2>
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Digite um username..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Buscar
          </button>
        </form>
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-2 rounded text-center">
          {error}
        </div>
      </div>
    )
  }

  if (!data) {
    return <p className="text-center mt-16 text-gray-400">Usuário não encontrado</p>
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">{data.user.full_name || data.user.username}</h1>
        <p className="text-gray-400">@{data.user.username}</p>
        {data.user.bio && <p className="text-gray-300 mt-4 max-w-lg mx-auto">{data.user.bio}</p>}
      </div>

      {data.projects.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Projetos</h2>
          <div className="grid gap-4">
            {data.projects.map((p) => (
              <div key={p.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{p.title}</h3>
                  {p.featured && (
                    <span className="text-xs bg-purple-600/30 text-purple-300 px-2 py-0.5 rounded">
                      Destaque
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-3">{p.description}</p>
                {p.technologies && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {p.technologies.split(',').map((t) => (
                      <span
                        key={t.trim()}
                        className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded"
                      >
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-3 text-sm">
                  {p.github_url && (
                    <a
                      href={p.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:underline"
                    >
                      GitHub
                    </a>
                  )}
                  {p.live_url && (
                    <a
                      href={p.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:underline"
                    >
                      Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.skills.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((s) => (
              <div
                key={s.id}
                className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 flex items-center gap-3"
              >
                <span>{s.name}</span>
                <span className="text-xs text-gray-500">{s.category}</span>
                <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${s.proficiency}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.experiences.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Experiências</h2>
          <div className="space-y-4">
            {data.experiences.map((e) => (
              <div key={e.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-5">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold">{e.title}</h3>
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                    {e.type === 'work' ? 'Trabalho' : 'Formação'}
                  </span>
                </div>
                <p className="text-purple-400 text-sm">{e.organization}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {e.start_date} — {e.current ? 'Atual' : e.end_date || ''}
                </p>
                {e.description && (
                  <p className="text-gray-400 text-sm mt-2">{e.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="text-center mt-12 pb-8">
        <Link
          to="/register"
          className="text-sm text-purple-400 hover:underline"
        >
          Crie seu próprio portfólio no DevShowcase
        </Link>
      </div>
    </div>
  )
}
