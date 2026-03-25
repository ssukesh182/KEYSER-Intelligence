from extensions import db
from datetime import datetime, timezone


class InsightSource(db.Model):
    """Traceability table — links every insight back to the diff(s) that generated it."""

    __tablename__ = "insight_sources"

    id         = db.Column(db.Integer, primary_key=True)
    insight_id = db.Column(db.Integer, db.ForeignKey("insights.id"), nullable=False)
    diff_id    = db.Column(db.Integer, db.ForeignKey("diffs.id"), nullable=False)
    reasoning  = db.Column(db.Text)    # why this diff → this insight
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # relationships
    insight = db.relationship("Insight", back_populates="sources")
    diff    = db.relationship("Diff")

    def to_dict(self):
        return {
            "id":         self.id,
            "insight_id": self.insight_id,
            "diff_id":    self.diff_id,
            "reasoning":  self.reasoning,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f"<InsightSource insight={self.insight_id} diff={self.diff_id}>"
