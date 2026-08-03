from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import User, Project, Skill, Experience

router = APIRouter(prefix="/api/portfolio", tags=["Portfólio Público"])


@router.get("/{username}")
def get_portfolio(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return {"error": "Usuário não encontrado"}

    projects = db.query(Project).filter(Project.owner_id == user.id).all()
    skills = db.query(Skill).filter(Skill.owner_id == user.id).all()
    experiences = db.query(Experience).filter(Experience.owner_id == user.id).all()

    return {
        "user": {
            "username": user.username,
            "full_name": user.full_name,
            "bio": user.bio,
            "avatar_url": user.avatar_url,
        },
        "projects": [
            {
                "id": p.id,
                "title": p.title,
                "description": p.description,
                "technologies": p.technologies,
                "github_url": p.github_url,
                "live_url": p.live_url,
                "image_url": p.image_url,
                "featured": bool(p.featured),
            }
            for p in projects
        ],
        "skills": [
            {
                "id": s.id,
                "name": s.name,
                "category": s.category,
                "proficiency": s.proficiency,
            }
            for s in skills
        ],
        "experiences": [
            {
                "id": e.id,
                "type": e.type,
                "title": e.title,
                "organization": e.organization,
                "description": e.description,
                "start_date": e.start_date,
                "end_date": e.end_date,
                "current": bool(e.current),
            }
            for e in experiences
        ],
    }
