"""
CompareIQ AI — Sample Data & Example Requests
Use these for API testing, development seeding, and demos.
"""

# ─── Example 1: Product Comparison ────────────────────────────────────────────
PRODUCT_COMPARISON = {
    "intent": "I want to buy a laptop for machine learning and data science work under ₹1.5 lakh. I need good battery life and portability.",
    "entities": [
        {
            "id": "e1",
            "label": "MacBook Pro M4 14-inch",
            "input_type": "url",
            "content": "https://www.apple.com/shop/buy-mac/macbook-pro/14-inch"
        },
        {
            "id": "e2",
            "label": "Dell XPS 15 (2024)",
            "input_type": "url",
            "content": "https://www.dell.com/en-us/shop/laptops/xps-15-laptop/spd/xps-15-9530-laptop"
        }
    ],
    "criteria": [
        {"name": "ML Performance", "weight": 35},
        {"name": "Battery Life", "weight": 25},
        {"name": "Price Value", "weight": 20},
        {"name": "Build Quality", "weight": 10},
        {"name": "Portability", "weight": 10}
    ],
    "persona": "developer",
    "decision_mode": "buy",
    "enable_monitoring": True
}

# ─── Example 2: Country Comparison ────────────────────────────────────────────
COUNTRY_COMPARISON = {
    "intent": "I am a senior data scientist in India considering relocating for better career opportunities and salary. Compare Germany and Canada.",
    "entities": [
        {
            "id": "c1",
            "label": "Germany",
            "input_type": "text",
            "content": "Germany. EU Blue Card visa. Average data scientist salary: €65,000–€90,000/year. Strong tech sector in Berlin, Munich, Hamburg. Healthcare: public system included with employment. Tax rate: ~40% effective for this salary band. Cost of living: moderate in Berlin, high in Munich. Work-life balance: strong labor protections, 30 days leave typical."
        },
        {
            "id": "c2",
            "label": "Canada",
            "input_type": "text",
            "content": "Canada. Express Entry + Global Talent Stream. Average data scientist salary: CAD 90,000–130,000/year. Strong tech hubs in Toronto, Vancouver, Waterloo. Healthcare: public provincial system. Tax rate: ~30–33% effective. Cost of living: high in Vancouver/Toronto, moderate in Waterloo. PR pathway: typically 12–24 months."
        }
    ],
    "criteria": [
        {"name": "Salary & Compensation", "weight": 30},
        {"name": "Visa & PR Ease", "weight": 25},
        {"name": "Cost of Living", "weight": 20},
        {"name": "Career Opportunities", "weight": 15},
        {"name": "Quality of Life", "weight": 10}
    ],
    "persona": "developer",
    "decision_mode": "migrate"
}

# ─── Example 3: Vendor API Comparison ─────────────────────────────────────────
VENDOR_COMPARISON = {
    "intent": "I need to choose between OpenAI and Groq APIs for building a production AI app that needs fast inference and JSON output.",
    "entities": [
        {
            "id": "v1",
            "label": "OpenAI API (GPT-4o)",
            "input_type": "text",
            "content": "OpenAI GPT-4o API. Pricing: $2.50/1M input tokens, $10/1M output tokens. Context: 128k. Vision: yes. JSON mode: yes. Average latency: 2–5s for standard requests. Rate limits: 500 RPM (tier 1). Function calling: yes. Fine-tuning: yes. Embeddings: text-embedding-3-small at $0.02/1M tokens."
        },
        {
            "id": "v2",
            "label": "Groq API (Llama3-70b)",
            "input_type": "text",
            "content": "Groq Cloud API. Pricing: $0.59/1M input tokens, $0.79/1M output tokens (Llama3-70b). Context: 8k. Vision: no. JSON mode: yes. Average latency: 100–400ms (industry-leading speed). Rate limits: 30 RPM free, higher on paid. Function calling: yes. Fine-tuning: no. Embeddings: not native."
        }
    ],
    "criteria": [
        {"name": "Inference Speed", "weight": 35},
        {"name": "Cost per Token", "weight": 30},
        {"name": "Capabilities", "weight": 20},
        {"name": "Reliability", "weight": 15}
    ],
    "persona": "developer",
    "decision_mode": "choose_vendor"
}

# ─── Example 4: Document Comparison ──────────────────────────────────────────
DOCUMENT_COMPARISON = {
    "intent": "Compare these two employment contracts to decide which offer to accept. I care about compensation, flexibility, and intellectual property terms.",
    "entities": [
        {
            "id": "d1",
            "label": "Offer A — Startup",
            "input_type": "text",
            "content": "Employment Contract A. Base salary: $120,000. Stock options: 0.5% vesting over 4 years with 1-year cliff. Remote work: fully remote. IP clause: company owns work done during employment, including side projects in same domain. Non-compete: 12 months within industry. Health insurance: 80% covered. Annual leave: 20 days. Performance bonus: up to 10%."
        },
        {
            "id": "d2",
            "label": "Offer B — Enterprise",
            "input_type": "text",
            "content": "Employment Contract B. Base salary: $145,000. Stock RSUs: $30,000/year vesting quarterly over 4 years. Remote work: hybrid 3 days/week in office. IP clause: company owns work during work hours; personal projects outside work are excluded. Non-compete: 6 months, limited to direct competitors. Health insurance: 100% covered. Annual leave: 25 days. Performance bonus: up to 15%."
        }
    ],
    "criteria": [
        {"name": "Total Compensation", "weight": 35},
        {"name": "Equity Value", "weight": 25},
        {"name": "Work Flexibility", "weight": 20},
        {"name": "IP & Legal Terms", "weight": 20}
    ],
    "persona": "developer",
    "decision_mode": "apply"
}

# ─── All samples ──────────────────────────────────────────────────────────────
ALL_SAMPLES = {
    "product": PRODUCT_COMPARISON,
    "country": COUNTRY_COMPARISON,
    "vendor": VENDOR_COMPARISON,
    "document": DOCUMENT_COMPARISON,
}
