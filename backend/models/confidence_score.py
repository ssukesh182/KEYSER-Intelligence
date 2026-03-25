"""
models/confidence_score.py — Stores per-insight confidence breakdown.
"""
from datetime import datetime, timezone
from extensions import db


class ConfidenceScore(db.Model):
    __tablename__ = "confidence_scores"

    id                    = db.Column(db.Integer, primary_key=True)
    insight_id            = db.Column(db.Integer, db.ForeignKey("insights.id"),
                                      nullable=False, unique=True)
    base_confidence       = db.Column(db.Float, nullable=False, default=0.5)
    triangulation_bonus   = db.Column(db.Float, nullable=False, default=0.0)
    novelty_score         = db.Column(db.Float, nullable=False, default=0.5)
    urgency_score         = db.Column(db.Float, nullable=False, default=0.5)
    final_confidence      = db.Column(db.Float, nullable=False, default=0.5)
    created_at            = db.Column(db.DateTime,
                                      default=lambda: datetime.now(timezone.utc))
    updated_at            = db.Column(db.DateTime,
                                      default=lambda: datetime.now(timezone.utc),
                                      onupdate=lambda: datetime.now(timezone.utc))

    insight = db.relationship("Insight",
                              backref=db.backref("confidence_score", uselist=False))

    def to_dict(self) -> dict:
        return {
            "id":                  self.id,
            "insight_id":          self.insight_id,
            "base_confidence":     self.base_confidence,
            "triangulation_bonus": self.triangulation_bonus,
            "novelty_score":       self.novelty_score,
            "urgency_score":       self.urgency_score,
            "final_confidence":    self.final_confidence,
            "created_at":          self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self) -> str:
        return (f"<ConfidenceScore insight={self.insight_id} "
                f"final={self.final_confidence:.2f}>")
