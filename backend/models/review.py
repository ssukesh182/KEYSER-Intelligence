from extensions import db
from datetime import datetime, timezone

class RawReview(db.Model):
    """
    Stores raw signal data (Reviews, Social Posts) per competitor.
    Linked to a specific User to ensure multi-tenancy.
    """
    __tablename__ = 'raw_reviews'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    competitor_name = db.Column(db.String(255), nullable=False)
    
    source = db.Column(db.String(50)) # reddit, trustpilot, serp_google, g2
    reviewer = db.Column(db.String(255))
    rating = db.Column(db.Float)
    review_text = db.Column(db.Text)
    review_time = db.Column(db.String(100))
    
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "source": self.source,
            "competitor": self.competitor_name,
            "reviewer": self.reviewer,
            "rating": self.rating,
            "review_text": self.review_text,
            "review_time": self.review_time
        }

class RawAd(db.Model):
    __tablename__ = 'raw_ads'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    competitor_name = db.Column(db.String(255), nullable=False)
    
    headline = db.Column(db.Text)
    summary = db.Column(db.Text)
    keyword = db.Column(db.String(255))
    channel = db.Column(db.String(50))
    thumbnail = db.Column(db.Text)
    source_link = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "competitor": self.competitor_name,
            "headline": self.headline,
            "summary": self.summary,
            "keyword": self.keyword,
            "channel": self.channel,
            "thumbnail": self.thumbnail,
            "source_link": self.source_link,
            "badge": "Active Strategy"
        }
