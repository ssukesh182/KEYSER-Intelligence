# KEYSER Intelligence

**KEYSER Intelligence** is an execution-grade, AI-powered competitive intelligence platform that transforms raw, omnichannel market signals into actionable boardroom insights automatically. By synthesizing fragmented data points—from public web changes and ad spend to subtle shifts in opponent hiring pipelines—KEYSER reveals the strategic “whitespace” missing in existing competitor analysis tools.

## Key Features

1. **Sovereign Intelligence Architecture (Whitespaces)**
   - The platform acts as a neural layer over existing market data. It uses LLMs to dynamically construct conceptual keyword taxonomies mapping specific opponent strengths against structural gaps (or "whitespace angles"). It cross-checks these findings with LLM-orchestrated web searches via Tavily for independent market validation.
2. **Omnichannel Signal Monitoring**
   - **Onboarding Flow:** By simply providing a company URL and naming competitors during onboarding, KEYSER discovers all essential tracking endpoints.
   - **Google Ads Intelligence:** Monitors opponent campaign angles and identifies targeted keyword overlap leveraging SERP API.
   - **Reddit / Social Pulse:** Fetches and streams unstructured opponent pain points from Reddit to identify what customers actively complain about.
   - **Hiring Intent Tracking:** Intercepts live job postings and isolates "departmental surges" (e.g., mass AI engineering hires signaling a new AI initiative).
3. **AI Copilot Streaming Interface**
   - Implements a fully dynamic AI-copilot chat widget capable of streaming Markdown responses, simulating near real-time engagement to answer strategic queries on-the-fly.
4. **Multi-Tenant System Isolation**
   - Implemented dynamic multitenancy in both data schemas and analytical pipelines using SQLAlchemy and Flask. Every insight, competitor, and API scan isolates cleanly by `user_id`, allowing a true SaaS multi-user scaling without leaked data borders.

## Tech Stack

### Frontend
- **React 18 + Vite**: High-performance functional component architecture.
- **TailwindCSS**: Utilitarian styling augmented with custom design tokens simulating a hyper-modern "Intelligence Dashboard" aesthetic.
- **Frontend Architecture**: Structured explicitly with custom Hooks, context-providers (e.g., AuthContext), and specialized layout wrappers (e.g., DashLayout).

### Backend
- **Flask (Python)**: Provides ultra-lightweight REST API scaffolding routing frontend API queries efficiently.
- **SQLAlchemy + SQLite**: Robust relational mapped database tracking Entities (Users, Competitors, Hiring signals, Reviews, Snapshots).
- **Celery + Redis**: Enterprise-grade background message brokering. When a user tracks a competitor, background tasks asynchronously fire off expensive external API fetches without blocking the UI.

### External AI / APIs
- **Google OAuth / Firebase**: Stubbed integration layer for zero-friction user authorization.
- **Tavily API**: Used for secondary verification of LLM-generated market theories.
- **Reddit API Wrapper**: Rapid sentiment extraction.
- **Gemma / Generative Models**: Local/Endpointed LLM abstractions for orchestrating Chat and Whitespace gap computations.

## Technical Logic

The central innovation of the platform is the **Whitespace Pipeline Engine**. 
1. When navigating to the Whitespace Radar, user-specific external snapshots are passed to a `Scoring Engine` backend module.
2. An autonomous LLM dynamically structures an N-dimensional keyword taxonomy based entirely on the live competitor data rather than static defaults (for example: identifying 'Delivery Speed', 'Supply Chain', 'Customer Support').
3. Competitor sentiments, hiring bursts, and ad keywords are mathematically reduced through an inverse distance system to single vectors inside this radar graph.
4. The system subtracts all competitor average investments from the ideal "maximum capacity," defining the true open market *Whitespace* value which a company can adopt immediately. The frontend dynamically renders this un-mapped SVG structure intuitively on a Spider/Radar layout.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (3.12+)
- Access to a local or hosted Redis instance
- `SERPAPI_KEY` and `TAVILY_API_KEY` (for live external intelligence tasks)

### Backend Initialization
1. Navigate to `/backend`.
2. Start the virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
3. Set your environment keys inside `backend/.env`.
4. Run the API Server:
   ```bash
   PYTHONPATH=. python app.py
   ```
5. In a separate terminal, start the background celery work processor handling async API scrapes:
   ```bash
   redis-server # (Or daemonize your instance)
   PYTHONPATH=. celery -A workers.celery_worker.celery worker --loglevel=info
   ```

### Frontend Initialization
1. Navigate to `/frontend`.
2. Install frontend dependencies and boot Vite:
   ```bash
   npm install
   npm run dev
   ```
3. Head to the local development environment port printed out (typically `http://localhost:5173`) to view the application.
