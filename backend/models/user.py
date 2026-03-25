from extensions import db
from datetime import datetime, timezone

class User(db.Model):
    """
    Core User Profile. Linked to Firebase UID.
    """
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    firebase_uid = db.Column(db.String(128), unique=True, nullable=False, index=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    
    # Profile details (filled during onboarding)
    company_name = db.Column(db.String(255))
    website_url = db.Column(db.String(255))
    category = db.Column(db.String(100))
    tagline = db.Column(db.Text)
    target_audience = db.Column(db.Text)
    usp = db.Column(db.Text) # Core Unique Selling Proposition

    is_onboarded = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    competitors = db.relationship("UserCompetitor", back_populates="user", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "company_name": self.company_name,
            "website_url": self.website_url,
            "category": self.category,
            "is_onboarded": self.is_onboarded
        }

class UserCompetitor(db.Model):
    """
    Junction table for tracked competitors per User.
    """
    __tablename__ = 'user_competitors'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # We store the competitor name directly or link to Competitor ID if global
    competitor_name = db.Column(db.String(255), nullable=False)
    competitor_url = db.Column(db.String(255))
    
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    user = db.relationship("User", back_populates="competitors")

    def __repr__(self):
        return f"<UserCompetitor {self.competitor_name} for User {self.user_id}>"
