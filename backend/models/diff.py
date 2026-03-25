from extensions import db
from datetime import datetime, timezone


class Diff(db.Model):
    __tablename__ = "diffs"

    id              = db.Column(db.Integer, primary_key=True)
    source_id       = db.Column(db.Integer, db.ForeignKey("sources.id"), nullable=False)
    old_snapshot_id = db.Column(db.Integer, db.ForeignKey("snapshots.id"), nullable=False)
    new_snapshot_id = db.Column(db.Integer, db.ForeignKey("snapshots.id"), nullable=False)

    # What changed and how important it is
    change_type       = db.Column(db.String(50))  # pricing, messaging, offer, cta, general
    significance      = db.Column(db.Float, default=0.0)  # 0.0 – 1.0
    diff_text         = db.Column(db.Text)           # unified diff output
    added_lines       = db.Column(db.Integer, default=0)
    removed_lines     = db.Column(db.Integer, default=0)
    summary           = db.Column(db.Text)           # human-readable one-liner

    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # relationships
    old_snapshot = db.relationship("Snapshot", foreign_keys=[old_snapshot_id],
                                   back_populates="diffs_as_old")
    new_snapshot = db.relationship("Snapshot", foreign_keys=[new_snapshot_id],
                                   back_populates="diffs_as_new")

    def to_dict(self):
        return {
            "id":              self.id,
            "source_id":       self.source_id,
            "old_snapshot_id": self.old_snapshot_id,
            "new_snapshot_id": self.new_snapshot_id,
            "change_type":     self.change_type,
            "significance":    self.significance,
            "added_lines":     self.added_lines,
            "removed_lines":   self.removed_lines,
            "summary":         self.summary,
            "diff_text":       self.diff_text,
            "created_at":      self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f"<Diff source={self.source_id} type={self.change_type} sig={self.significance:.2f}>"
