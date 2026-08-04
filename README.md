<div align="center">

<img src="https://img.shields.io/badge/Python-3.14-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python 3.14">
<img src="https://img.shields.io/badge/FastAPI-0.141-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
<img src="https://img.shields.io/badge/SQLAlchemy-2.0-D71F00?style=for-the-badge&logo=sqlalchemy&logoColor=white" alt="SQLAlchemy">
<img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License">

</div>

# 🚀 DevShowcase

> API REST para gerenciar e exibir portfólios profissionais de desenvolvedores.

Construa seu portfólio via API e disponibilize publicamente para recrutadores e empresas. Ideal para fixar no GitHub e impressionar em entrevistas.

## ✨ Funcionalidades

- 🔐 **Autenticação JWT** — registro, login e proteção de rotas
- 📁 **CRUD de Projetos** — título, descrição, tecnologias, links
- 🛠️ **Skills** — linguagens e ferramentas com nível de proficiência (0-100)
- 💼 **Experiências** — trabalhos e formação acadêmica
- 🌐 **Portfólio Público** — rota pública por username (sem autenticação)
- 📚 **Documentação Automática** — Swagger UI (`/docs`) e ReDoc (`/redoc`)

## 🏗️ Tecnologias

| Tecnologia | Uso |
|---|---|
| **FastAPI** | Framework web rápido e moderno |
| **SQLAlchemy** | ORM para banco de dados |
| **SQLite** | Banco de dados (troque por PostgreSQL em produção) |
| **Pydantic** | Validação de dados |
| **JWT (python-jose)** | Autenticação stateless |
| **bcrypt/passlib** | Hash seguro de senhas |
| **Uvicorn** | Servidor ASGI |

## 🌐 Produção

| Ambiente | URL |
|---|---|
| **API** | [devshowcase-ynqy.onrender.com](https://devshowcase-ynqy.onrender.com) |
| **Frontend** | [frontend-beta-nine-u8szd09riu.vercel.app](https://frontend-beta-nine-u8szd09riu.vercel.app) |

- **API Docs**: [Swagger](https://devshowcase-ynqy.onrender.com/docs) | [ReDoc](https://devshowcase-ynqy.onrender.com/redoc)
- **Frontend**: React + Vite + TypeScript + Tailwind (deploy na Vercel)

> Nota: No plano gratuito do Render, a API "dorme" após 15 min sem requisições. A primeira requisição pode demorar ~30s para acordar.

## 🚀 Rodando Localmente

```bash
# Clone o repositório
git clone https://github.com/zthiagoferr/devshowcase.git
cd devshowcase

# Crie o ambiente virtual
python3 -m venv .venv
source .venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Execute
uvicorn app.main:app --reload
```

Acesse: **http://localhost:8000/docs**

## 🐳 Docker

```bash
docker build -t devshowcase .
docker run -p 8000:8000 devshowcase
```

## 📖 Endpoints

### 🔓 Público (sem autenticação)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/` | Status da API |
| `GET` | `/api/portfolio/{username}` | Portfólio público do usuário |

### 🔒 Autenticação

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/auth/register` | Registrar novo usuário |
| `POST` | `/api/auth/login` | Login (retorna JWT) |

### 📁 Projetos (autenticado)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/projects/` | Listar meus projetos |
| `POST` | `/api/projects/` | Criar projeto |
| `PUT` | `/api/projects/{id}` | Atualizar projeto |
| `DELETE` | `/api/projects/{id}` | Remover projeto |

### 🛠️ Skills (autenticado)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/skills/` | Listar skills |
| `POST` | `/api/skills/` | Adicionar skill |
| `PUT` | `/api/skills/{id}` | Atualizar skill |
| `DELETE` | `/api/skills/{id}` | Remover skill |

### 💼 Experiências (autenticado)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/experiences/` | Listar experiências |
| `POST` | `/api/experiences/` | Adicionar experiência |
| `PUT` | `/api/experiences/{id}` | Atualizar experiência |
| `DELETE` | `/api/experiences/{id}` | Remover experiência |

## 🧪 Testes

```bash
pytest -v
```

## 🏛️ Arquitetura

Documentação completa de engenharia: [ARCHITECTURE.md](ARCHITECTURE.md)

## 📁 Estrutura do Projeto

```
devshowcase/
├── .github/workflows/  # CI/CD GitHub Actions
├── app/
│   ├── api/           # Rotas da API
│   │   ├── auth.py        # Registro e login
│   │   ├── projects.py    # CRUD de projetos
│   │   ├── skills.py      # CRUD de skills
│   │   ├── experiences.py # CRUD de experiências
│   │   └── portfolio.py   # Portfólio público
│   ├── models/         # Modelos SQLAlchemy
│   │   └── models.py
│   ├── schemas/        # Schemas Pydantic
│   │   ├── user.py
│   │   ├── project.py
│   │   ├── skill.py
│   │   └── experience.py
│   ├── services/       # Lógica de negócio
│   │   └── auth.py        # JWT e hash de senha
│   ├── config.py       # Configurações
│   ├── database.py     # Conexão com banco
│   └── main.py         # Ponto de entrada
├── frontend/
│   └── src/
│       ├── api/         # Camada HTTP (axios + JWT)
│       ├── components/  # Layout, ProtectedRoute
│       ├── context/     # AuthContext (estado global)
│       └── pages/       # Home, Login, Register, Portfolio, Dashboard
├── tests/              # Testes automatizados
├── .env                # Variáveis de ambiente
├── .gitignore
├── Dockerfile
├── ARCHITECTURE.md     # Documento de arquitetura
├── LICENSE
└── requirements.txt
```

## 🔜 Próximos Passos

- [ ] Upload de imagens (avatar e screenshots de projetos)
- [x] Deploy no Render
- [ ] Frontend com React (consumindo esta API)
- [ ] Migrar para PostgreSQL (produção)
- [ ] CI/CD com GitHub Actions

## 📝 Licença

MIT © [Thiago Ferreira](https://github.com/zthiagoferr)
