"""
models/validation_log.py — Tracks validation state at every pipeline layer.
"""
from datetime import datetime, timezone
from extensions import db


class ValidationLog(db.Model):
    __tablename__ = "validation_logs"

    id                = db.Column(db.Integer, primary_key=True)
    insight_id        = db.Column(db.Integer, db.ForeignKey("insights.id"), nullable=True)
    validation_stage  = db.Column(db.String(50), nullable=False)   # source|extraction|triangulation|change|output
    status            = db.Column(db.String(20), nullable=False)    # passed|failed|warning
    confidence_before = db.Column(db.Float, nullable=True)
    confidence_after  = db.Column(db.Float, nullable=True)
    notes             = db.Column(db.Text, nullable=True)           # human-readable reason
    timestamp         = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # relationship (optional — insight may not exist yet at source-validation time)
    insight = db.relationship("Insight", backref=db.backref("validation_logs", lazy="dynamic"),
                              foreign_keys=[insight_id])

    def to_dict(self) -> dict:
        return {
            "id":                self.id,
            "insight_id":        self.insight_id,
            "validation_stage":  self.validation_stage,
            "status":            self.status,
            "confidence_before": self.confidence_before,
            "confidence_after":  self.confidence_after,
            "notes":             self.notes,
            "timestamp":         self.timestamp.isoformat() if self.timestamp else None,
        }

    def __repr__(self) -> str:
        return f"<ValidationLog stage={self.validation_stage} status={self.status}>"
