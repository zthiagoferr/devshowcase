from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import Skill, User
from app.schemas.skill import SkillCreate, SkillUpdate, SkillOut
from app.services.auth import get_current_user

router = APIRouter(prefix="/api/skills", tags=["Skills"])


@router.get("/", response_model=list[SkillOut])
def list_skills(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Skill).filter(Skill.owner_id == current_user.id).all()


@router.post("/", response_model=SkillOut, status_code=status.HTTP_201_CREATED)
def create_skill(
    data: SkillCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    skill = Skill(**data.model_dump(), owner_id=current_user.id)
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill


@router.put("/{skill_id}", response_model=SkillOut)
def update_skill(
    skill_id: int,
    data: SkillUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    skill = db.query(Skill).filter(
        Skill.id == skill_id, Skill.owner_id == current_user.id
    ).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill não encontrada")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(skill, field, value)

    db.commit()
    db.refresh(skill)
    return skill


@router.delete("/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_skill(
    skill_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    skill = db.query(Skill).filter(
        Skill.id == skill_id, Skill.owner_id == current_user.id
    ).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill não encontrada")
    db.delete(skill)
    db.commit()
