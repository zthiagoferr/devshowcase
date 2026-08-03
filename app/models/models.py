from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    hashed_password = Column(String(128), nullable=False)
    full_name = Column(String(100))
    bio = Column(Text, default="")
    avatar_url = Column(String(255), default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan")
    skills = relationship("Skill", back_populates="owner", cascade="all, delete-orphan")
    experiences = relationship("Experience", back_populates="owner", cascade="all, delete-orphan")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(Text, default="")
    technologies = Column(String(255), default="")  # "Python,FastAPI,React"
    github_url = Column(String(255), default="")
    live_url = Column(String(255), default="")
    image_url = Column(String(255), default="")
    featured = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner = relationship("User", back_populates="projects")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    category = Column(String(50), default="")  # "language", "framework", "tool"
    proficiency = Column(Float, default=0.0)  # 0 a 100

    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner = relationship("User", back_populates="skills")


class Experience(Base):
    __tablename__ = "experiences"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(20), nullable=False)  # "work" ou "education"
    title = Column(String(100), nullable=False)
    organization = Column(String(100), nullable=False)
    description = Column(Text, default="")
    start_date = Column(String(10), default="")
    end_date = Column(String(10), default="")
    current = Column(Integer, default=0)

    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner = relationship("User", back_populates="experiences")
