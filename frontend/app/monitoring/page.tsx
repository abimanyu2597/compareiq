"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const MONITORED = [
  { id: "m1", name: "iPhone 16 vs Pixel 9 Pro", domain: "Product", lastCheck: "2h ago", nextCheck: "22h", changes: 2, recommendationShifted: false },
  { id: "m2", name: "AWS vs Azure Enterprise Pricing", domain: "Vendor", lastCheck: "3h ago", nextCheck: "21h", changes: 0, recommendationShifted: false },
  { id: "m3", name: "Canada vs Germany — Dev Jobs", domain: "Country", lastCheck: "1d ago", nextCheck: "2h", changes: 1, recommendationShifted: true },
];

export default function MonitoringPage() {
  return (
    <div className="monitor-page">
      <nav className="monitor-nav">
        <Link href="/dashboard" className="back">← Dashboard</Link>
        <div className="nav-title"><span className="logo-mark">◈</span> Monitoring Center</div>
        <div />
      </nav>

      <div className="monitor-body">
        <div className="monitor-header">
          <div>
            <h1 className="monitor-title">Live Monitoring</h1>
            <p className="monitor-sub">Track changes across saved comparisons — price shifts, content updates, policy diffs.</p>
          </div>
          <Link href="/compare" className="btn-new">+ New Comparison</Link>
        </div>

        <div className="monitor-list">
          {MONITORED.map((m, i) => (
            <motion.div key={m.id} className="monitor-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div className="mc-left">
                <div className="mc-pulse-wrap">
                  <span className="mc-pulse" />
                </div>
                <div>
                  <div className="mc-name">{m.name}</div>
                  <div className="mc-meta">
                    <span className="mc-domain">{m.domain}</span>
                    <span className="mc-check">Last checked {m.lastCheck} · Next in {m.nextCheck}</span>
                  </div>
                </div>
              </div>
              <div className="mc-right">
                {m.recommendationShifted && (
                  <span className="badge badge-red">⚡ Recommendation shifted</span>
                )}
                {m.changes > 0 ? (
                  <span className="badge badge-amber">{m.changes} change{m.changes > 1 ? "s" : ""}</span>
                ) : (
                  <span className="badge badge-green">No changes</span>
                )}
                <Link href={`/comparison/${m.id}`} className="view-btn">View →</Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .monitor-page { min-height: 100vh; background: var(--bg); }
        .monitor-nav { display: flex; align-items: center; justify-content: space-between; padding: 0 2rem; height: 56px; border-bottom: 1px solid var(--border); background: rgba(3,7,18,0.95); backdrop-filter: blur(20px); }
        .back { font-size: 0.85rem; color: var(--muted); text-decoration: none; }
        .nav-title { font-size: 0.95rem; font-weight: 700; display: flex; align-items: center; gap: 8px; }
        .logo-mark { color: var(--indigo); }
        .monitor-body { max-width: 1000px; margin: 0 auto; padding: 2.5rem 2rem; }
        .monitor-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 2rem; }
        .monitor-title { font-size: 1.8rem; font-weight: 800; letter-spacing: -0.02em; }
        .monitor-sub { font-size: 0.875rem; color: var(--muted); margin-top: 4px; }
        .btn-new { padding: 10px 20px; border-radius: 10px; font-weight: 600; font-size: 0.875rem; text-decoration: none; color: white; background: linear-gradient(135deg, var(--indigo), var(--violet)); }
        .monitor-list { display: flex; flex-direction: column; gap: 10px; }
        .monitor-card { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; border-radius: 14px; background: var(--surface); border: 1px solid var(--border); }
        .mc-left { display: flex; align-items: center; gap: 14px; }
        .mc-pulse-wrap { width: 12px; height: 12px; display: flex; align-items: center; justify-content: center; }
        .mc-pulse { width: 8px; height: 8px; border-radius: 50%; background: var(--cyan); animation: pulse 2s infinite; flex-shrink: 0; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        .mc-name { font-size: 0.95rem; font-weight: 700; }
        .mc-meta { display: flex; align-items: center; gap: 10px; margin-top: 4px; }
        .mc-domain { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--indigo); background: rgba(99,102,241,0.1); padding: 2px 7px; border-radius: 100px; }
        .mc-check { font-size: 0.75rem; color: var(--dim); }
        .mc-right { display: flex; align-items: center; gap: 10px; }
        .badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 100px; font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        .badge-green { background: rgba(16,185,129,0.12); color: var(--green); }
        .badge-amber { background: rgba(245,158,11,0.12); color: var(--amber); }
        .badge-red { background: rgba(239,68,68,0.12); color: var(--red); }
        .view-btn { font-size: 0.8rem; color: var(--indigo); text-decoration: none; padding: 6px 12px; border: 1px solid rgba(99,102,241,0.3); border-radius: 7px; transition: background 0.15s; }
        .view-btn:hover { background: rgba(99,102,241,0.1); }
      `}</style>
    </div>
  );
}
