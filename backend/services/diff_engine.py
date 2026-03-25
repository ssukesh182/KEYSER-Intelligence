"""
diff_engine.py — Compares two snapshots and writes a Diff record to the DB
"""
import difflib
from services.classifier import classify_change
from services.scoring    import score_diff_significance


def compute_diff(old_text: str, new_text: str) -> dict:
    """
    Computes a unified diff between old and new text.
    Returns a dict with diff_text, added_lines, removed_lines.
    """
    print(f"[DIFF_ENGINE] Computing diff: old={len(old_text)} chars, new={len(new_text)} chars")

    old_lines = old_text.splitlines(keepends=True)
    new_lines = new_text.splitlines(keepends=True)

    diff_lines  = list(difflib.unified_diff(
        old_lines, new_lines,
        fromfile="old_snapshot",
        tofile="new_snapshot",
        lineterm=""
    ))

    diff_text    = "\n".join(diff_lines)
    added_lines  = sum(1 for l in diff_lines if l.startswith("+") and not l.startswith("+++"))
    removed_lines= sum(1 for l in diff_lines if l.startswith("-") and not l.startswith("---"))

    print(f"[DIFF_ENGINE] Result: +{added_lines} lines, -{removed_lines} lines")
    return {
        "diff_text":     diff_text,
        "added_lines":   added_lines,
        "removed_lines": removed_lines,
    }


def build_diff_summary(change_type: str, added: int, removed: int, significance: float) -> str:
    """Human readable one-liner for a diff."""
    verb = "Major" if significance >= 0.5 else "Minor"
    return (
        f"{verb} {change_type} change detected: "
        f"+{added} lines added, -{removed} lines removed "
        f"(significance: {significance:.0%})"
    )


def process_diff(old_snapshot, new_snapshot, db_session) -> "Diff | None":
    """
    Full pipeline: compare two Snapshot objects → create + save a Diff record.
    Returns the saved Diff or None if nothing changed.
    """
    from models.diff import Diff

    print(f"[DIFF_ENGINE] Processing diff: snapshot {old_snapshot.id} → {new_snapshot.id}")

    old_text = old_snapshot.clean_text or ""
    new_text = new_snapshot.clean_text or ""

    if old_text == new_text:
        print(f"[DIFF_ENGINE] No changes detected between snapshots {old_snapshot.id} and {new_snapshot.id}")
        return None

    result       = compute_diff(old_text, new_text)
    change_type  = classify_change(result["diff_text"])
    significance = score_diff_significance(
        old_text, new_text,
        result["added_lines"], result["removed_lines"]
    )
    summary = build_diff_summary(
        change_type, result["added_lines"], result["removed_lines"], significance
    )

    diff = Diff(
        source_id       = new_snapshot.source_id,
        old_snapshot_id = old_snapshot.id,
        new_snapshot_id = new_snapshot.id,
        change_type     = change_type,
        significance    = significance,
        diff_text       = result["diff_text"],
        added_lines     = result["added_lines"],
        removed_lines   = result["removed_lines"],
        summary         = summary,
    )

    try:
        db_session.add(diff)
        db_session.commit()
        db_session.refresh(diff)
        print(f"[DIFF_ENGINE] Diff saved: id={diff.id}, type={change_type}, sig={significance:.2f}")
        return diff
    except Exception as e:
        db_session.rollback()
        print(f"[DIFF_ENGINE] ERROR saving diff: {e}")
        return None
