from pydantic import BaseModel, Field
from datetime import datetime


class ProjectCreate(BaseModel):
    title: str = Field(min_length=1, max_length=100)
    description: str = Field(default="")
    technologies: str = Field(default="")
    github_url: str = Field(default="")
    live_url: str = Field(default="")
    image_url: str = Field(default="")
    featured: int = Field(default=0, ge=0, le=1)


class ProjectUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=100)
    description: str | None = None
    technologies: str | None = None
    github_url: str | None = None
    live_url: str | None = None
    image_url: str | None = None
    featured: int | None = Field(default=None, ge=0, le=1)


class ProjectOut(BaseModel):
    id: int
    title: str
    description: str
    technologies: str
    github_url: str
    live_url: str
    image_url: str
    featured: int
    created_at: datetime

    model_config = {"from_attributes": True}
