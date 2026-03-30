"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const RECENT = [
  { id: "c1", title: "MacBook Pro M4 vs Dell XPS 15", type: "Product", status: "complete", winner: "MacBook Pro M4", score: 92, ago: "2h ago", tags: ["Product", "Tech"] },
  { id: "c2", title: "Canada vs Germany — Data Scientist Relocation", type: "Country", status: "complete", winner: "Germany", score: 88, ago: "1d ago", tags: ["Country", "Career"] },
  { id: "c3", title: "Contract A vs Contract B — Vendor Selection", type: "Document", status: "processing", winner: null, score: null, ago: "5m ago", tags: ["Document", "Legal"] },
  { id: "c4", title: "OpenAI API vs Groq API — Cost & Latency", type: "Vendor", status: "complete", winner: "Groq", score: 79, ago: "3d ago", tags: ["Vendor", "API"] },
];

const QUICK_STARTS = [
  { icon: "📦", label: "Compare Products", desc: "URLs, specs, images", href: "/compare?mode=product" },
  { icon: "🌍", label: "Compare Countries", desc: "Relocation & career", href: "/compare?mode=country" },
  { icon: "📄", label: "Compare Documents", desc: "PDFs, contracts, proposals", href: "/compare?mode=document" },
  { icon: "🎙️", label: "Audio vs Document", desc: "Cross-modal validation", href: "/compare?mode=audio" },
];

const MONITORED = [
  { id: "m1", name: "iPhone 16 vs Pixel 9", lastCheck: "1h ago", changes: 2 },
  { id: "m2", name: "AWS vs Azure Pricing", lastCheck: "3h ago", changes: 0 },
];

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.07 } } },
  item: { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } },
};

export default function DashboardPage() {
  const [greeting] = useState(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  });

  return (
    <div className="dash">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-mark">◈</span>
          <span className="logo-text">CompareIQ</span>
          <span className="logo-ai">AI</span>
        </div>
        <nav className="sidebar-nav">
          {[
            { icon: "◫", label: "Dashboard", href: "/dashboard", active: true },
            { icon: "⊕", label: "New Comparison", href: "/compare" },
            { icon: "◳", label: "History", href: "/history" },
            { icon: "📡", label: "Monitoring", href: "/monitoring" },
            { icon: "⚙", label: "Settings", href: "/settings" },
          ].map((item) => (
            <Link key={item.label} href={item.href} className={`nav-item ${item.active ? "active" : ""}`}>
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-creator">
          <div className="creator-label">Created by</div>
          <div className="creator-name">Raja Abimanyu N</div>
          <div className="creator-title">Data Scientist · AI/ML</div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="dash-main">
        {/* Header */}
        <div className="dash-header">
          <div>
            <p className="dash-greeting">{greeting}</p>
            <h1 className="dash-title">Your Decision Hub</h1>
          </div>
          <Link href="/compare" className="new-compare-btn">
            <span>+</span> New Comparison
          </Link>
        </div>

        {/* Stats row */}
        <motion.div className="stats-row" variants={stagger.container} initial="hidden" animate="show">
          {[
            { n: 4, label: "Total Comparisons", color: "--indigo" },
            { n: 1, label: "In Progress", color: "--amber" },
            { n: 2, label: "Monitored", color: "--cyan" },
            { n: 12, label: "Evidence Sources", color: "--green" },
          ].map((s) => (
            <motion.div key={s.label} className="stat-tile" variants={stagger.item}>
              <span className="stat-n" style={{ color: `var(${s.color})` }}>{s.n}</span>
              <span className="stat-l">{s.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick starts */}
        <section className="dash-section">
          <h2 className="section-h">Start a comparison</h2>
          <div className="quick-grid">
            {QUICK_STARTS.map((q, i) => (
              <motion.div key={q.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Link href={q.href} className="quick-card">
                  <span className="quick-icon">{q.icon}</span>
                  <div>
                    <div className="quick-label">{q.label}</div>
                    <div className="quick-desc">{q.desc}</div>
                  </div>
                  <span className="quick-arrow">→</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recent comparisons */}
        <section className="dash-section">
          <div className="section-row">
            <h2 className="section-h">Recent comparisons</h2>
            <Link href="/history" className="see-all">See all →</Link>
          </div>
          <div className="comp-list">
            {RECENT.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                <Link href={`/comparison/${c.id}`} className="comp-card">
                  <div className="comp-info">
                    <div className="comp-tags">
                      {c.tags.map((t) => (
                        <span key={t} className="comp-tag">{t}</span>
                      ))}
                    </div>
                    <div className="comp-title">{c.title}</div>
                    <div className="comp-meta">{c.ago}</div>
                  </div>
                  <div className="comp-right">
                    {c.status === "processing" ? (
                      <span className="status-badge processing">
                        <span className="streaming-dot" style={{ width: 6, height: 6, background: "var(--amber)" }} />
                        Processing
                      </span>
                    ) : (
                      <div className="comp-result">
                        <span className="comp-winner">🏆 {c.winner}</span>
                        <span className="comp-score">{c.score}/100</span>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Monitoring */}
        <section className="dash-section">
          <div className="section-row">
            <h2 className="section-h">Live monitoring</h2>
            <Link href="/monitoring" className="see-all">Manage →</Link>
          </div>
          <div className="monitor-list">
            {MONITORED.map((m) => (
              <div key={m.id} className="monitor-card">
                <div className="monitor-pulse" />
                <div className="monitor-info">
                  <div className="monitor-name">{m.name}</div>
                  <div className="monitor-meta">Last checked {m.lastCheck}</div>
                </div>
                {m.changes > 0 ? (
                  <span className="badge badge-amber">{m.changes} changes</span>
                ) : (
                  <span className="badge badge-green">No changes</span>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <style jsx>{`
        .dash {
          display: flex; min-height: 100vh;
          background: var(--bg);
        }
        .sidebar {
          width: 240px; flex-shrink: 0;
          background: rgba(9, 14, 30, 0.9);
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column;
          padding: 0; position: sticky; top: 0; height: 100vh;
        }
        .sidebar-logo {
          display: flex; align-items: center; gap: 8px;
          padding: 20px 20px 16px; border-bottom: 1px solid var(--border);
        }
        .logo-mark { font-size: 1.3rem; color: var(--indigo); }
        .logo-text { font-size: 1rem; font-weight: 700; }
        .logo-ai {
          font-size: 0.55rem; font-weight: 700; letter-spacing: 0.1em;
          background: linear-gradient(135deg, var(--indigo), var(--cyan));
          padding: 2px 5px; border-radius: 3px; color: white;
        }
        .sidebar-nav { flex: 1; padding: 12px 8px; display: flex; flex-direction: column; gap: 2px; }
        .nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px; border-radius: 8px;
          font-size: 0.875rem; color: var(--muted); text-decoration: none;
          transition: background 0.15s, color 0.15s;
        }
        .nav-item:hover { background: rgba(99,102,241,0.08); color: var(--text); }
        .nav-item.active { background: rgba(99,102,241,0.12); color: var(--indigo); font-weight: 600; }
        .nav-icon { font-size: 1rem; width: 20px; text-align: center; }
        .sidebar-creator {
          padding: 16px 20px; border-top: 1px solid var(--border);
        }
        .creator-label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--dim); }
        .creator-name { font-size: 0.8rem; font-weight: 600; color: var(--indigo); margin-top: 4px; }
        .creator-title { font-size: 0.65rem; color: var(--dim); margin-top: 2px; }

        .dash-main { flex: 1; padding: 2rem 2.5rem; overflow-y: auto; max-width: 1000px; }
        .dash-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          margin-bottom: 2rem;
        }
        .dash-greeting { font-size: 0.8rem; color: var(--muted); margin-bottom: 4px; }
        .dash-title { font-size: 1.8rem; font-weight: 800; letter-spacing: -0.02em; }
        .new-compare-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 10px 20px; border-radius: 10px; font-weight: 600;
          font-size: 0.9rem; text-decoration: none; color: white;
          background: linear-gradient(135deg, var(--indigo), var(--violet));
          box-shadow: 0 0 30px rgba(99,102,241,0.25);
          transition: transform 0.2s;
        }
        .new-compare-btn:hover { transform: translateY(-1px); }

        .stats-row {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 12px; margin-bottom: 2rem;
        }
        .stat-tile {
          padding: 20px; border-radius: 12px;
          background: var(--surface); border: 1px solid var(--border);
          display: flex; flex-direction: column; gap: 4px;
        }
        .stat-n { font-size: 2rem; font-weight: 800; }
        .stat-l { font-size: 0.75rem; color: var(--muted); }

        .dash-section { margin-bottom: 2.5rem; }
        .section-h { font-size: 1.05rem; font-weight: 700; margin-bottom: 1rem; }
        .section-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
        .see-all { font-size: 0.8rem; color: var(--indigo); text-decoration: none; }

        .quick-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        .quick-card {
          display: flex; align-items: center; gap: 14px;
          padding: 16px 18px; border-radius: 12px;
          background: var(--surface); border: 1px solid var(--border);
          text-decoration: none; color: var(--text);
          transition: border-color 0.2s, background 0.2s;
        }
        .quick-card:hover { border-color: var(--border-hover); background: var(--surface-hover); }
        .quick-icon { font-size: 1.5rem; flex-shrink: 0; }
        .quick-label { font-size: 0.9rem; font-weight: 600; }
        .quick-desc { font-size: 0.75rem; color: var(--muted); }
        .quick-arrow { margin-left: auto; color: var(--dim); }

        .comp-list { display: flex; flex-direction: column; gap: 8px; }
        .comp-card {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px; border-radius: 12px;
          background: var(--surface); border: 1px solid var(--border);
          text-decoration: none; color: var(--text);
          transition: border-color 0.2s;
        }
        .comp-card:hover { border-color: var(--border-hover); }
        .comp-tags { display: flex; gap: 6px; margin-bottom: 6px; }
        .comp-tag {
          font-size: 0.65rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.06em; color: var(--indigo);
          background: rgba(99,102,241,0.1); padding: 2px 7px; border-radius: 100px;
        }
        .comp-title { font-size: 0.9rem; font-weight: 600; }
        .comp-meta { font-size: 0.75rem; color: var(--dim); margin-top: 4px; }
        .comp-right { flex-shrink: 0; }
        .status-badge {
          display: flex; align-items: center; gap: 6px;
          font-size: 0.75rem; font-weight: 600; color: var(--amber);
        }
        .comp-result { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
        .comp-winner { font-size: 0.8rem; font-weight: 600; color: var(--green); }
        .comp-score { font-size: 0.7rem; color: var(--muted); }

        .monitor-list { display: flex; flex-direction: column; gap: 8px; }
        .monitor-card {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 18px; border-radius: 12px;
          background: var(--surface); border: 1px solid var(--border);
        }
        .monitor-pulse {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--cyan); flex-shrink: 0;
          animation: pulse 2s infinite;
        }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        .monitor-info { flex: 1; }
        .monitor-name { font-size: 0.875rem; font-weight: 600; }
        .monitor-meta { font-size: 0.75rem; color: var(--dim); }

        .badge {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 10px; border-radius: 100px;
          font-size: 0.7rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
        }
        .badge-green { background: rgba(16,185,129,0.12); color: var(--green); }
        .badge-amber { background: rgba(245,158,11,0.12); color: var(--amber); }
      `}</style>
    </div>
  );
}
