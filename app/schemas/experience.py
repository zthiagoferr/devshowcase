from pydantic import BaseModel, Field


class ExperienceCreate(BaseModel):
    type: str = Field(pattern="^(work|education)$")
    title: str = Field(min_length=1, max_length=100)
    organization: str = Field(min_length=1, max_length=100)
    description: str = Field(default="")
    start_date: str = Field(default="")
    end_date: str = Field(default="")
    current: int = Field(default=0, ge=0, le=1)


class ExperienceUpdate(BaseModel):
    type: str | None = Field(default=None, pattern="^(work|education)$")
    title: str | None = Field(default=None, max_length=100)
    organization: str | None = Field(default=None, max_length=100)
    description: str | None = None
    start_date: str | None = None
    end_date: str | None = None
    current: int | None = Field(default=None, ge=0, le=1)


class ExperienceOut(BaseModel):
    id: int
    type: str
    title: str
    organization: str
    description: str
    start_date: str
    end_date: str
    current: int

    model_config = {"from_attributes": True}
