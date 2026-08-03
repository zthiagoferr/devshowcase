from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.api import auth, projects, skills, experiences, portfolio

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DevShowcase",
    description="API de Portfólio para Desenvolvedores",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(skills.router)
app.include_router(experiences.router)
app.include_router(portfolio.router)


@app.get("/")
def root():
    return {
        "name": "DevShowcase API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc",
    }
