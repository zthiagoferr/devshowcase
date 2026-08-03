from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import Experience, User
from app.schemas.experience import ExperienceCreate, ExperienceUpdate, ExperienceOut
from app.services.auth import get_current_user

router = APIRouter(prefix="/api/experiences", tags=["Experiências"])


@router.get("/", response_model=list[ExperienceOut])
def list_experiences(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Experience).filter(Experience.owner_id == current_user.id).all()


@router.post("/", response_model=ExperienceOut, status_code=status.HTTP_201_CREATED)
def create_experience(
    data: ExperienceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    exp = Experience(**data.model_dump(), owner_id=current_user.id)
    db.add(exp)
    db.commit()
    db.refresh(exp)
    return exp


@router.put("/{exp_id}", response_model=ExperienceOut)
def update_experience(
    exp_id: int,
    data: ExperienceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    exp = db.query(Experience).filter(
        Experience.id == exp_id, Experience.owner_id == current_user.id
    ).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experiência não encontrada")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(exp, field, value)

    db.commit()
    db.refresh(exp)
    return exp


@router.delete("/{exp_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_experience(
    exp_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    exp = db.query(Experience).filter(
        Experience.id == exp_id, Experience.owner_id == current_user.id
    ).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experiência não encontrada")
    db.delete(exp)
    db.commit()
