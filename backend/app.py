"""
app.py — Flask application factory
Registers all blueprints, initialises extensions, creates DB tables.
"""
import sys
import os

# Ensure backend/ is on the path so local imports work
sys.path.insert(0, os.path.dirname(__file__))

from flask import Flask, jsonify, send_from_directory
from config     import DATABASE_URL, FLASK_PORT, FLASK_DEBUG
from extensions import db, cors

import models  # noqa — import all models so SQLAlchemy can see them


def create_app():
    print("[APP] Creating Flask application")
    app = Flask(__name__)

    # ── Config ────────────────────────────────────────────────
    app.config["SQLALCHEMY_DATABASE_URI"]        = DATABASE_URL
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SQLALCHEMY_ENGINE_OPTIONS"]      = {
        "pool_pre_ping": True,   # auto-reconnect on stale connections
        "pool_recycle":  300,
    }

    # ── Extensions ────────────────────────────────────────────
    db.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})
    print("[APP] Extensions initialised (db, cors)")

    # ── Blueprints ────────────────────────────────────────────
    print("[APP] Registering blueprints...")
    from routes.competitors import bp as competitors_bp
    from routes.snapshots   import bp as snapshots_bp
    from routes.diffs       import bp as diffs_bp
    from routes.insights    import bp as insights_bp
    from routes.health      import bp as health_bp
    from routes.demo        import bp as demo_bp
    from routes.brief       import bp as brief_bp
    from routes.whitespace  import bp as whitespace_bp
    from routes.copilot     import bp as copilot_bp
    from routes.source_reviews import bp as source_reviews_bp

    app.register_blueprint(competitors_bp)
    app.register_blueprint(snapshots_bp)
    app.register_blueprint(diffs_bp)
    app.register_blueprint(insights_bp)
    app.register_blueprint(health_bp)
    app.register_blueprint(demo_bp)
    app.register_blueprint(brief_bp)
    app.register_blueprint(whitespace_bp)
    app.register_blueprint(copilot_bp)
    app.register_blueprint(source_reviews_bp)

    # Initialize APScheduler (runs exactly once)
    if not app.debug or os.environ.get("WERKZEUG_RUN_MAIN") == "true":
        init_scheduler(app)
    print("[APP] All 10 blueprints registered")

    # ── Create DB tables ──────────────────────────────────────
    with app.app_context():
        try:
            db.create_all()
            print("[APP] DB tables created / verified OK")
        except Exception as e:
            print(f"[APP] ERROR creating DB tables: {e}")

    # ── Root route ────────────────────────────────────────────
    @app.route("/")
    def index():
        return jsonify({
            "name":    "KEYSER Intelligence Engine",
            "version": "1.0.0",
            "routes":  [
                "/api/competitors",
                "/api/snapshots",
                "/api/diffs",
                "/api/insights",
                "/api/health",
                "/api/demo/reset",
                "/api/demo/trigger_osint",
            ]
        })

    @app.route("/copilot")
    def copilot_ui():
        return send_from_directory(
            os.path.join(os.path.dirname(__file__), "static"),
            "copilot.html"
        )


    # ── Global error handlers ─────────────────────────────────
    @app.errorhandler(404)
    def not_found(e):
        print(f"[APP] 404: {e}")
        return jsonify({"success": False, "error": "Route not found"}), 404

    @app.errorhandler(500)
    def internal_error(e):
        print(f"[APP] 500: {e}")
        return jsonify({"success": False, "error": "Internal server error"}), 500

    print("[APP] Flask app ready")
    return app


def init_scheduler(app):
    """Initialize APScheduler with Flask app context."""
    from scheduler.scheduler import scheduler
    try:
        from scheduler.intelligence_scheduler import register_jobs
        
        # Only start if enabled in config
        if not app.config.get("SCHEDULER_ENABLED", True):
            print("[APP] Scheduler disabled via config")
            return

        # Add jobs to the scheduler
        register_jobs(scheduler, app)
        
        # Start the scheduler thread
        if not scheduler.running:
            scheduler.start()
            print("[APP] APScheduler started successfully")
    except ImportError:
        pass


if __name__ == "__main__":
    app = create_app()
    print(f"[APP] Starting Flask on port {FLASK_PORT} (debug={FLASK_DEBUG})")
    app.run(host="0.0.0.0", port=FLASK_PORT, debug=FLASK_DEBUG, use_reloader=False)
