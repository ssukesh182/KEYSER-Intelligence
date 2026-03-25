from datetime import datetime, timedelta, timezone
from extensions import db
from models.diff import Diff
from models.source import Source

def get_recent_diffs_for_competitor(competitor_id: int, window_hours: int = 48) -> list:
    """Fetches diffs for the given competitor grouped within a time window."""
    cutoff = datetime.now(timezone.utc) - timedelta(hours=window_hours)
    
    diffs = db.session.query(Diff).join(Source).filter(
        Source.competitor_id == competitor_id,
        Diff.created_at >= cutoff
    ).all()
    
    return diffs
