from extensions import db
from datetime import datetime, timezone

class HiringSignal(db.Model):
    __tablename__ = "hiring_signals"

    id            = db.Column(db.Integer, primary_key=True)
    user_id       = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    competitor_name = db.Column(db.String(255), nullable=False)

    source        = db.Column(db.String(30), nullable=False)  # apollo | linkedin | arbeitnow | seed
    role_title    = db.Column(db.Text, nullable=False)
    department    = db.Column(db.String(100))
    location      = db.Column(db.String(200))
    job_url       = db.Column(db.Text)
    posted_at     = db.Column(db.DateTime)
    fetched_at    = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        db.UniqueConstraint("user_id", "competitor_name", "source", "role_title", "posted_at",
                            name="uq_hiring_signal_user"),
    )

    def to_dict(self):
        return {
            "id":            self.id,
            "competitor":    self.competitor_name,
            "source":        self.source,
            "role":          self.role_title,
            "dept":          self.department,
            "location":      self.location,
            "job_url":       self.job_url,
            "posted":        self._relative_date(self.posted_at),
            "posted_at":     self.posted_at.isoformat() if self.posted_at else None,
            "fetched_at":    self.fetched_at.isoformat() if self.fetched_at else None,
        }

    @staticmethod
    def _relative_date(dt):
        if not dt: return "Recently"
        now = datetime.now(timezone.utc)
        if dt.tzinfo is None: dt = dt.replace(tzinfo=timezone.utc)
        delta = now - dt
        days = delta.days
        if days == 0: return "Today"
        if days == 1: return "Yesterday"
        if days < 7: return f"{days} days ago"
        if days < 30:
            weeks = days // 7
            return f"{weeks} week{'s' if weeks > 1 else ''} ago"
        return f"{days // 30} month{'s' if days // 30 > 1 else ''} ago"

    def __repr__(self):
        return f"<HiringSignal {self.user_id}/{self.source}: {self.role_title[:40]}>"
