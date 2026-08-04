# Arquitetura do DevShowcase

Documento de arquitetura de software — engenharia, decisões técnicas e visão sistêmica.

---

## 1. Visão Geral

DevShowcase é uma plataforma full-stack para portfólio de desenvolvedores. O backend expõe uma API REST com FastAPI e o frontend consome essa API com React. Ambos deployados em cloud gratuita com CI/CD automatizado.

```
┌──────────────────────────────────────────────────────────────────┐
│                        USUÁRIO FINAL                              │
│                                                                   │
│  Navegador ──► https://frontend-....vercel.app                    │
│                      │                                            │
│                      │ REST API (HTTPS)                            │
│                      ▼                                            │
│              https://devshowcase-ynqy.onrender.com                 │
│                      │                                            │
│          ┌───────────┴───────────┐                                │
│          │     FASTAPI (app/)     │                                │
│          │  ┌──────────────────┐  │                                │
│          │  │  /api/auth       │  │  JWT + bcrypt                  │
│          │  │  /api/projects   │  │  CRUD protegido                │
│          │  │  /api/skills     │  │  CRUD protegido                │
│          │  │  /api/experiences│  │  CRUD protegido                │
│          │  │  /api/portfolio  │  │  Público (sem auth)            │
│          │  └──────────────────┘  │                                │
│          │         │              │                                │
│          │         ▼              │                                │
│          │  SQLAlchemy ORM        │                                │
│          │         │              │                                │
│          ▼         ▼              │                                │
│     ┌───────────────┐             │                                │
│     │    SQLite     │   (efêmero) │                                │
│     └───────────────┘             │                                │
│          Render (Docker)          │                                │
└──────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│                 CI/CD (GitHub Actions)             │
│                                                    │
│  push ──► pytest ──► npm build ──► Deploy auto    │
└──────────────────────────────────────────────────┘
```

---

## 2. Stack Tecnológica

### Backend

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| Framework | FastAPI 0.141 | Alto desempenho, async nativo, OpenAPI automático, type hints |
| ORM | SQLAlchemy 2.0 | Maduro, mapeamento objeto-relacional, migrations futuras |
| Validação | Pydantic 2.x | Integração nativa com FastAPI, serialização tipada |
| Autenticação | JWT + bcrypt | Stateless, sem sessão, bcrypt é resistente a GPU |
| Servidor | Uvicorn 0.52 | ASGI, leve, alta concorrência |
| Container | Docker + Python 3.14 | Reproduzível, deploy idêntico local e cloud |
| Banco | SQLite | Zero configuração, ideal para demo/desenvolvimento |

### Frontend

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| Framework | React 19 | Ecossistema dominante, componentização |
| Build | Vite 8 | HMR instantâneo, build rápido (esbuild), ESM nativo |
| Tipagem | TypeScript 6 | Segurança em tempo de compilação, DX superior |
| Estilo | Tailwind CSS 4 | Utility-first, zero CSS customizado, build JIT |
| Rotas | React Router 7 | SPA routing com nested layouts |
| HTTP | Axios | Interceptors para JWT, API fluente |

### Infraestrutura

| Recurso | Provedor | Plano |
|---------|----------|-------|
| API | Render | Free (512 MB, dorme após 15 min) |
| Frontend | Vercel | Hobby (static hosting) |
| CI/CD | GitHub Actions | Gratuito (2.000 min/mês) |
| Código | GitHub + GitLab | Espelhado |

---

## 3. Diagrama de Fluxo de Dados

### Registro e Login

```
┌──────────┐     POST /api/auth/register      ┌──────────────┐
│ Frontend │ ──────────────────────────────────►│  auth.py     │
│ (React)  │                                    │              │
│          │    { username, email, password }    │ hash_password│
│          │                                     │ CRUD User    │
│          │◄──── 201 { id, username... } ──────│              │
└──────────┘                                    └──────┬───────┘
                                                       │
                                                       ▼
                                                ┌──────────────┐
                                                │   SQLite     │
                                                │   users      │
                                                └──────────────┘

┌──────────┐    POST /api/auth/login           ┌──────────────┐
│ Frontend │ ──────────────────────────────────►│  auth.py     │
│          │    ?username=u&password=p          │              │
│          │                                     │ verify_pass  │
│          │◄── { access_token, token_type } ───│ JWT sign     │
└──────────┘                                    └──────────────┘
     │
     │ localStorage.setItem('token', token)
     │
     ▼
  Axios interceptor: Authorization: Bearer <token>
```

### CRUD Protegido

```
┌──────────┐   GET/POST/PUT/DELETE /api/projects/  ┌──────────────┐
│ Frontend │ ───────────────────────────────────────►│ projects.py  │
│          │   Authorization: Bearer <jwt>          │              │
│          │                                         │ get_current_ │
│          │◄─── 200 [{...}] / 201 / 204 ───────────│ _user (JWT)  │
└──────────┘                                        │ CRUD         │
                                                    └──────┬───────┘
                                                           ▼
                                                    ┌──────────────┐
                                                    │   SQLite     │
                                                    └──────────────┘
```

### Portfólio Público (sem autenticação)

```
┌──────────┐   GET /api/portfolio/{username}    ┌──────────────┐
│ Visitante│ ───────────────────────────────────►│ portfolio.py │
│          │                                     │              │
│          │◄─ { user, projects, skills,        │ JOIN User +  │
│          │     experiences } ─────────────────│ Projects +   │
└──────────┘                                    │ Skills +     │
                                                │ Experiences  │
                                                └──────────────┘
```

---

## 4. Modelo Entidade-Relacionamento

```
┌───────────────────────┐
│        users          │
├───────────────────────┤
│ id          (PK, INT) │
│ username    (UNIQUE)  │
│ email       (UNIQUE)  │
│ hashed_password       │
│ full_name             │
│ bio                   │
│ avatar_url            │
│ created_at            │
└──────┬────────────────┘
       │ 1
       │
       ├──────────────────────────────────────────┐
       │ N               │ N                      │ N
       ▼                 ▼                        ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
│   projects   │  │    skills    │  │   experiences    │
├──────────────┤  ├──────────────┤  ├──────────────────┤
│ id   (PK)    │  │ id   (PK)    │  │ id       (PK)    │
│ owner_id(FK) │  │ owner_id(FK) │  │ owner_id (FK)    │
│ title        │  │ name         │  │ type             │
│ description  │  │ category     │  │ title            │
│ technologies │  │ proficiency  │  │ organization     │
│ github_url   │  │              │  │ description      │
│ live_url     │  │              │  │ start_date       │
│ image_url    │  │              │  │ end_date         │
│ featured     │  │              │  │ current          │
│ created_at   │  │              │  │                  │
└──────────────┘  └──────────────┘  └──────────────────┘
```

Cardinalidade: 1 usuário → N projetos, N skills, N experiências (FK `owner_id`).

---

## 5. Pipeline de CI/CD

```
git push (main)
      │
      ▼
┌─────────────────────────────────────────────────┐
│         GitHub Actions (.github/workflows)       │
│                                                  │
│  ┌──────────────┐    ┌───────────────────────┐   │
│  │  test-api     │    │  build-frontend       │   │
│  │               │    │                       │   │
│  │ Python 3.14   │    │ Node 22               │   │
│  │ pip install   │    │ npm ci                │   │
│  │ pytest -v     │    │ npm run build (tsc)   │   │
│  └──────┬───────┘    └───────┬───────────────┘   │
│         │                    │                    │
│         └────────┬───────────┘                    │
│                  ▼                                │
│            ✅ All green                            │
└──────────────────┬──────────────────────────────┘
                   │
     ┌─────────────┴─────────────┐
     ▼                           ▼
┌──────────┐              ┌──────────┐
│  Render  │              │  Vercel  │
│          │              │          │
│ Docker   │              │ Static   │
│ auto     │              │ auto     │
│ deploy   │              │ deploy   │
└──────────┘              └──────────┘
```

**Nota**: Render e Vercel já fazem deploy automático ao detectar push no branch `main`. O GitHub Actions garante que só código testado chega em produção.

---

## 6. Decisões de Arquitetura

### Por que FastAPI e não Flask?
FastAPI oferece validação de tipos nativa (Pydantic), documentação OpenAPI automática via Swagger/ReDoc, e performance comparável a Node.js graças ao ASGI assíncrono. Flask exigiria plugins externos para tudo isso.

### Por que SQLite e não PostgreSQL?
SQLite foi escolhido para desenvolvimento rápido — zero configuração, sem servidor de banco. Para produção, a migração para PostgreSQL no Render é o próximo passo natural (gratuito por 90 dias). O projeto já está preparado: basta trocar `DATABASE_URL` e remover `check_same_thread`.

### Por que JWT e não sessão?
Tokens JWT são stateless: o servidor não mantém estado de sessão. O token contém claims assinadas criptograficamente. Ideal para APIs REST e deploy em múltiplas instâncias (escala horizontal futura).

### Por que bcrypt e não SHA-256?
bcrypt é um algoritmo de hash lento, projetado para ser resistente a ataques de força bruta com GPUs. SHA-256 é rápido demais para hashing de senhas — vulnerável a rainbow tables e brute force.

### Por que React + Vite e não Next.js?
Para uma SPA (Single Page Application) que consome uma API REST externa, Vite é mais adequado: build instantâneo, menor bundle, sem complexidade de SSR. Next.js seria overengineering para este caso.

### Por que monorepo (frontend + backend no mesmo repo)?
Facilita CI/CD unificado, consistência de versões e deploy coordenado. Ambos os serviços são intimamente acoplados (frontend só existe para consumir esta API específica).

---

## 7. Segurança

| Camada | Medida |
|--------|--------|
| Senhas | bcrypt com custo automático, nunca armazenadas em plain text |
| Autenticação | JWT com expiração (30 min), assinado com HS256 |
| Autorização | Dependency `get_current_user` em todas as rotas protegidas |
| SQL Injection | ORM SQLAlchemy com queries parametrizadas |
| CORS | `allow_origins=["*"]` (ambiente de demo; restringir em produção) |
| Token Storage | `localStorage` no frontend (aceitável para portfólio; HttpOnly cookie ideal) |
| Variáveis | `SECRET_KEY` via env var, nunca commitada (.env no gitignore) |

---

## 8. Deploy

### Render (API)
- Dockerfile auto-detectado
- `PORT` via env var (Render injeta automaticamente)
- `SECRET_KEY` configurada no painel
- URL: `devshowcase-ynqy.onrender.com`

### Vercel (Frontend)
- Framework Preset: Vite
- Root Directory: `frontend`
- `vercel.json` com rewrites SPA
- Build via `npm run build`
- URL: `frontend-beta-nine-u8szd09riu.vercel.app`

---

## 9. Testes

- Framework: pytest
- Banco: SQLite em memória (`StaticPool`)
- Cliente HTTP: `TestClient` do FastAPI
- Cobertura: 8 cenários (registro, login, CRUD, autorização, portfólio público)
- Localizado em: `tests/test_api.py`

---

## 10. Próximos Passos

- [ ] Migrar para PostgreSQL no Render
- [ ] Upload de imagens (avatar, screenshots de projetos)
- [ ] Domínio personalizado com HTTPS
- [ ] Testes end-to-end (Playwright/Cypress)
- [ ] Cache com Redis para portfólio público
- [ ] Rate limiting nas rotas públicas

---

*Documento mantido por Thiago Ferreira — Engenharia e Arquitetura do DevShowcase.*
