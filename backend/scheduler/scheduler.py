"""
scheduler/scheduler.py
APScheduler setup — starts the background cron jobs alongside Flask.
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger

scheduler = BackgroundScheduler(timezone="Asia/Kolkata")

print("[SCHEDULER] BackgroundScheduler instance created")
