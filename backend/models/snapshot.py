from extensions import db
from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import JSONB


class Snapshot(db.Model):
    __tablename__ = "snapshots"

    id          = db.Column(db.Integer, primary_key=True)
    source_id   = db.Column(db.Integer, db.ForeignKey("sources.id"), nullable=False)
    clean_text  = db.Column(db.Text)           # BS4-stripped readable text
    raw_html    = db.Column(db.Text)           # full raw HTML (kept for audit)
    meta        = db.Column(JSONB, default={}) # flexible JSONB: word_count, h1, title, etc.
    scraped_at  = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    is_seed     = db.Column(db.Boolean, default=False)  # True = seeded, not live-scraped

    # relationships
    source        = db.relationship("Source", back_populates="snapshots")
    diffs_as_old  = db.relationship("Diff", foreign_keys="Diff.old_snapshot_id",
                                    back_populates="old_snapshot", cascade="all, delete-orphan")
    diffs_as_new  = db.relationship("Diff", foreign_keys="Diff.new_snapshot_id",
                                    back_populates="new_snapshot", cascade="all, delete-orphan")

    def to_dict(self, include_text=False):
        d = {
            "id":         self.id,
            "source_id":  self.source_id,
            "meta":       self.meta,
            "scraped_at": self.scraped_at.isoformat() if self.scraped_at else None,
            "is_seed":    self.is_seed,
        }
        if include_text:
            d["clean_text"] = self.clean_text
        return d

    def __repr__(self):
        return f"<Snapshot {self.id} source={self.source_id}>"
