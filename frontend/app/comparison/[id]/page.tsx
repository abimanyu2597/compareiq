"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type Tab = "summary" | "evidence" | "scoring" | "contradictions" | "recommendation";

const MOCK_ENTITIES = [
  { id: "e1", label: "MacBook Pro M4", score: 92, rank: 1, isWinner: true },
  { id: "e2", label: "Dell XPS 15", score: 78, rank: 2, isWinner: false },
];

const MOCK_CRITERIA = [
  { name: "Performance", scores: [92, 74] },
  { name: "Price", scores: [65, 88] },
  { name: "Build Quality", scores: [95, 80] },
  { name: "Battery Life", scores: [88, 62] },
  { name: "Software", scores: [90, 72] },
  { name: "Support", scores: [85, 78] },
];

const MOCK_EVIDENCE = [
  { text: "Apple M4 chip delivers up to 38% faster performance than previous generation in ML workloads.", source: "apple.com", type: "url", confidence: 0.92 },
  { text: "MacBook Pro battery life rated at 24 hours for video playback under standard conditions.", source: "apple.com", type: "url", confidence: 0.95 },
  { text: "Dell XPS 15 starts at $1,299 with Intel Core Ultra 7 processor and OLED display option.", source: "dell.com", type: "url", confidence: 0.88 },
];

const MOCK_CONTRADICTIONS = [
  { id: "c1", claim_a: "MacBook Pro M4 has 24-hour battery", claim_b: "Review states average 16-hour real-world usage", source_a: "apple.com", source_b: "Uploaded PDF review", severity: "medium" },
];

export default function ComparisonDetailPage({ params }: { params: { id: string } }) {
  const [tab, setTab] = useState<Tab>("summary");

  const TABS: { id: Tab; label: string }[] = [
    { id: "summary", label: "Summary" },
    { id: "scoring", label: "Scoring" },
    { id: "evidence", label: "Evidence" },
    { id: "contradictions", label: `Contradictions (${MOCK_CONTRADICTIONS.length})` },
    { id: "recommendation", label: "Recommendation" },
  ];

  return (
    <div className="detail-page">
      {/* Nav */}
      <nav className="detail-nav">
        <Link href="/dashboard" className="back-link">← Dashboard</Link>
        <div className="detail-nav-title">
          <span className="logo-mark">◈</span>
          MacBook Pro M4 vs Dell XPS 15
        </div>
        <div className="detail-nav-actions">
          <a href={`/api/export/${params.id}/pdf`} className="export-btn" target="_blank">📄 PDF</a>
          <a href={`/api/export/${params.id}/markdown`} className="export-btn" target="_blank">📝 MD</a>
        </div>
      </nav>

      {/* Winner banner */}
      <div className="winner-banner">
        <div className="winner-inner">
          <span className="winner-trophy">🏆</span>
          <div>
            <div className="winner-eyebrow">Recommended Choice · Developer Persona · Buy Mode</div>
            <div className="winner-name">MacBook Pro M4</div>
          </div>
          <div className="winner-scores">
            {MOCK_ENTITIES.map((e) => (
              <div key={e.id} className={`entity-score-chip ${e.isWinner ? "winner" : ""}`}>
                <span className="chip-label">{e.label}</span>
                <span className="chip-score">{e.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="detail-tabs">
        {TABS.map((t) => (
          <button key={t.id} className={`detail-tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="detail-body">
        <AnimatePresence mode="wait">

          {/* SUMMARY */}
          {tab === "summary" && (
            <motion.div key="summary" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="summary-card">
                <div className="summary-label">Executive Summary</div>
                <p className="summary-text">
                  Based on analysis across 6 weighted criteria using 8 evidence sources, the <strong>MacBook Pro M4</strong> is the clear recommendation for a developer persona in buy mode. It leads in performance (92 vs 74), build quality (95 vs 80), battery life (88 vs 62), and software ecosystem (90 vs 72). The Dell XPS 15 holds an advantage on price (88 vs 65) and may suit budget-constrained buyers. Two contradictions were detected — primarily around battery life claims — and are flagged for review.
                </p>
              </div>
              <div className="summary-grid">
                <div className="summary-side">
                  <div className="side-title">✅ MacBook Pro M4 Pros</div>
                  {["Best-in-class M4 performance", "Industry-leading battery life", "Unified memory architecture", "Excellent macOS ecosystem", "Premium build and display"].map((p) => (
                    <div key={p} className="pro-item">✓ {p}</div>
                  ))}
                </div>
                <div className="summary-side con">
                  <div className="side-title">⚠ MacBook Pro M4 Cons</div>
                  {["Premium price point", "Limited port selection", "No touchscreen", "Locked ecosystem"].map((c) => (
                    <div key={c} className="con-item">✗ {c}</div>
                  ))}
                </div>
              </div>
              <div className="trust-row">
                {[
                  { label: "Confidence", val: "87%", color: "var(--green)" },
                  { label: "Completeness", val: "74%", color: "var(--indigo)" },
                  { label: "Freshness", val: "91%", color: "var(--cyan)" },
                  { label: "Contradictions", val: "2", color: "var(--amber)" },
                  { label: "Sources", val: "8", color: "var(--violet)" },
                ].map((m) => (
                  <div key={m.label} className="trust-chip">
                    <span className="trust-val" style={{ color: m.color }}>{m.val}</span>
                    <span className="trust-label">{m.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* SCORING */}
          {tab === "scoring" && (
            <motion.div key="scoring" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="scoring-table">
                <div className="scoring-header">
                  <span>Criterion</span>
                  {MOCK_ENTITIES.map((e) => <span key={e.id}>{e.label}</span>)}
                  <span>Advantage</span>
                </div>
                {MOCK_CRITERIA.map((c) => {
                  const winner = c.scores[0] > c.scores[1] ? MOCK_ENTITIES[0].label : MOCK_ENTITIES[1].label;
                  return (
                    <div key={c.name} className="scoring-row">
                      <span className="sc-name">{c.name}</span>
                      {c.scores.map((s, i) => (
                        <span key={i} className="sc-cell">
                          <span className="sc-bar-wrap">
                            <motion.span
                              className="sc-bar"
                              initial={{ width: 0 }}
                              animate={{ width: `${s}%` }}
                              transition={{ duration: 0.8, delay: 0.1 }}
                              style={{ background: s >= 85 ? "var(--green)" : s >= 70 ? "var(--indigo)" : "var(--amber)" }}
                            />
                          </span>
                          <span className="sc-num">{s}</span>
                        </span>
                      ))}
                      <span className="sc-winner">
                        <span className="winner-chip">{winner === MOCK_ENTITIES[0].label ? "A" : "B"}</span>
                      </span>
                    </div>
                  );
                })}
                <div className="scoring-total">
                  <span>TOTAL (weighted)</span>
                  {MOCK_ENTITIES.map((e) => (
                    <span key={e.id} className={`total-score ${e.isWinner ? "winner" : ""}`}>{e.score}</span>
                  ))}
                  <span className="trophy-cell">🏆 A</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* EVIDENCE */}
          {tab === "evidence" && (
            <motion.div key="evidence" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="evidence-list">
                {MOCK_EVIDENCE.map((ev, i) => (
                  <motion.div key={i} className="evidence-card" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                    <div className="evidence-header">
                      <span className={`source-badge ${ev.type}`}>{ev.type.toUpperCase()}</span>
                      <span className="source-ref">{ev.source}</span>
                      <span className="confidence-badge">
                        <span className="conf-dot" style={{ background: ev.confidence > 0.9 ? "var(--green)" : "var(--amber)" }} />
                        {Math.round(ev.confidence * 100)}% confidence
                      </span>
                    </div>
                    <p className="evidence-text">"{ev.text}"</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* CONTRADICTIONS */}
          {tab === "contradictions" && (
            <motion.div key="contradictions" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {MOCK_CONTRADICTIONS.length === 0 ? (
                <div className="no-contradictions">✅ No contradictions detected across sources.</div>
              ) : (
                <div className="contradiction-list">
                  {MOCK_CONTRADICTIONS.map((c) => (
                    <div key={c.id} className={`contradiction-card severity-${c.severity}`}>
                      <div className="cont-header">
                        <span className={`severity-badge ${c.severity}`}>
                          {c.severity === "high" ? "⛔" : c.severity === "medium" ? "⚠️" : "ℹ"} {c.severity.toUpperCase()} severity
                        </span>
                      </div>
                      <div className="cont-claims">
                        <div className="cont-claim">
                          <span className="cont-source">{c.source_a}</span>
                          <span className="cont-text">"{c.claim_a}"</span>
                        </div>
                        <div className="cont-vs">vs</div>
                        <div className="cont-claim">
                          <span className="cont-source">{c.source_b}</span>
                          <span className="cont-text">"{c.claim_b}"</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* RECOMMENDATION */}
          {tab === "recommendation" && (
            <motion.div key="recommendation" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="recommendation-block">
                <div className="rec-header">
                  <span className="rec-trophy">🏆</span>
                  <div>
                    <div className="rec-eyebrow">Final Recommendation</div>
                    <div className="rec-name">MacBook Pro M4</div>
                    <div className="rec-score">92 / 100 weighted score</div>
                  </div>
                </div>
                <p className="rec-rationale">
                  For a developer persona in buy mode, the MacBook Pro M4 is the definitive choice. The M4 chip's neural engine and unified memory architecture provide class-leading performance for ML workloads, compilation, and IDE usage — areas where developers spend most compute time. The 24-hour rated battery eliminates power anxiety during travel. While the premium price is a real consideration, the total cost of ownership advantage (longevity, resale value, lower peripheral spend) offsets the initial gap vs. the Dell XPS 15.
                </p>
                <div className="rec-when-other">
                  <div className="when-label">🔄 When to choose Dell XPS 15 instead</div>
                  <p className="when-text">If you are Windows-dependent, need a touchscreen, prefer upgradeable RAM/storage, or have a hard budget ceiling under ₹1.2L — the XPS 15 offers excellent Windows performance and more port flexibility.</p>
                </div>
                <div className="followup-suggestions">
                  <div className="fu-label">Suggested follow-up questions</div>
                  <div className="fu-chips">
                    {["Re-rank by price only", "Compare for India market", "What if battery matters 50%?", "Summarize for executives"].map((q) => (
                      <button key={q} className="fu-chip">{q}</button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <style jsx>{`
        .detail-page { min-height: 100vh; background: var(--bg); display: flex; flex-direction: column; }
        .detail-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 2rem; height: 56px; border-bottom: 1px solid var(--border);
          background: rgba(3,7,18,0.95); backdrop-filter: blur(20px);
          position: sticky; top: 0; z-index: 50;
        }
        .back-link { font-size: 0.85rem; color: var(--muted); text-decoration: none; }
        .back-link:hover { color: var(--text); }
        .detail-nav-title { font-size: 0.9rem; font-weight: 700; display: flex; align-items: center; gap: 8px; }
        .logo-mark { color: var(--indigo); }
        .detail-nav-actions { display: flex; gap: 8px; }
        .export-btn {
          padding: 6px 12px; border-radius: 7px; font-size: 0.78rem;
          background: var(--surface); border: 1px solid var(--border);
          color: var(--muted); text-decoration: none; transition: all 0.15s;
        }
        .export-btn:hover { border-color: var(--border-hover); color: var(--text); }

        .winner-banner {
          background: rgba(16,185,129,0.06);
          border-bottom: 1px solid rgba(16,185,129,0.15);
          padding: 0 2rem;
        }
        .winner-inner {
          max-width: 1100px; margin: 0 auto;
          display: flex; align-items: center; gap: 20px;
          padding: 16px 0;
        }
        .winner-trophy { font-size: 2rem; }
        .winner-eyebrow { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--green); }
        .winner-name { font-size: 1.2rem; font-weight: 800; }
        .winner-scores { display: flex; gap: 10px; margin-left: auto; }
        .entity-score-chip {
          display: flex; flex-direction: column; align-items: center; gap: 2px;
          padding: 8px 14px; border-radius: 10px;
          background: var(--surface); border: 1px solid var(--border);
        }
        .entity-score-chip.winner { border-color: rgba(16,185,129,0.4); background: rgba(16,185,129,0.08); }
        .chip-label { font-size: 0.7rem; color: var(--muted); }
        .chip-score { font-size: 1.3rem; font-weight: 800; color: var(--text); }
        .entity-score-chip.winner .chip-score { color: var(--green); }

        .detail-tabs {
          display: flex; border-bottom: 1px solid var(--border);
          padding: 0 2rem; background: rgba(9,14,30,0.5); overflow-x: auto;
        }
        .detail-tab {
          padding: 12px 18px; font-size: 0.875rem; font-weight: 500;
          color: var(--muted); background: none; border: none; cursor: pointer;
          border-bottom: 2px solid transparent; white-space: nowrap;
          transition: all 0.2s;
        }
        .detail-tab.active { color: var(--indigo); border-bottom-color: var(--indigo); }

        .detail-body { flex: 1; padding: 2rem; max-width: 1100px; margin: 0 auto; width: 100%; }

        /* SUMMARY */
        .summary-card {
          padding: 24px; border-radius: 14px; margin-bottom: 1.5rem;
          background: var(--surface); border: 1px solid var(--border);
        }
        .summary-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); margin-bottom: 10px; }
        .summary-text { font-size: 0.9rem; line-height: 1.75; color: var(--text-secondary); }
        .summary-text strong { color: var(--text); }
        .summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 1.5rem; }
        .summary-side {
          padding: 20px; border-radius: 12px;
          background: rgba(16,185,129,0.05); border: 1px solid rgba(16,185,129,0.2);
        }
        .summary-side.con { background: rgba(239,68,68,0.04); border-color: rgba(239,68,68,0.15); }
        .side-title { font-size: 0.8rem; font-weight: 700; margin-bottom: 10px; }
        .pro-item { font-size: 0.825rem; color: var(--green); padding: 3px 0; }
        .con-item { font-size: 0.825rem; color: var(--red); padding: 3px 0; }
        .trust-row { display: flex; gap: 16px; flex-wrap: wrap; }
        .trust-chip {
          display: flex; flex-direction: column; gap: 2px;
          padding: 12px 18px; border-radius: 10px;
          background: var(--surface); border: 1px solid var(--border);
        }
        .trust-val { font-size: 1.4rem; font-weight: 800; }
        .trust-label { font-size: 0.7rem; color: var(--muted); }

        /* SCORING */
        .scoring-table { border-radius: 12px; overflow: hidden; border: 1px solid var(--border); }
        .scoring-header {
          display: grid; grid-template-columns: 140px 1fr 1fr 100px;
          padding: 12px 16px; background: rgba(99,102,241,0.08);
          font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted);
        }
        .scoring-row {
          display: grid; grid-template-columns: 140px 1fr 1fr 100px;
          padding: 12px 16px; border-top: 1px solid var(--border); align-items: center;
        }
        .sc-name { font-size: 0.875rem; font-weight: 500; }
        .sc-cell { display: flex; align-items: center; gap: 10px; }
        .sc-bar-wrap { flex: 1; height: 6px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden; }
        .sc-bar { display: block; height: 100%; border-radius: 3px; }
        .sc-num { font-size: 0.8rem; font-weight: 700; width: 26px; }
        .winner-chip {
          width: 22px; height: 22px; border-radius: 6px;
          background: var(--indigo-dim); color: var(--indigo);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem; font-weight: 800;
        }
        .scoring-total {
          display: grid; grid-template-columns: 140px 1fr 1fr 100px;
          padding: 14px 16px; border-top: 2px solid var(--border);
          background: rgba(99,102,241,0.04); font-weight: 700; font-size: 0.85rem;
        }
        .total-score { font-size: 1.3rem; color: var(--text); }
        .total-score.winner { color: var(--green); }
        .trophy-cell { font-size: 0.85rem; }

        /* EVIDENCE */
        .evidence-list { display: flex; flex-direction: column; gap: 12px; }
        .evidence-card {
          padding: 16px 20px; border-radius: 12px;
          background: var(--surface); border: 1px solid var(--border);
        }
        .evidence-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .source-badge {
          font-size: 0.65rem; font-weight: 700; padding: 3px 8px; border-radius: 4px;
        }
        .source-badge.url { background: rgba(6,182,212,0.15); color: var(--cyan); }
        .source-badge.pdf { background: rgba(99,102,241,0.15); color: var(--indigo); }
        .source-ref { font-size: 0.78rem; color: var(--muted); }
        .confidence-badge { display: flex; align-items: center; gap: 5px; font-size: 0.75rem; color: var(--dim); margin-left: auto; }
        .conf-dot { width: 6px; height: 6px; border-radius: 50%; }
        .evidence-text { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6; font-style: italic; }

        /* CONTRADICTIONS */
        .no-contradictions { padding: 3rem; text-align: center; color: var(--green); font-size: 1rem; }
        .contradiction-list { display: flex; flex-direction: column; gap: 12px; }
        .contradiction-card { padding: 16px 20px; border-radius: 12px; border: 1px solid; }
        .contradiction-card.severity-medium { background: rgba(245,158,11,0.05); border-color: rgba(245,158,11,0.25); }
        .contradiction-card.severity-high { background: rgba(239,68,68,0.05); border-color: rgba(239,68,68,0.25); }
        .contradiction-card.severity-low { background: rgba(99,102,241,0.05); border-color: rgba(99,102,241,0.2); }
        .cont-header { margin-bottom: 12px; }
        .severity-badge { font-size: 0.72rem; font-weight: 700; }
        .severity-badge.medium { color: var(--amber); }
        .severity-badge.high { color: var(--red); }
        .severity-badge.low { color: var(--indigo); }
        .cont-claims { display: flex; align-items: center; gap: 14px; }
        .cont-claim { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .cont-source { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); }
        .cont-text { font-size: 0.85rem; color: var(--text); font-style: italic; }
        .cont-vs { font-size: 0.75rem; font-weight: 700; color: var(--dim); flex-shrink: 0; }

        /* RECOMMENDATION */
        .recommendation-block { display: flex; flex-direction: column; gap: 20px; }
        .rec-header { display: flex; align-items: center; gap: 20px; padding: 24px; border-radius: 16px; background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.2); }
        .rec-trophy { font-size: 2.5rem; }
        .rec-eyebrow { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--green); }
        .rec-name { font-size: 1.4rem; font-weight: 800; }
        .rec-score { font-size: 0.85rem; color: var(--green); font-weight: 700; }
        .rec-rationale { font-size: 0.9rem; line-height: 1.75; color: var(--text-secondary); padding: 20px; border-radius: 12px; background: var(--surface); border: 1px solid var(--border); }
        .rec-when-other { padding: 18px 20px; border-radius: 12px; background: rgba(99,102,241,0.06); border: 1px solid rgba(99,102,241,0.15); }
        .when-label { font-size: 0.85rem; font-weight: 700; color: var(--indigo); margin-bottom: 8px; }
        .when-text { font-size: 0.875rem; color: var(--muted); line-height: 1.6; }
        .followup-suggestions { }
        .fu-label { font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); margin-bottom: 10px; }
        .fu-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .fu-chip { padding: 8px 14px; border-radius: 100px; font-size: 0.8rem; background: var(--surface); border: 1px solid var(--border); color: var(--muted); cursor: pointer; transition: all 0.15s; }
        .fu-chip:hover { border-color: var(--indigo); color: var(--indigo); background: var(--indigo-dim); }
      `}</style>
    </div>
  );
}
