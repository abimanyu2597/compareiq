# ◈ CompareIQ AI

**Compare anything. Decide faster.**

> A production-grade, real-time multimodal decision intelligence platform.
> Compare products, countries, companies, documents, and proposals using multi-agent AI
> with full evidence grounding, weighted scoring, and explainable recommendations.

---

**Created by Raja Abimanyu N**
*Data Scientist | AI & Applied Machine Learning*

---

## 🚀 What is CompareIQ AI?

CompareIQ AI is not a chatbot. It is a **decision intelligence platform** that:

- Accepts **multimodal inputs** — text, PDF, URL, image, audio
- Deploys a **11-node LangGraph agent pipeline** to extract, normalize, score, and recommend
- Streams **live pipeline progress** to the UI via Server-Sent Events
- Produces **evidence-grounded, contradiction-detected, persona-aware** recommendations
- Exports results as **PDF reports, Markdown, and executive summaries**
- Optionally **monitors** saved comparisons for price, content, or policy changes

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js 15)                    │
│  Landing → Auth → Dashboard → Compare → Results → Monitor   │
│  Framer Motion · Tailwind CSS · SSE streaming · Recharts     │
└───────────────────────────┬─────────────────────────────────┘
                            │ REST + SSE
┌───────────────────────────▼─────────────────────────────────┐
│                   BACKEND (FastAPI)                          │
│  /compare  /ingest  /chat  /monitoring  /export  /auth      │
└─┬──────────┬──────────────┬──────────────┬──────────────────┘
  │          │              │              │
  ▼          ▼              ▼              ▼
Postgres   Redis          Qdrant         LangGraph
(storage) (pub/sub,      (vector        (11-agent
          caching)        evidence)      pipeline)
                                           │
                          ┌────────────────┴─────────────────┐
                          │   GROQ (speed)  │  OPENAI (depth) │
                          │ extraction      │ reasoning        │
                          │ summarization   │ contradiction     │
                          │ JSON structuring│ recommendation    │
                          │ normalization   │ report writing    │
                          └─────────────────────────────────--┘
```

## 🤖 LangGraph Agent Pipeline

```
Intent Agent
    ↓  (understands goal, infers criteria, selects persona lens)
Ingestion Agent
    ↓  (parses text, PDF, URL, image, audio)
Extraction Agent (Groq)
    ↓  (converts raw sources → structured JSON facts)
Normalization Agent (Groq)
    ↓  (standardizes units, currencies, dates, terminology)
Evidence Agent
    ↓  (retrieves supporting snippets from Qdrant)
Comparison Agent (Groq)
    ↓  (builds side-by-side matrix, similarities, differences)
Contradiction Agent (OpenAI)
    ↓  (detects conflicting claims across all sources)
Scoring Agent (Groq)
    ↓  (criterion-level scores + weighted total)
Recommendation Agent (OpenAI)
    ↓  (final verdict tailored to persona + decision mode)
Report Agent
    ↓  (structured JSON report for UI + export)
```

## 📁 Project Structure

```
compareiq-ai/
├── frontend/                    # Next.js 15 app
│   ├── app/
│   │   ├── page.tsx             # Landing page
│   │   ├── layout.tsx           # Root layout
│   │   ├── globals.css          # Design tokens
│   │   ├── auth/page.tsx        # Sign in / Register
│   │   ├── dashboard/page.tsx   # Main dashboard
│   │   ├── compare/page.tsx     # Comparison workspace
│   │   ├── comparison/[id]/     # Results detail page
│   │   └── monitoring/          # Live monitoring center
│   ├── components/
│   │   ├── ui/                  # Primitives
│   │   ├── layout/              # Sidebar, Nav, Footer
│   │   ├── comparison/          # Workspace components
│   │   ├── dashboard/           # Dashboard widgets
│   │   ├── landing/             # Marketing components
│   │   └── charts/              # Recharts wrappers
│   ├── lib/
│   │   ├── api/client.ts        # Typed API client
│   │   ├── utils/               # Helpers
│   │   └── constants/           # Config constants
│   ├── hooks/                   # Custom React hooks
│   ├── store/                   # Zustand state
│   ├── types/                   # TypeScript types
│   ├── package.json
│   ├── next.config.ts
│   └── Dockerfile
│
├── backend/                     # FastAPI app
│   ├── main.py                  # App entry point
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── core/
│   │   ├── config.py            # Pydantic settings
│   │   ├── database.py          # SQLAlchemy + asyncpg
│   │   └── redis_client.py      # Redis singleton
│   ├── schemas/
│   │   └── models.py            # All Pydantic schemas
│   ├── models/
│   │   └── db_models.py         # SQLAlchemy ORM models
│   ├── routers/
│   │   ├── compare.py           # POST /compare, SSE status
│   │   ├── ingest.py            # PDF/URL/audio/image upload
│   │   ├── chat.py              # POST /chat/followup
│   │   ├── monitoring.py        # Live monitoring endpoints
│   │   ├── export.py            # PDF/Markdown/Executive export
│   │   └── auth.py              # JWT auth
│   ├── agents/
│   │   ├── graph/
│   │   │   └── comparison_graph.py  # LangGraph state machine
│   │   └── nodes/
│   │       └── __init__.py          # All 11 agent nodes
│   ├── services/
│   │   ├── llm/                 # LLM client wrappers
│   │   ├── parsing/
│   │   │   ├── pdf_parser.py    # PyMuPDF
│   │   │   ├── url_parser.py    # httpx + BeautifulSoup
│   │   │   ├── audio_parser.py  # OpenAI Whisper
│   │   │   └── image_parser.py  # GPT-4o Vision
│   │   └── vector/
│   │       └── qdrant_store.py  # Evidence retrieval
│   └── workers/                 # Celery background tasks
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- Python 3.11+
- Node.js 20+ (for frontend)
- Git

No Docker, no Postgres, no Redis required to get the backend running locally.

---

### Backend — runs in under 2 minutes

```bash
cd compareiq-ai/backend

# 1. Create virtual environment
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
# The .env file is already included with safe defaults.
# Open it and add your API keys:
#   GROQ_API_KEY=gsk_...       ← free at console.groq.com
#   OPENAI_API_KEY=sk-...      ← platform.openai.com/api-keys

# 4. Start the server
uvicorn main:app --reload --port 8000

# → API docs: http://localhost:8000/api/docs
# → Health:   http://localhost:8000/api/health
```

**The server starts with SQLite by default** — no database setup needed.

---

### Frontend

```bash
cd compareiq-ai/frontend

npm install
cp ../.env.example .env.local
# Make sure NEXT_PUBLIC_API_URL=http://localhost:8000

npm run dev
# → http://localhost:3000
```

---

### Optional services (for full feature set)

```bash
# Redis — enables real-time SSE pipeline streaming
docker run -d -p 6379:6379 redis:7-alpine

# Qdrant — enables vector evidence retrieval
docker run -d -p 6333:6333 qdrant/qdrant

# Postgres — for production (replace DATABASE_URL in .env)
docker run -d -p 5432:5432 \
  -e POSTGRES_DB=compareiq_db \
  -e POSTGRES_USER=compareiq \
  -e POSTGRES_PASSWORD=compareiq_pass \
  postgres:16-alpine
```

---

### Docker Compose (full stack)

```bash
cp .env.example .env
# Add OPENAI_API_KEY and GROQ_API_KEY to .env
docker compose up --build
# → http://localhost:3000
```

---

### Troubleshooting

| Error | Fix |
|-------|-----|
| `blake2b was not found` | Harmless warning from pyenv OpenSSL — server still runs fine |
| `Redis unavailable` | Start Redis or ignore — SSE disabled but everything else works |
| `GROQ_API_KEY missing` | Add key to `backend/.env` — comparisons won't run without it |
| `bcrypt` version error | Run `pip install bcrypt==4.0.1` |
| `ModuleNotFoundError` | Run `pip install -r requirements.txt` inside your venv |



---

## 🔌 API Reference

### Core Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/compare/` | Start comparison job |
| `GET` | `/api/compare/{id}` | Get job status |
| `GET` | `/api/compare/{id}/status` | **SSE** — live pipeline events |
| `GET` | `/api/compare/` | List all comparisons |
| `POST` | `/api/ingest/pdf` | Upload + parse PDF |
| `POST` | `/api/ingest/url` | Fetch + extract URL |
| `POST` | `/api/ingest/audio` | Upload + transcribe audio |
| `POST` | `/api/ingest/image` | Upload + describe image (GPT-4o) |
| `POST` | `/api/chat/followup` | Ask follow-up question |
| `POST` | `/api/monitoring/{id}/enable` | Enable live monitoring |
| `GET` | `/api/monitoring/{id}` | Get monitoring status |
| `GET` | `/api/export/{id}/pdf` | Download PDF report |
| `GET` | `/api/export/{id}/markdown` | Markdown export |
| `GET` | `/api/export/{id}/executive` | One-paragraph summary |
| `POST` | `/api/auth/register` | Register user |
| `POST` | `/api/auth/login` | Login (OAuth2 form) |
| `GET` | `/api/auth/me` | Current user |

### Sample Request: Start Comparison

```json
POST /api/compare/
{
  "intent": "I want to buy a laptop for ML development under ₹1.5 lakh",
  "entities": [
    { "id": "e1", "label": "MacBook Pro M4", "input_type": "url", "content": "https://apple.com/macbook-pro" },
    { "id": "e2", "label": "Dell XPS 15", "input_type": "url", "content": "https://dell.com/xps-15" }
  ],
  "criteria": [
    { "name": "Performance", "weight": 40 },
    { "name": "Price", "weight": 35 },
    { "name": "Build Quality", "weight": 25 }
  ],
  "persona": "developer",
  "decision_mode": "buy"
}
```

### SSE Event Format

```json
{ "event": "step_start", "step": "Extracting structured facts", "timestamp": "2025-03-01T10:00:00Z" }
{ "event": "step_done",  "step": "Extracting structured facts", "data": { "result_preview": "..." } }
{ "event": "comparison_done", "data": { "job_id": "..." } }
```

---

## 🗄️ Database Schema

```sql
-- Users
users(id, email, name, hashed_password, created_at, is_active)

-- Comparisons
comparisons(id, user_id, intent, persona, decision_mode, status, progress,
            request_payload, result_payload, trust_metrics,
            monitoring_enabled, last_checked_at, change_count,
            created_at, updated_at)

-- Entities per comparison
comparison_entities(id, comparison_id, label, input_type, content_ref,
                    structured_facts, normalized_facts, final_score, rank, is_winner)

-- Pipeline audit trail
pipeline_events(id, comparison_id, event_type, step_name, detail, data, created_at)

-- Monitoring alerts
monitor_alerts(id, comparison_id, alert_type, summary, delta_data, is_read, created_at)
```

---

## 🧭 Supported Use Cases

| Domain | Example |
|--------|---------|
| Product | MacBook Pro M4 vs Dell XPS 15 |
| Country | Canada vs Germany for Data Scientists |
| Company | Anthropic vs OpenAI — as an employer |
| Document | Contract A vs Contract B |
| Vendor | AWS vs Azure — cost + performance |
| Resume | Resume vs Job Description fit analysis |
| Policy | Privacy policy v1 vs v2 delta |
| Cross-modal | Audio pitch vs investor PDF deck |

---

## 🎭 Personas

- Student · Investor · Developer · Traveler · Family · Business Owner · Procurement Manager

## 🎯 Decision Modes

- Buy · Migrate · Apply · Shortlist · Validate Claim · Choose Vendor · Negotiate

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Framer Motion |
| UI Components | shadcn/ui, Radix UI, Lucide Icons, Recharts |
| Backend | FastAPI, Python 3.11, Uvicorn |
| AI Orchestration | LangGraph, LangChain |
| Fast LLM | Groq (llama3-70b) — extraction, scoring, normalization |
| Deep LLM | OpenAI GPT-4o — reasoning, contradictions, recommendations |
| Vision | OpenAI GPT-4o Vision |
| Audio | OpenAI Whisper |
| Vector Store | Qdrant |
| Database | PostgreSQL + SQLAlchemy |
| Caching / PubSub | Redis |
| PDF Parsing | PyMuPDF |
| URL Parsing | httpx + BeautifulSoup |
| PDF Export | ReportLab |
| Streaming | Server-Sent Events (SSE) |
| Background Jobs | Celery + Redis broker |
| Containers | Docker + Docker Compose |

---

## 📈 Production Considerations

- Add **Alembic migrations** for schema management
- Replace in-memory `_jobs` dict with **PostgreSQL-backed job table**
- Add **LangGraph checkpointing** (MemorySaver or Postgres persister) for resumable pipelines
- Integrate **Celery** for heavy async jobs (large PDFs, audio transcription)
- Add **rate limiting** (slowapi) per user/endpoint
- Add **Sentry** for error tracking
- Add **Prometheus + Grafana** for metrics
- Use **Nginx** with SSL termination in production

---

## 🤝 Contributing

PRs welcome. Please open an issue first to discuss what you'd like to change.

---

## 📄 License

MIT © Raja Abimanyu N

---

*CompareIQ AI — Compare anything. Decide faster.*
*Created by Raja Abimanyu N | Data Scientist | AI & Applied Machine Learning*
