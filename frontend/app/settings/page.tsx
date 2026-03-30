"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type SettingsTab = "api" | "notifications" | "appearance" | "account";

export default function SettingsPage() {
  const [tab, setTab] = useState<SettingsTab>("api");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const TABS: { id: SettingsTab; label: string; icon: string }[] = [
    { id: "api", label: "API & Providers", icon: "⚡" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "appearance", label: "Appearance", icon: "🎨" },
    { id: "account", label: "Account", icon: "👤" },
  ];

  return (
    <div className="settings-page">
      <nav className="settings-nav">
        <Link href="/dashboard" className="back">← Dashboard</Link>
        <div className="nav-title"><span className="logo-mark">◈</span> Settings</div>
        <div />
      </nav>

      <div className="settings-body">
        <aside className="settings-sidebar">
          {TABS.map((t) => (
            <button key={t.id} className={`settings-tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
          <div className="settings-creator">
            <div className="sc-label">Created by</div>
            <div className="sc-name">Raja Abimanyu N</div>
            <div className="sc-title">Data Scientist · AI/ML</div>
          </div>
        </aside>

        <main className="settings-main">
          {tab === "api" && (
            <motion.div key="api" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="settings-section">
              <h2 className="section-title">API & LLM Providers</h2>
              <p className="section-desc">Configure your AI provider keys. Keys are stored securely and never logged.</p>

              <div className="settings-group">
                <div className="group-title">
                  <span className="group-icon" style={{ background: "rgba(16,185,129,0.15)", color: "var(--green)" }}>⚡</span>
                  Groq — Fast Extraction Engine
                </div>
                <div className="group-desc">Used for: extraction, summarization, normalization, scoring drafts</div>
                <div className="form-field">
                  <label className="field-label">Groq API Key</label>
                  <input className="field-input" type="password" placeholder="gsk_..." defaultValue="gsk_••••••••••••••••••••" />
                </div>
                <div className="form-field">
                  <label className="field-label">Model</label>
                  <select className="field-select">
                    <option>llama3-70b-8192 (recommended)</option>
                    <option>llama3-8b-8192 (faster)</option>
                    <option>mixtral-8x7b-32768</option>
                  </select>
                </div>
              </div>

              <div className="settings-group">
                <div className="group-title">
                  <span className="group-icon" style={{ background: "rgba(99,102,241,0.15)", color: "var(--indigo)" }}>🧠</span>
                  OpenAI — Deep Reasoning Engine
                </div>
                <div className="group-desc">Used for: multimodal input, contradiction analysis, final recommendations, report writing</div>
                <div className="form-field">
                  <label className="field-label">OpenAI API Key</label>
                  <input className="field-input" type="password" placeholder="sk-..." defaultValue="sk-••••••••••••••••••••" />
                </div>
                <div className="form-field">
                  <label className="field-label">Reasoning Model</label>
                  <select className="field-select">
                    <option>gpt-4o (recommended)</option>
                    <option>gpt-4o-mini (faster, cheaper)</option>
                    <option>gpt-4-turbo</option>
                  </select>
                </div>
              </div>

              <div className="settings-group">
                <div className="group-title">
                  <span className="group-icon" style={{ background: "rgba(6,182,212,0.15)", color: "var(--cyan)" }}>🗄</span>
                  Qdrant — Vector Store
                </div>
                <div className="form-field">
                  <label className="field-label">Qdrant URL</label>
                  <input className="field-input" type="text" defaultValue="http://localhost:6333" />
                </div>
                <div className="form-field">
                  <label className="field-label">API Key (optional for cloud)</label>
                  <input className="field-input" type="password" placeholder="Leave empty for local" />
                </div>
              </div>
            </motion.div>
          )}

          {tab === "notifications" && (
            <motion.div key="notif" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="settings-section">
              <h2 className="section-title">Notification Preferences</h2>
              <p className="section-desc">Control when and how CompareIQ alerts you to changes in monitored comparisons.</p>

              <div className="settings-group">
                <div className="group-title">📡 Monitoring Alerts</div>
                {[
                  { label: "Price changes detected", desc: "Alert when monitored product prices change" },
                  { label: "Content changes", desc: "Alert when source URLs or documents update" },
                  { label: "Recommendation shifted", desc: "Alert when the winner changes after re-analysis" },
                  { label: "Contradictions introduced", desc: "Alert when new source conflicts emerge" },
                ].map((n) => (
                  <div key={n.label} className="toggle-row">
                    <div>
                      <div className="toggle-label">{n.label}</div>
                      <div className="toggle-desc">{n.desc}</div>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-track" />
                    </label>
                  </div>
                ))}
              </div>

              <div className="settings-group">
                <div className="group-title">📬 Delivery</div>
                <div className="form-field">
                  <label className="field-label">Email for alerts</label>
                  <input className="field-input" type="email" placeholder="you@example.com" />
                </div>
                <div className="form-field">
                  <label className="field-label">Webhook URL (optional)</label>
                  <input className="field-input" type="url" placeholder="https://..." />
                </div>
              </div>
            </motion.div>
          )}

          {tab === "appearance" && (
            <motion.div key="appear" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="settings-section">
              <h2 className="section-title">Appearance</h2>
              <p className="section-desc">Customize the visual experience of CompareIQ AI.</p>

              <div className="settings-group">
                <div className="group-title">🎨 Theme</div>
                <div className="theme-grid">
                  {[
                    { name: "Dark (default)", colors: ["#030712", "#6366f1", "#06b6d4"] },
                    { name: "Midnight Blue", colors: ["#0a0e2a", "#818cf8", "#34d399"] },
                    { name: "Deep Purple", colors: ["#0d0320", "#a855f7", "#f472b6"] },
                  ].map((t, i) => (
                    <div key={t.name} className={`theme-card ${i === 0 ? "selected" : ""}`}>
                      <div className="theme-preview">
                        {t.colors.map((c) => <span key={c} className="theme-swatch" style={{ background: c }} />)}
                      </div>
                      <span className="theme-name">{t.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="settings-group">
                <div className="group-title">⚙ Interface</div>
                {[
                  { label: "Show pipeline steps in real-time", desc: "Display live agent progress during comparisons" },
                  { label: "Animate score bars", desc: "Smooth transition on score chart renders" },
                  { label: "Compact mode", desc: "Reduce spacing for higher information density" },
                ].map((n) => (
                  <div key={n.label} className="toggle-row">
                    <div>
                      <div className="toggle-label">{n.label}</div>
                      <div className="toggle-desc">{n.desc}</div>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-track" />
                    </label>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === "account" && (
            <motion.div key="account" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="settings-section">
              <h2 className="section-title">Account</h2>
              <div className="settings-group">
                <div className="group-title">👤 Profile</div>
                <div className="form-field">
                  <label className="field-label">Name</label>
                  <input className="field-input" type="text" defaultValue="Raja Abimanyu N" />
                </div>
                <div className="form-field">
                  <label className="field-label">Email</label>
                  <input className="field-input" type="email" defaultValue="raja@compareiq.ai" />
                </div>
              </div>
              <div className="settings-group">
                <div className="group-title">🔐 Security</div>
                <div className="form-field">
                  <label className="field-label">Current Password</label>
                  <input className="field-input" type="password" placeholder="••••••••" />
                </div>
                <div className="form-field">
                  <label className="field-label">New Password</label>
                  <input className="field-input" type="password" placeholder="••••••••" />
                </div>
              </div>
              <div className="danger-zone">
                <div className="danger-title">⚠ Danger Zone</div>
                <button className="danger-btn">Delete account and all data</button>
              </div>
            </motion.div>
          )}

          <div className="settings-footer">
            <button className="save-btn" onClick={handleSave}>
              {saved ? "✓ Saved!" : "Save changes"}
            </button>
          </div>
        </main>
      </div>

      <style jsx>{`
        .settings-page { min-height: 100vh; background: var(--bg); display: flex; flex-direction: column; }
        .settings-nav { display: flex; align-items: center; justify-content: space-between; padding: 0 2rem; height: 56px; border-bottom: 1px solid var(--border); background: rgba(3,7,18,0.95); backdrop-filter: blur(20px); }
        .back { font-size: 0.85rem; color: var(--muted); text-decoration: none; }
        .nav-title { font-size: 0.95rem; font-weight: 700; display: flex; align-items: center; gap: 8px; }
        .logo-mark { color: var(--indigo); }
        .settings-body { display: flex; flex: 1; max-width: 1000px; margin: 0 auto; width: 100%; padding: 2rem; gap: 2rem; }

        .settings-sidebar { width: 200px; flex-shrink: 0; display: flex; flex-direction: column; gap: 2px; }
        .settings-tab {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px; border-radius: 8px;
          font-size: 0.875rem; color: var(--muted); background: none; border: none; cursor: pointer;
          transition: all 0.15s; text-align: left;
        }
        .settings-tab:hover { background: rgba(99,102,241,0.07); color: var(--text); }
        .settings-tab.active { background: rgba(99,102,241,0.12); color: var(--indigo); font-weight: 600; }
        .settings-creator { margin-top: auto; padding: 16px 12px; border-top: 1px solid var(--border); }
        .sc-label { font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--dim); }
        .sc-name { font-size: 0.78rem; font-weight: 600; color: var(--indigo); margin-top: 4px; }
        .sc-title { font-size: 0.62rem; color: var(--dim); margin-top: 2px; }

        .settings-main { flex: 1; display: flex; flex-direction: column; }
        .settings-section { flex: 1; display: flex; flex-direction: column; gap: 1.5rem; }
        .section-title { font-size: 1.3rem; font-weight: 800; letter-spacing: -0.02em; }
        .section-desc { font-size: 0.875rem; color: var(--muted); margin-top: -0.5rem; }

        .settings-group {
          padding: 20px; border-radius: 14px;
          background: var(--surface); border: 1px solid var(--border);
          display: flex; flex-direction: column; gap: 14px;
        }
        .group-title { display: flex; align-items: center; gap: 10px; font-size: 0.9rem; font-weight: 700; }
        .group-icon { padding: 5px 8px; border-radius: 6px; font-size: 0.8rem; }
        .group-desc { font-size: 0.8rem; color: var(--muted); margin-top: -6px; }

        .form-field { display: flex; flex-direction: column; gap: 6px; }
        .field-label { font-size: 0.78rem; font-weight: 600; color: var(--muted); }
        .field-input, .field-select {
          padding: 9px 13px; border-radius: 9px;
          background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.07);
          color: var(--text); font-family: inherit; font-size: 0.875rem;
          transition: border-color 0.2s;
        }
        .field-input:focus, .field-select:focus { outline: none; border-color: var(--indigo); }
        .field-select { appearance: none; cursor: pointer; }

        .toggle-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .toggle-row:last-child { border-bottom: none; }
        .toggle-label { font-size: 0.875rem; font-weight: 500; }
        .toggle-desc { font-size: 0.75rem; color: var(--muted); margin-top: 2px; }
        .toggle-switch { position: relative; display: inline-block; width: 40px; height: 22px; flex-shrink: 0; }
        .toggle-switch input { opacity: 0; width: 0; height: 0; }
        .toggle-track {
          position: absolute; inset: 0; background: rgba(255,255,255,0.1); border-radius: 11px;
          cursor: pointer; transition: background 0.2s;
        }
        .toggle-switch input:checked + .toggle-track { background: var(--indigo); }
        .toggle-track::before {
          content: ""; position: absolute;
          width: 16px; height: 16px; border-radius: 50%;
          background: white; top: 3px; left: 3px; transition: transform 0.2s;
        }
        .toggle-switch input:checked + .toggle-track::before { transform: translateX(18px); }

        .theme-grid { display: flex; gap: 12px; }
        .theme-card {
          padding: 12px; border-radius: 10px; cursor: pointer;
          background: rgba(0,0,0,0.15); border: 1px solid var(--border);
          display: flex; flex-direction: column; gap: 8px;
          transition: border-color 0.2s;
        }
        .theme-card.selected { border-color: var(--indigo); background: rgba(99,102,241,0.08); }
        .theme-preview { display: flex; gap: 4px; }
        .theme-swatch { width: 20px; height: 20px; border-radius: 4px; }
        .theme-name { font-size: 0.75rem; color: var(--muted); }

        .danger-zone {
          padding: 16px 20px; border-radius: 12px;
          background: rgba(239,68,68,0.05); border: 1px solid rgba(239,68,68,0.2);
        }
        .danger-title { font-size: 0.85rem; font-weight: 700; color: var(--red); margin-bottom: 10px; }
        .danger-btn {
          padding: 8px 16px; border-radius: 8px; font-size: 0.825rem;
          background: none; border: 1px solid rgba(239,68,68,0.3);
          color: var(--red); cursor: pointer; transition: background 0.2s;
        }
        .danger-btn:hover { background: rgba(239,68,68,0.1); }

        .settings-footer { margin-top: 1.5rem; }
        .save-btn {
          padding: 11px 28px; border-radius: 10px; font-weight: 700; font-size: 0.9rem;
          background: linear-gradient(135deg, var(--indigo), var(--violet));
          color: white; border: none; cursor: pointer;
          box-shadow: 0 0 24px rgba(99,102,241,0.25);
          transition: opacity 0.2s, transform 0.2s;
        }
        .save-btn:hover { opacity: 0.9; transform: translateY(-1px); }
      `}</style>
    </div>
  );
}
