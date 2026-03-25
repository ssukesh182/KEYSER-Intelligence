"""
services/schemas/diff_schema.py — Pydantic schema for Diff records.
"""
from pydantic import BaseModel


class DiffSchema(BaseModel):
    id:              int
    source_id:       int
    old_snapshot_id: int
    new_snapshot_id: int
    change_type:     str
    significance:    float
    diff_text:       str
    summary:         str
