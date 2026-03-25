"""
insight_engine.py — Rule-based insight generation from diffs
Produces Insight + InsightSource records.
"""
from services.scoring import score_insight


# ─── Template library ─────────────────────────────────────────────────────────
INSIGHT_TEMPLATES = {
    "pricing": {
        "title":       "{name} updated pricing signals",
        "description": (
            "{name} has modified pricing-related content on {label}. "
            "This may indicate a new plan tier, restructured pricing, or promotional pricing. "
            "Worth monitoring closely for competitive repositioning."
        ),
        "action": "Compare current and previous pricing. Test a similar pricing angle or counter-offer.",
    },
    "offer": {
        "title":       "{name} launched a new promotional offer",
        "description": (
            "{name} added offer/deal content on {label}. "
            "Promotional activity (discounts, free delivery, cashback) has increased. "
            "Possible campaign in response to churn or seasonal demand."
        ),
        "action": "Monitor offer expiry. Consider a counter-offer or value-add campaign.",
    },
    "messaging": {
        "title":       "{name} shifted brand messaging",
        "description": (
            "{name} updated messaging on {label}. "
            "Key positioning claims may have changed: speed, trust, freshness, or reliability. "
            "This can signal a repositioning effort or response to customer feedback."
        ),
        "action": "Audit your own messaging. Identify overused angles and whitespace opportunities.",
    },
    "cta": {
        "title":       "{name} changed their call-to-action",
        "description": (
            "{name} modified acquisition messaging on {label}. "
            "App download prompts, sign-up text, or onboarding copy has changed. "
            "May indicate A/B testing or a funnel optimization push."
        ),
        "action": "Test a competing CTA variant. Track if conversion language is shifting industry-wide.",
    },
    "general": {
        "title":       "{name} made website content changes",
        "description": (
            "{name} updated content on {label}. "
            "Changes don't match a specific category but may indicate layout, copy, "
            "or structural updates worth periodic review."
        ),
        "action": "Review source page manually. Determine if change warrants deeper analysis.",
    },
}


def generate_insights_from_diff(diff, source, competitor, db_session) -> list:
    """
    Given a Diff + related objects, creates Insight + InsightSource records.
    Returns list of created Insight objects.
    """
    from models.insight        import Insight
    from models.insight_source import InsightSource

    print(f"[INSIGHT_ENGINE] Generating insight for diff_id={diff.id}, "
          f"competitor={competitor.name}, change_type={diff.change_type}")

    created = []

    try:
        template = INSIGHT_TEMPLATES.get(diff.change_type, INSIGHT_TEMPLATES["general"])
        label    = source.label or source.url

        # Format template with real data
        title       = template["title"].format(name=competitor.name, label=label)
        description = template["description"].format(name=competitor.name, label=label)
        action      = template["action"]

        # Score it
        scores = score_insight(
            category    = diff.change_type,
            frequency   = 1,
            significance= diff.significance,
        )

        insight = Insight(
            competitor_id = competitor.id,
            title         = title,
            description   = description,
            category      = diff.change_type,
            action        = action,
            confidence    = scores["confidence"],
            novelty       = scores["novelty"],
            relevance     = scores["relevance"],
            frequency     = 1,
        )
        db_session.add(insight)
        db_session.flush()   # get insight.id before commit

        # Traceability link
        insight_src = InsightSource(
            insight_id = insight.id,
            diff_id    = diff.id,
            reasoning  = (
                f"Diff {diff.id} detected a '{diff.change_type}' change with "
                f"{diff.significance:.0%} significance on {label}. "
                f"Rule-based template applied."
            ),
        )
        db_session.add(insight_src)
        db_session.commit()
        print(f"[INSIGHT_ENGINE] Insight created: id={insight.id}, title='{title}'")
        created.append(insight)

    except Exception as e:
        db_session.rollback()
        print(f"[INSIGHT_ENGINE] ERROR generating insight: {e}")

    return created
