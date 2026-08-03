from pydantic import BaseModel, Field


class SkillCreate(BaseModel):
    name: str = Field(min_length=1, max_length=50)
    category: str = Field(default="")
    proficiency: float = Field(default=0.0, ge=0, le=100)


class SkillUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=50)
    category: str | None = None
    proficiency: float | None = Field(default=None, ge=0, le=100)


class SkillOut(BaseModel):
    id: int
    name: str
    category: str
    proficiency: float

    model_config = {"from_attributes": True}
