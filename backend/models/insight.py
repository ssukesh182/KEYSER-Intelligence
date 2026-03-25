from extensions import db
from datetime import datetime, timezone


class Insight(db.Model):
    __tablename__ = "insights"

    id            = db.Column(db.Integer, primary_key=True)
    competitor_id = db.Column(db.Integer, db.ForeignKey("competitors.id"), nullable=False)

    title         = db.Column(db.Text, nullable=False)  # short headline
    description   = db.Column(db.Text)                  # full insight text
    category      = db.Column(db.String(50))             # pricing, messaging, offer, trend
    action        = db.Column(db.Text)                   # "Test this angle", "Monitor this"
    confidence    = db.Column(db.Float, default=0.5)     # 0.0 – 1.0
    novelty       = db.Column(db.Float, default=0.5)     # how new/unusual is this?
    frequency     = db.Column(db.Integer, default=1)     # how many times observed
    relevance     = db.Column(db.Float, default=0.5)     # relevance to current trends

    created_at    = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # relationships
    competitor    = db.relationship("Competitor", back_populates="insights")
    sources       = db.relationship("InsightSource", back_populates="insight",
                                    cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id":            self.id,
            "competitor_id": self.competitor_id,
            "title":         self.title,
            "description":   self.description,
            "category":      self.category,
            "action":        self.action,
            "confidence":    self.confidence,
            "novelty":       self.novelty,
            "frequency":     self.frequency,
            "relevance":     self.relevance,
            "created_at":    self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f"<Insight {self.id}: {self.title[:40]}>"
