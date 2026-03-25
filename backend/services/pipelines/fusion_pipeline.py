import logging
from extensions import db
from models.insight import Insight
from models.competitor import Competitor
from models.diff import Diff
from routes.source_reviews import fetch_reddit_reviews, fetch_trustpilot_reviews
from services.intelligence.fusion_engine import FusionEngine

logger = logging.getLogger(__name__)

class FusionPipeline:
    def __init__(self):
        self.engine = FusionEngine()

    def run_triangulation(self, competitor_id):
        """
        Executes the full triangulation cycle for a competitor.
        """
        competitor = db.session.get(Competitor, competitor_id)
        if not competitor:
            logger.error(f"Competitor {competitor_id} not found.")
            return

        logger.info(f"Starting OSINT Fusion for {competitor.name}...")

        # 1. Fetch Recent Diffs
        recent_diffs = db.session.query(Diff).filter(
            Diff.competitor_id == competitor_id
        ).order_by(Diff.created_at.desc()).limit(5).all()

        diffs_text = "\n".join([f"- {d.title}: {d.summary}" for d in recent_diffs])

        # 2. Fetch Reviews (Reddit & Trustpilot)
        # Note: fetch_reddit_reviews in source_reviews.py currently uses its own internal filter,
        # but we'll use the competitor name in the fusion prompt to guide the AI.
        reddit_raw = fetch_reddit_reviews()
        tp_raw = fetch_trustpilot_reviews()

        # Filter and format reviews for this competitor
        comp_name_low = competitor.name.lower()
        relevant_reviews = []
        for r in reddit_raw + tp_raw:
            if comp_name_low in r.get('competitor', '').lower() or comp_name_low in r.get('review_text', '').lower():
                relevant_reviews.append(f"[{r['source']}] {r['review_text'][:200]} (Rating: {r['rating']})")

        reviews_text = "\n".join(relevant_reviews[:10]) or "No recent reviews found."

        # 3. Ad Context (Placeholder logic for now, could be extended to real SerpAPI calls)
        ads_text = f"Observing shifted messaging towards '{competitor.name} value' in urban metro zones."

        # 4. Generate Triangulated Insight
        data = {
            "diffs": diffs_text,
            "reviews": reviews_text,
            "ads": ads_text
        }

        insight_data = self.engine.generate_triangulated_insight(competitor.name, data)

        if not insight_data:
            logger.warning("No fusion insight generated.")
            return None

        # 5. Store Insight
        new_insight = Insight(
            competitor_id=competitor_id,
            title=insight_data.get("title", f"Triangulated Intelligence: {competitor.name}"),
            description=insight_data.get("description", "Fused market signals."),
            category=insight_data.get("category", "strategy"),
            urgency=insight_data.get("urgency", 3),
            confidence=insight_data.get("confidence", 0.7),
            action=insight_data.get("action", "Monitor further")
        )

        db.session.add(new_insight)
        db.session.commit()

        logger.info(f"Successfully stored fusion insight: {new_insight.title}")
        return new_insight
