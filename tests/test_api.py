import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app

SQLITE_DATABASE_URL = "sqlite://"

engine = create_engine(
    SQLITE_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def client():
    Base.metadata.create_all(bind=engine)
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    Base.metadata.drop_all(bind=engine)
    app.dependency_overrides.clear()


@pytest.fixture
def auth_token(client):
    client.post("/api/auth/register", json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "secret123",
        "full_name": "Test User",
    })
    response = client.post("/api/auth/login", params={
        "username": "testuser",
        "password": "secret123",
    })
    return response.json()["access_token"]


class TestAuth:
    def test_register(self, client):
        response = client.post("/api/auth/register", json={
            "username": "fulano",
            "email": "fulano@example.com",
            "password": "123456",
            "full_name": "Fulano de Tal",
        })
        assert response.status_code == 201
        data = response.json()
        assert data["username"] == "fulano"
        assert data["email"] == "fulano@example.com"
        assert "hashed_password" not in data

    def test_login(self, auth_token):
        assert len(auth_token) > 0

    def test_register_duplicate(self, client, auth_token):
        response = client.post("/api/auth/register", json={
            "username": "testuser",
            "email": "other@example.com",
            "password": "123456",
        })
        assert response.status_code == 400


class TestProjects:
    def test_create_project(self, client, auth_token):
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = client.post("/api/projects/", json={
            "title": "Meu Projeto",
            "description": "Descrição do projeto",
            "technologies": "Python,FastAPI",
            "github_url": "https://github.com/user/repo",
        }, headers=headers)
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Meu Projeto"
        assert data["technologies"] == "Python,FastAPI"

    def test_list_projects(self, client, auth_token):
        headers = {"Authorization": f"Bearer {auth_token}"}
        client.post("/api/projects/", json={"title": "Projeto 1"}, headers=headers)
        client.post("/api/projects/", json={"title": "Projeto 2"}, headers=headers)

        response = client.get("/api/projects/", headers=headers)
        assert response.status_code == 200
        assert len(response.json()) == 2

    def test_delete_project(self, client, auth_token):
        headers = {"Authorization": f"Bearer {auth_token}"}
        create = client.post("/api/projects/", json={"title": "Para deletar"}, headers=headers)
        project_id = create.json()["id"]

        response = client.delete(f"/api/projects/{project_id}", headers=headers)
        assert response.status_code == 204

    def test_unauthorized(self, client):
        response = client.get("/api/projects/")
        assert response.status_code == 401


class TestPortfolio:
    def test_public_portfolio(self, client, auth_token):
        headers = {"Authorization": f"Bearer {auth_token}"}
        client.post("/api/projects/", json={
            "title": "Projeto Público",
            "description": "Visível para todos",
        }, headers=headers)
        client.post("/api/skills/", json={
            "name": "Python",
            "category": "language",
            "proficiency": 90,
        }, headers=headers)

        response = client.get("/api/portfolio/testuser")
        assert response.status_code == 200
        data = response.json()
        assert data["user"]["username"] == "testuser"
        assert len(data["projects"]) == 1
        assert len(data["skills"]) == 1
        assert data["projects"][0]["title"] == "Projeto Público"
