import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-5xl font-bold mb-4">
        Seu portfólio,{' '}
        <span className="text-purple-400">sua API</span>
      </h1>
      <p className="text-gray-400 text-lg max-w-xl mb-8">
        Crie e gerencie seu portfólio de desenvolvedor via API REST. Exiba seus
        projetos, skills e experiências em uma página pública.
      </p>
      <div className="flex gap-4">
        <Link
          to="/register"
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Criar Portfólio
        </Link>
        <a
          href="https://devshowcase-ynqy.onrender.com/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-gray-600 hover:border-purple-400 px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Documentação da API
        </a>
      </div>
      <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl text-left">
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
          <div className="text-2xl mb-2">📁</div>
          <h3 className="font-semibold mb-1">Projetos</h3>
          <p className="text-gray-400 text-sm">
            Adicione projetos com descrição, tecnologias e links.
          </p>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
          <div className="text-2xl mb-2">🛠️</div>
          <h3 className="font-semibold mb-1">Skills</h3>
          <p className="text-gray-400 text-sm">
            Liste suas habilidades com nível de proficiência.
          </p>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
          <div className="text-2xl mb-2">💼</div>
          <h3 className="font-semibold mb-1">Experiências</h3>
          <p className="text-gray-400 text-sm">
            Trabalhos e formação acadêmica em ordem cronológica.
          </p>
        </div>
      </div>
    </div>
  )
}
