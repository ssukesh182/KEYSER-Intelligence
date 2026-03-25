from extensions import db
from datetime import datetime, timezone


class Competitor(db.Model):
    __tablename__ = "competitors"

    id          = db.Column(db.Integer, primary_key=True)
    name        = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text)
    industry    = db.Column(db.String(100), default="q-commerce")
    logo_url    = db.Column(db.Text)
    created_at  = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at  = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc),
                            onupdate=lambda: datetime.now(timezone.utc))

    # relationships
    sources  = db.relationship("Source",  back_populates="competitor", cascade="all, delete-orphan")
    insights = db.relationship("Insight", back_populates="competitor", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id":          self.id,
            "name":        self.name,
            "description": self.description,
            "industry":    self.industry,
            "logo_url":    self.logo_url,
            "created_at":  self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f"<Competitor {self.name}>"
