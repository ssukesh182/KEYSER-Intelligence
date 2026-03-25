def build_diffs_context(diffs: list) -> str:
    """
    Builds a text context string from a list of diff objects.
    """
    context_lines = []
    for i, diff in enumerate(diffs, 1):
        # Handle dict or object
        if isinstance(diff, dict):
            change_type = diff.get("change_type", diff.get("diff_type", "unknown"))
            summary = diff.get("summary", "")
            diff_text = diff.get("diff_text", "")
            # attempt to fetch url
            url = diff.get("url", diff.get("source_url", "unknown"))
        else:
            change_type = getattr(diff, "change_type", "unknown")
            summary = getattr(diff, "summary", "")
            diff_text = getattr(diff, "diff_text", "")
            url = getattr(diff.source, "url", "unknown") if hasattr(diff, "source") and diff.source else "unknown"
        
        context_lines.append(f"Diff #{i}:")
        context_lines.append(f"- URL: {url}")
        context_lines.append(f"- Change Type: {change_type}")
        context_lines.append(f"- Summary: {summary}")
        context_lines.append(f"- Diff Details:\n{diff_text}")
        context_lines.append("")
        
    return "\n".join(context_lines)
