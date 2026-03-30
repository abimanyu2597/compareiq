"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ─── Types ──────────────────────────────────────────────────────────────────
type InputType = "text" | "pdf" | "url" | "image" | "audio";
type Persona = "student" | "investor" | "developer" | "traveler" | "family" | "business" | "procurement";
type DecisionMode = "buy" | "migrate" | "apply" | "shortlist" | "validate" | "choose_vendor" | "negotiate";

interface Entity {
  id: string;
  label: string;
  inputType: InputType;
  content: string;
  file?: File;
}

interface PipelineStep {
  id: string;
  label: string;
  status: "pending" | "running" | "done" | "error";
  detail?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const PERSONAS: { value: Persona; label: string; icon: string }[] = [
  { value: "student", label: "Student", icon: "🎓" },
  { value: "investor", label: "Investor", icon: "💹" },
  { value: "developer", label: "Developer", icon: "💻" },
  { value: "traveler", label: "Traveler", icon: "✈️" },
  { value: "family", label: "Family", icon: "🏠" },
  { value: "business", label: "Business", icon: "🏢" },
  { value: "procurement", label: "Procurement", icon: "📋" },
];

const DECISION_MODES: { value: DecisionMode; label: string }[] = [
  { value: "buy", label: "Buy" },
  { value: "migrate", label: "Migrate" },
  { value: "apply", label: "Apply" },
  { value: "shortlist", label: "Shortlist" },
  { value: "validate", label: "Validate Claim" },
  { value: "choose_vendor", label: "Choose Vendor" },
  { value: "negotiate", label: "Negotiate" },
];

const INITIAL_PIPELINE: PipelineStep[] = [
  { id: "ingest", label: "Ingesting inputs", status: "pending" },
  { id: "parse", label: "Parsing content", status: "pending" },
  { id: "extract", label: "Extracting structured facts", status: "pending" },
  { id: "normalize", label: "Normalizing fields & units", status: "pending" },
  { id: "evidence", label: "Retrieving evidence snippets", status: "pending" },
  { id: "score", label: "Scoring entities", status: "pending" },
  { id: "contradict", label: "Running contradiction check", status: "pending" },
  { id: "recommend", label: "Generating recommendation", status: "pending" },
  { id: "report", label: "Building final report", status: "pending" },
];

const SAMPLE_CRITERIA = ["Performance", "Price", "Build Quality", "Battery Life", "Software", "Support"];

// ─── Sub-components ──────────────────────────────────────────────────────────
function EntityCard({ entity, onUpdate, onRemove, index }: {
  entity: Entity;
  onUpdate: (id: string, updates: Partial<Entity>) => void;
  onRemove: (id: string) => void;
  index: number;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const INPUT_TYPES: { value: InputType; icon: string; label: string }[] = [
    { value: "text", icon: "T", label: "Text" },
    { value: "url", icon: "🔗", label: "URL" },
    { value: "pdf", icon: "📄", label: "PDF" },
    { value: "image", icon: "🖼", label: "Image" },
    { value: "audio", icon: "🎙", label: "Audio" },
  ];

  return (
    <motion.div className="entity-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
      <div className="entity-header">
        <div className="entity-index">
          <span className="entity-num">{String.fromCharCode(64 + index + 1)}</span>
          <input
            className="entity-label-input"
            placeholder={`Option ${String.fromCharCode(64 + index + 1)}`}
            value={entity.label}
            onChange={(e) => onUpdate(entity.id, { label: e.target.value })}
          />
        </div>
        <button className="entity-remove" onClick={() => onRemove(entity.id)}>✕</button>
      </div>

      <div className="input-type-tabs">
        {INPUT_TYPES.map((t) => (
          <button
            key={t.value}
            className={`type-tab ${entity.inputType === t.value ? "active" : ""}`}
            onClick={() => onUpdate(entity.id, { inputType: t.value, content: "" })}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {(entity.inputType === "text" || entity.inputType === "url") && (
        <textarea
          className="entity-textarea"
          placeholder={entity.inputType === "url" ? "https://..." : "Paste or type content here…"}
          value={entity.content}
          onChange={(e) => onUpdate(entity.id, { content: e.target.value })}
          rows={entity.inputType === "url" ? 2 : 5}
        />
      )}

      {(entity.inputType === "pdf" || entity.inputType === "image" || entity.inputType === "audio") && (
        <div
          className={`drop-zone ${entity.file ? "has-file" : ""}`}
          onClick={() => fileRef.current?.click()}
        >
          {entity.file ? (
            <div className="file-info">
              <span className="file-icon">
                {entity.inputType === "pdf" ? "📄" : entity.inputType === "image" ? "🖼" : "🎙"}
              </span>
              <span className="file-name">{entity.file.name}</span>
              <span className="file-size">{(entity.file.size / 1024).toFixed(1)} KB</span>
            </div>
          ) : (
            <div className="drop-hint">
              <span className="drop-icon">
                {entity.inputType === "pdf" ? "📄" : entity.inputType === "image" ? "🖼" : "🎙"}
              </span>
              <span>Click to upload {entity.inputType.toUpperCase()}</span>
              <span className="drop-sub">or drag and drop</span>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            style={{ display: "none" }}
            accept={entity.inputType === "pdf" ? ".pdf" : entity.inputType === "image" ? "image/*" : "audio/*"}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onUpdate(entity.id, { file: f, content: f.name });
            }}
          />
        </div>
      )}
    </motion.div>
  );
}

function PipelineViewer({ steps }: { steps: PipelineStep[] }) {
  return (
    <div className="pipeline-viewer">
      <div className="pipeline-header">
        <span className="streaming-dot" />
        <span>AI Pipeline — Live</span>
      </div>
      {steps.map((step) => (
        <div key={step.id} className={`pipeline-row ${step.status}`}>
          <span className="pip-icon">
            {step.status === "done" ? "✓" : step.status === "running" ? "◉" : step.status === "error" ? "✕" : "○"}
          </span>
          <span className="pip-label">{step.label}</span>
          {step.detail && <span className="pip-detail">{step.detail}</span>}
          {step.status === "running" && (
            <motion.div className="pip-bar" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1 }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ComparePage() {
  const [entities, setEntities] = useState<Entity[]>([
    { id: "e1", label: "", inputType: "text", content: "" },
    { id: "e2", label: "", inputType: "text", content: "" },
  ]);
  const [persona, setPersona] = useState<Persona>("developer");
  const [decisionMode, setDecisionMode] = useState<DecisionMode>("buy");
  const [criteria, setCriteria] = useState<string[]>(["Performance", "Price", "Build Quality"]);
  const [weights, setWeights] = useState<Record<string, number>>({ Performance: 40, Price: 35, "Build Quality": 25 });
  const [intent, setIntent] = useState("");
  const [pipeline, setPipeline] = useState<PipelineStep[]>(INITIAL_PIPELINE);
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [activeTab, setActiveTab] = useState<"setup" | "pipeline" | "results">("setup");
  const [newCrit, setNewCrit] = useState("");

  const addEntity = () => {
    if (entities.length >= 5) return;
    setEntities((prev) => [...prev, { id: `e${Date.now()}`, label: "", inputType: "text", content: "" }]);
  };

  const updateEntity = (id: string, updates: Partial<Entity>) => {
    setEntities((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const removeEntity = (id: string) => {
    if (entities.length <= 2) return;
    setEntities((prev) => prev.filter((e) => e.id !== id));
  };

  const addCriterion = () => {
    if (!newCrit.trim() || criteria.includes(newCrit.trim())) return;
    setCriteria((prev) => [...prev, newCrit.trim()]);
    setWeights((prev) => ({ ...prev, [newCrit.trim()]: 0 }));
    setNewCrit("");
  };

  const runComparison = useCallback(async () => {
    setStatus("running");
    setActiveTab("pipeline");
    const steps = [...INITIAL_PIPELINE];

    for (let i = 0; i < steps.length; i++) {
      steps[i] = { ...steps[i], status: "running" };
      setPipeline([...steps]);
      await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));
      steps[i] = { ...steps[i], status: "done" };
      setPipeline([...steps]);
    }

    setStatus("done");
    setTimeout(() => setActiveTab("results"), 500);
  }, []);

  const TABS = [
    { id: "setup", label: "Setup" },
    { id: "pipeline", label: "Pipeline" },
    { id: "results", label: "Results" },
  ] as const;

  return (
    <div className="compare-page">
      {/* NAV */}
      <nav className="comp-nav">
        <Link href="/dashboard" className="comp-nav-back">← Dashboard</Link>
        <div className="comp-nav-title">
          <span className="logo-mark">◈</span> New Comparison
        </div>
        <div className="comp-nav-status">
          {status === "running" && <><span className="streaming-dot" /> Running</>}
          {status === "done" && <span style={{ color: "var(--green)" }}>✓ Complete</span>}
        </div>
      </nav>

      {/* TABS */}
      <div className="comp-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`comp-tab ${activeTab === t.id ? "active" : ""}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
            {t.id === "pipeline" && status === "running" && <span className="tab-dot" />}
            {t.id === "results" && status === "done" && <span className="tab-dot green" />}
          </button>
        ))}
      </div>

      <div className="comp-body">
        {/* ── SETUP TAB ── */}
        <AnimatePresence mode="wait">
          {activeTab === "setup" && (
            <motion.div key="setup" className="setup-layout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Intent */}
              <div className="setup-section">
                <label className="setup-label">What are you trying to decide?</label>
                <textarea
                  className="intent-input"
                  placeholder="e.g. I want to buy a laptop for machine learning work under ₹1.5 lakh budget"
                  value={intent}
                  onChange={(e) => setIntent(e.target.value)}
                  rows={2}
                />
              </div>

              {/* Entities */}
              <div className="setup-section">
                <div className="setup-label-row">
                  <label className="setup-label">Entities to compare ({entities.length}/5)</label>
                  {entities.length < 5 && (
                    <button className="add-entity-btn" onClick={addEntity}>+ Add Entity</button>
                  )}
                </div>
                <div className="entities-grid">
                  <AnimatePresence>
                    {entities.map((e, i) => (
                      <EntityCard key={e.id} entity={e} index={i} onUpdate={updateEntity} onRemove={removeEntity} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Persona + Mode */}
              <div className="setup-row">
                <div className="setup-section flex-1">
                  <label className="setup-label">Your persona</label>
                  <div className="persona-grid">
                    {PERSONAS.map((p) => (
                      <button
                        key={p.value}
                        className={`persona-btn ${persona === p.value ? "active" : ""}`}
                        onClick={() => setPersona(p.value)}
                      >
                        <span>{p.icon}</span>
                        <span>{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="setup-section" style={{ minWidth: 200 }}>
                  <label className="setup-label">Decision mode</label>
                  <div className="mode-list">
                    {DECISION_MODES.map((m) => (
                      <button
                        key={m.value}
                        className={`mode-btn ${decisionMode === m.value ? "active" : ""}`}
                        onClick={() => setDecisionMode(m.value)}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Criteria & Weights */}
              <div className="setup-section">
                <label className="setup-label">Scoring criteria & weights</label>
                <div className="criteria-list">
                  {criteria.map((c) => (
                    <div key={c} className="criterion-row">
                      <span className="criterion-name">{c}</span>
                      <input
                        type="range" min={0} max={100}
                        value={weights[c] ?? 0}
                        onChange={(e) => setWeights((prev) => ({ ...prev, [c]: Number(e.target.value) }))}
                        className="weight-slider"
                      />
                      <span className="criterion-val">{weights[c] ?? 0}%</span>
                      <button className="remove-crit" onClick={() => {
                        setCriteria((prev) => prev.filter((x) => x !== c));
                        setWeights((prev) => { const n = { ...prev }; delete n[c]; return n; });
                      }}>✕</button>
                    </div>
                  ))}
                  <div className="add-crit-row">
                    <input
                      className="crit-input" placeholder="Add criterion…"
                      value={newCrit} onChange={(e) => setNewCrit(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addCriterion()}
                    />
                    <button className="add-crit-btn" onClick={addCriterion}>Add</button>
                  </div>
                  <div className="sample-crits">
                    {SAMPLE_CRITERIA.filter((s) => !criteria.includes(s)).map((s) => (
                      <button key={s} className="sample-crit" onClick={() => {
                        setCriteria((prev) => [...prev, s]);
                        setWeights((prev) => ({ ...prev, [s]: 0 }));
                      }}>{s} +</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Run */}
              <button className="run-btn" onClick={runComparison} disabled={status === "running"}>
                {status === "running" ? (
                  <><span className="streaming-dot" /> Comparing…</>
                ) : (
                  <>⚡ Run Comparison</>
                )}
              </button>
            </motion.div>
          )}

          {/* ── PIPELINE TAB ── */}
          {activeTab === "pipeline" && (
            <motion.div key="pipeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <PipelineViewer steps={pipeline} />
            </motion.div>
          )}

          {/* ── RESULTS TAB ── */}
          {activeTab === "results" && status === "done" && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="results-header">
                <div>
                  <div className="results-eyebrow">Analysis complete</div>
                  <h2 className="results-title">Comparison Results</h2>
                </div>
                <div className="export-btns">
                  <button className="export-btn">📄 PDF</button>
                  <button className="export-btn">📝 Markdown</button>
                </div>
              </div>

              {/* Winner card */}
              <div className="winner-card">
                <div className="winner-trophy">🏆</div>
                <div>
                  <div className="winner-label">Recommended Choice</div>
                  <div className="winner-name">{entities[0]?.label || "Option A"}</div>
                  <div className="winner-reason">Best overall score across {criteria.length} criteria for {persona} persona in {decisionMode} mode.</div>
                </div>
                <div className="winner-score">
                  <div className="score-big">92</div>
                  <div className="score-label">/100</div>
                </div>
              </div>

              {/* Score table */}
              <div className="score-table">
                <div className="score-table-header">
                  <span>Criterion</span>
                  {entities.map((e, i) => (
                    <span key={e.id}>{e.label || `Option ${String.fromCharCode(65 + i)}`}</span>
                  ))}
                </div>
                {criteria.map((c) => (
                  <div key={c} className="score-row">
                    <span className="crit-cell">{c}</span>
                    {entities.map((e) => {
                      const score = Math.floor(60 + Math.random() * 40);
                      return (
                        <span key={e.id} className="score-cell">
                          <span className="score-bar-wrap">
                            <motion.span
                              className="score-bar-fill"
                              initial={{ width: 0 }}
                              animate={{ width: `${score}%` }}
                              transition={{ duration: 0.8, delay: 0.2 }}
                              style={{ background: score > 80 ? "var(--green)" : score > 65 ? "var(--indigo)" : "var(--amber)" }}
                            />
                          </span>
                          <span className="score-num">{score}</span>
                        </span>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Trust meter */}
              <div className="trust-meter">
                <div className="trust-title">Trust Metrics</div>
                <div className="trust-items">
                  {[
                    { label: "Confidence", val: 87, color: "var(--green)" },
                    { label: "Completeness", val: 74, color: "var(--indigo)" },
                    { label: "Freshness", val: 91, color: "var(--cyan)" },
                    { label: "Contradictions", val: 2, unit: "found", color: "var(--amber)" },
                  ].map((t) => (
                    <div key={t.label} className="trust-item">
                      <span className="trust-label">{t.label}</span>
                      <span className="trust-val" style={{ color: t.color }}>
                        {t.val}{t.unit ? ` ${t.unit}` : "%"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Follow-up chat */}
              <div className="followup-section">
                <div className="followup-label">Follow-up questions</div>
                <div className="followup-chips">
                  {["Why did Option A win?", "Re-rank by price only", "Compare for India market", "Summarize for executives"].map((q) => (
                    <button key={q} className="followup-chip">{q}</button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "results" && status !== "done" && (
            <motion.div key="no-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="no-results">
              <p>Run a comparison to see results here.</p>
              <button className="run-btn" onClick={() => setActiveTab("setup")}>← Go to Setup</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .compare-page { min-height: 100vh; background: var(--bg); display: flex; flex-direction: column; }
        .comp-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 2rem; height: 56px;
          border-bottom: 1px solid var(--border);
          background: rgba(3,7,18,0.9); backdrop-filter: blur(20px);
          position: sticky; top: 0; z-index: 50;
        }
        .comp-nav-back { font-size: 0.85rem; color: var(--muted); text-decoration: none; transition: color 0.2s; }
        .comp-nav-back:hover { color: var(--text); }
        .comp-nav-title { font-size: 0.95rem; font-weight: 700; display: flex; align-items: center; gap: 8px; }
        .logo-mark { color: var(--indigo); }
        .comp-nav-status { font-size: 0.8rem; color: var(--muted); display: flex; align-items: center; gap: 6px; }
        .streaming-dot {
          display: inline-block; width: 8px; height: 8px; border-radius: 50%;
          background: var(--indigo); animation: blink 1s infinite;
        }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.2; } }

        .comp-tabs {
          display: flex; gap: 0;
          border-bottom: 1px solid var(--border);
          padding: 0 2rem;
          background: rgba(9,14,30,0.5);
        }
        .comp-tab {
          padding: 12px 20px; font-size: 0.875rem; font-weight: 500;
          color: var(--muted); background: none; border: none; cursor: pointer;
          border-bottom: 2px solid transparent; transition: all 0.2s;
          position: relative; display: flex; align-items: center; gap: 6px;
        }
        .comp-tab.active { color: var(--indigo); border-bottom-color: var(--indigo); }
        .tab-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--amber); }
        .tab-dot.green { background: var(--green); }

        .comp-body { flex: 1; padding: 2rem; max-width: 1100px; margin: 0 auto; width: 100%; }

        /* SETUP */
        .setup-layout { display: flex; flex-direction: column; gap: 1.8rem; }
        .setup-section { display: flex; flex-direction: column; gap: 10px; }
        .setup-label { font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); }
        .setup-label-row { display: flex; align-items: center; justify-content: space-between; }
        .setup-row { display: flex; gap: 1.5rem; }
        .flex-1 { flex: 1; }

        .intent-input {
          width: 100%; padding: 12px 16px; border-radius: 10px;
          background: var(--surface); border: 1px solid var(--border);
          color: var(--text); font-family: inherit; font-size: 0.9rem;
          resize: none; transition: border-color 0.2s;
        }
        .intent-input:focus { outline: none; border-color: var(--border-hover); }

        .entities-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 14px; }
        .entity-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 14px; padding: 16px; display: flex; flex-direction: column; gap: 10px;
        }
        .entity-header { display: flex; align-items: center; justify-content: space-between; }
        .entity-index { display: flex; align-items: center; gap: 8px; }
        .entity-num {
          width: 26px; height: 26px; border-radius: 6px;
          background: var(--indigo-dim); color: var(--indigo);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.8rem; font-weight: 700;
        }
        .entity-label-input {
          background: none; border: none; color: var(--text); font-size: 0.9rem;
          font-weight: 600; font-family: inherit;
        }
        .entity-label-input:focus { outline: none; }
        .entity-label-input::placeholder { color: var(--dim); }
        .entity-remove { background: none; border: none; color: var(--dim); cursor: pointer; font-size: 0.9rem; padding: 4px; }
        .entity-remove:hover { color: var(--red); }

        .input-type-tabs { display: flex; gap: 4px; }
        .type-tab {
          flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px;
          padding: 6px 4px; border-radius: 7px; font-size: 0.65rem;
          background: none; border: 1px solid var(--border); color: var(--dim);
          cursor: pointer; transition: all 0.15s;
        }
        .type-tab.active { background: var(--indigo-dim); border-color: var(--indigo); color: var(--indigo); }

        .entity-textarea {
          width: 100%; padding: 10px 12px; border-radius: 8px;
          background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.06);
          color: var(--text); font-family: inherit; font-size: 0.85rem;
          resize: none; transition: border-color 0.2s;
        }
        .entity-textarea:focus { outline: none; border-color: var(--border-hover); }

        .drop-zone {
          border: 1px dashed rgba(99,102,241,0.3); border-radius: 8px;
          padding: 20px; text-align: center; cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          background: rgba(99,102,241,0.03);
        }
        .drop-zone:hover { border-color: var(--indigo); background: rgba(99,102,241,0.06); }
        .drop-zone.has-file { border-style: solid; border-color: rgba(16,185,129,0.3); background: rgba(16,185,129,0.04); }
        .drop-hint { display: flex; flex-direction: column; gap: 4px; color: var(--dim); font-size: 0.8rem; }
        .drop-icon { font-size: 1.5rem; }
        .drop-sub { font-size: 0.7rem; }
        .file-info { display: flex; align-items: center; gap: 10px; justify-content: center; }
        .file-icon { font-size: 1.3rem; }
        .file-name { font-size: 0.85rem; color: var(--text); }
        .file-size { font-size: 0.7rem; color: var(--dim); }

        .add-entity-btn {
          font-size: 0.8rem; color: var(--indigo); background: var(--indigo-dim);
          border: none; padding: 5px 12px; border-radius: 6px; cursor: pointer;
          font-weight: 600; transition: background 0.2s;
        }

        .persona-grid { display: flex; flex-wrap: wrap; gap: 8px; }
        .persona-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 12px; border-radius: 8px; font-size: 0.8rem;
          background: var(--surface); border: 1px solid var(--border);
          color: var(--muted); cursor: pointer; transition: all 0.15s;
        }
        .persona-btn.active { background: var(--indigo-dim); border-color: var(--indigo); color: var(--indigo); font-weight: 600; }

        .mode-list { display: flex; flex-direction: column; gap: 6px; }
        .mode-btn {
          padding: 8px 14px; border-radius: 8px; font-size: 0.8rem;
          background: var(--surface); border: 1px solid var(--border);
          color: var(--muted); cursor: pointer; text-align: left;
          transition: all 0.15s;
        }
        .mode-btn.active { background: var(--indigo-dim); border-color: var(--indigo); color: var(--indigo); font-weight: 600; }

        .criteria-list { display: flex; flex-direction: column; gap: 8px; }
        .criterion-row { display: flex; align-items: center; gap: 12px; }
        .criterion-name { width: 140px; font-size: 0.85rem; color: var(--text); flex-shrink: 0; }
        .weight-slider { flex: 1; accent-color: var(--indigo); }
        .criterion-val { width: 36px; font-size: 0.8rem; color: var(--muted); text-align: right; font-family: 'DM Mono', monospace; }
        .remove-crit { background: none; border: none; color: var(--dim); cursor: pointer; font-size: 0.75rem; }
        .remove-crit:hover { color: var(--red); }
        .add-crit-row { display: flex; gap: 8px; }
        .crit-input {
          flex: 1; padding: 8px 12px; border-radius: 8px;
          background: var(--surface); border: 1px solid var(--border);
          color: var(--text); font-family: inherit; font-size: 0.85rem;
        }
        .crit-input:focus { outline: none; border-color: var(--border-hover); }
        .add-crit-btn {
          padding: 8px 16px; border-radius: 8px; font-size: 0.85rem;
          background: var(--indigo-dim); border: 1px solid var(--indigo);
          color: var(--indigo); cursor: pointer; font-weight: 600;
        }
        .sample-crits { display: flex; flex-wrap: wrap; gap: 6px; }
        .sample-crit {
          padding: 4px 10px; border-radius: 6px; font-size: 0.75rem;
          background: none; border: 1px solid var(--border);
          color: var(--dim); cursor: pointer; transition: all 0.15s;
        }
        .sample-crit:hover { border-color: var(--indigo); color: var(--indigo); }

        .run-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 14px 32px; border-radius: 12px; font-weight: 700; font-size: 1rem;
          background: linear-gradient(135deg, var(--indigo), var(--violet));
          color: white; border: none; cursor: pointer;
          box-shadow: 0 0 30px rgba(99,102,241,0.3);
          transition: transform 0.2s, box-shadow 0.2s; align-self: flex-start;
        }
        .run-btn:hover { transform: translateY(-2px); box-shadow: 0 0 50px rgba(99,102,241,0.5); }
        .run-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        /* PIPELINE */
        .pipeline-viewer {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 16px; padding: 24px; max-width: 600px;
        }
        .pipeline-header {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.85rem; font-weight: 700; margin-bottom: 20px;
          color: var(--indigo);
        }
        .pipeline-row {
          display: flex; align-items: center; gap: 12px;
          padding: 8px 0; font-size: 0.875rem; color: var(--dim);
          position: relative; transition: color 0.3s;
        }
        .pipeline-row.done { color: var(--green); }
        .pipeline-row.running { color: var(--text); }
        .pip-icon { width: 16px; text-align: center; flex-shrink: 0; font-size: 0.75rem; }
        .pipeline-row.done .pip-icon { color: var(--green); }
        .pipeline-row.running .pip-icon { color: var(--indigo); }
        .pip-label { flex: 1; }
        .pip-detail { font-size: 0.7rem; color: var(--dim); }
        .pip-bar {
          position: absolute; bottom: 0; left: 28px; right: 0; height: 1px;
          background: linear-gradient(90deg, var(--indigo), transparent);
          transform-origin: left;
        }

        /* RESULTS */
        .results-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.5rem; }
        .results-eyebrow { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--green); margin-bottom: 4px; }
        .results-title { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.02em; }
        .export-btns { display: flex; gap: 8px; }
        .export-btn {
          padding: 8px 14px; border-radius: 8px; font-size: 0.8rem;
          background: var(--surface); border: 1px solid var(--border);
          color: var(--muted); cursor: pointer; transition: all 0.15s;
        }
        .export-btn:hover { border-color: var(--border-hover); color: var(--text); }

        .winner-card {
          display: flex; align-items: center; gap: 20px;
          padding: 24px; border-radius: 16px;
          background: rgba(16,185,129,0.06);
          border: 1px solid rgba(16,185,129,0.25);
          margin-bottom: 1.5rem;
        }
        .winner-trophy { font-size: 2.5rem; }
        .winner-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--green); }
        .winner-name { font-size: 1.3rem; font-weight: 800; margin: 4px 0; }
        .winner-reason { font-size: 0.8rem; color: var(--muted); }
        .winner-score { margin-left: auto; text-align: center; }
        .score-big { font-size: 3rem; font-weight: 900; color: var(--green); line-height: 1; }
        .score-label { font-size: 0.75rem; color: var(--muted); }

        .score-table { border-radius: 12px; overflow: hidden; border: 1px solid var(--border); margin-bottom: 1.5rem; }
        .score-table-header {
          display: grid; grid-template-columns: 160px repeat(2, 1fr);
          background: rgba(99,102,241,0.08); padding: 12px 16px;
          font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
          color: var(--muted);
        }
        .score-row {
          display: grid; grid-template-columns: 160px repeat(2, 1fr);
          padding: 12px 16px; border-top: 1px solid var(--border);
          align-items: center;
        }
        .crit-cell { font-size: 0.875rem; font-weight: 500; }
        .score-cell { display: flex; align-items: center; gap: 10px; }
        .score-bar-wrap { flex: 1; height: 6px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden; }
        .score-bar-fill { display: block; height: 100%; border-radius: 3px; }
        .score-num { font-size: 0.8rem; font-weight: 700; color: var(--text); width: 24px; text-align: right; }

        .trust-meter {
          padding: 20px; border-radius: 12px;
          background: var(--surface); border: 1px solid var(--border);
          margin-bottom: 1.5rem;
        }
        .trust-title { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); margin-bottom: 12px; }
        .trust-items { display: flex; gap: 2rem; flex-wrap: wrap; }
        .trust-item { display: flex; flex-direction: column; gap: 4px; }
        .trust-label { font-size: 0.75rem; color: var(--dim); }
        .trust-val { font-size: 1.2rem; font-weight: 800; }

        .followup-section { }
        .followup-label { font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); margin-bottom: 10px; }
        .followup-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .followup-chip {
          padding: 8px 14px; border-radius: 100px; font-size: 0.8rem;
          background: var(--surface); border: 1px solid var(--border);
          color: var(--muted); cursor: pointer; transition: all 0.15s;
        }
        .followup-chip:hover { border-color: var(--indigo); color: var(--indigo); background: var(--indigo-dim); }

        .no-results { text-align: center; padding: 4rem; color: var(--muted); }
      `}</style>
    </div>
  );
}
