from extensions import db
from datetime import datetime, timezone


class Source(db.Model):
    __tablename__ = "sources"

    id            = db.Column(db.Integer, primary_key=True)
    competitor_id = db.Column(db.Integer, db.ForeignKey("competitors.id"), nullable=False)
    url           = db.Column(db.Text, nullable=False)
    source_type   = db.Column(db.String(50), default="website")
    # source_type options: website, pricing, review, social, funding
    label         = db.Column(db.String(100))   # e.g. "Homepage", "Pricing Page"
    is_active     = db.Column(db.Boolean, default=True)
    last_scraped  = db.Column(db.DateTime)
    created_at    = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # relationships
    competitor = db.relationship("Competitor", back_populates="sources")
    snapshots  = db.relationship("Snapshot", back_populates="source", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id":            self.id,
            "competitor_id": self.competitor_id,
            "url":           self.url,
            "source_type":   self.source_type,
            "label":         self.label,
            "is_active":     self.is_active,
            "last_scraped":  self.last_scraped.isoformat() if self.last_scraped else None,
        }

    def __repr__(self):
        return f"<Source {self.label or self.url[:40]}>"
