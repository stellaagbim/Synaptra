from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime

from .session import Base


class TaskRun(Base):
    __tablename__ = "task_runs"

    id = Column(Integer, primary_key=True, index=True)
    goal = Column(String, nullable=False)
    status = Column(String, default="running")   # running / success / failed
    started_at = Column(DateTime, default=datetime.utcnow)
    finished_at = Column(DateTime, nullable=True)
    steps_taken = Column(Integer, default=0)

    # One-to-many relationship
    steps = relationship("TaskStep", back_populates="task", cascade="all, delete-orphan")


class TaskStep(Base):
    __tablename__ = "task_steps"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("task_runs.id"))
    step_number = Column(Integer)
    tool = Column(String)
    instruction = Column(Text)
    output = Column(Text)
    success = Column(Boolean, default=True)

    # Step belongs to a task
    task = relationship("TaskRun", back_populates="steps")
