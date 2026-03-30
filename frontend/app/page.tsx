"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

const FEATURES = [
  {
    icon: "⚡",
    title: "Real-Time Intelligence",
    desc: "Watch AI agents work live — ingestion, extraction, scoring, and synthesis streaming in parallel.",
  },
  {
    icon: "🔍",
    title: "Multimodal Inputs",
    desc: "Compare PDFs, URLs, images, audio, and raw text. Any format, any source, unified analysis.",
  },
  {
    icon: "⚖️",
    title: "Weighted Scoring Engine",
    desc: "Define what matters to you. Our scoring engine respects your priorities, not generic defaults.",
  },
  {
    icon: "🧠",
    title: "Contradiction Detection",
    desc: "Conflicting claims across sources get flagged automatically — with source attribution and confidence.",
  },
  {
    icon: "🎭",
    title: "Persona-Aware Analysis",
    desc: "Student, investor, developer, traveler — your persona shapes the lens of every recommendation.",
  },
  {
    icon: "📡",
    title: "Live Monitoring",
    desc: "Set alerts for price changes, policy updates, or content diffs. Get notified the moment things shift.",
  },
];

const USE_CASES = [
  { label: "MacBook Pro vs Dell XPS 15", tag: "Product" },
  { label: "Canada vs Germany for Data Scientists", tag: "Country" },
  { label: "Contract A vs Contract B", tag: "Document" },
  { label: "Audio Pitch vs Investor Deck", tag: "Cross-Modal" },
  { label: "Resume vs Job Description", tag: "Fit Analysis" },
  { label: "OpenAI vs Anthropic API Pricing", tag: "Vendor" },
];

const PIPELINE_STEPS = [
  "Ingesting inputs",
  "Parsing content",
  "Extracting facts",
  "Normalizing fields",
  "Retrieving evidence",
  "Scoring entities",
  "Generating recommendation",
  "Report ready ✓",
];

const AGENTS = [
  { name: "Intent Agent", color: "#6366f1", desc: "Understands goal, infers criteria" },
  { name: "Ingestion Agent", color: "#8b5cf6", desc: "Parses text, PDF, URL, audio, image" },
  { name: "Extraction Agent", color: "#06b6d4", desc: "Converts sources to structured JSON" },
  { name: "Normalization Agent", color: "#10b981", desc: "Standardizes units, currencies, dates" },
  { name: "Evidence Agent", color: "#f59e0b", desc: "Retrieves source-grounded snippets" },
  { name: "Scoring Agent", color: "#ef4444", desc: "Weighted scoring with explainability" },
  { name: "Contradiction Agent", color: "#ec4899", desc: "Detects conflicts across sources" },
  { name: "Recommendation Agent", color: "#6366f1", desc: "Final verdict tailored to persona" },
];

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let frame = 0;
    const total = 60;
    const timer = setInterval(() => {
      frame++;
      setCount(Math.round(target * (frame / total)));
      if (frame >= total) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [started, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function PipelineDemo() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % PIPELINE_STEPS.length), 900);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="pipeline-demo">
      {PIPELINE_STEPS.map((step, i) => (
        <div key={step} className={`pipeline-step ${i < active ? "done" : i === active ? "active" : ""}`}>
          <span className="step-dot">{i < active ? "✓" : i === active ? "◉" : "○"}</span>
          <span className="step-label">{step}</span>
          {i === active && (
            <motion.div className="step-bar" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.85 }} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <div className="land">
      {/* NAV */}
      <nav className="land-nav">
        <div className="nav-logo">
          <span className="logo-mark">◈</span>
          <span className="logo-text">CompareIQ</span>
          <span className="logo-badge">AI</span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#agents">Architecture</a>
          <a href="#usecases">Use Cases</a>
        </div>
        <div className="nav-cta">
          <Link href="/auth" className="btn-ghost">Sign in</Link>
          <Link href="/compare" className="btn-primary">Start Comparing →</Link>
        </div>
      </nav>

      {/* HERO */}
      <motion.section className="hero" style={{ y: heroY, opacity: heroOpacity }}>
        <div className="hero-glow glow-1" />
        <div className="hero-glow glow-2" />
        <div className="hero-glow glow-3" />
        <div className="noise-overlay" />

        <motion.div className="hero-content" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
          <motion.div className="hero-eyebrow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <span className="eyebrow-dot" />
            Real-time · Multimodal · Explainable AI
          </motion.div>

          <h1 className="hero-title">
            <span className="title-line">Compare anything.</span>
            <span className="title-line gradient-text">Decide faster.</span>
          </h1>

          <p className="hero-sub">
            CompareIQ AI is a decision intelligence platform that ingests PDFs, URLs, audio, and images — then applies multi-agent AI to extract, score, and recommend with full evidence grounding.
          </p>

          <div className="hero-actions">
            <Link href="/compare" className="btn-hero-primary">
              <span>Start a Comparison</span>
              <span className="btn-arrow">→</span>
            </Link>
            <Link href="/dashboard" className="btn-hero-ghost">View Dashboard</Link>
          </div>

          <div className="hero-trust">
            <span className="trust-item"><span className="trust-dot green" />Groq-powered extraction</span>
            <span className="trust-sep">·</span>
            <span className="trust-item"><span className="trust-dot blue" />OpenAI deep reasoning</span>
            <span className="trust-sep">·</span>
            <span className="trust-item"><span className="trust-dot violet" />LangGraph orchestration</span>
          </div>
        </motion.div>

        {/* Pipeline demo card */}
        <motion.div className="hero-demo-card" initial={{ opacity: 0, y: 60, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}>
          <div className="demo-card-header">
            <div className="demo-dots">
              <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
            </div>
            <span className="demo-title">Live Pipeline — MacBook Pro M4 vs Dell XPS 15</span>
          </div>
          <PipelineDemo />
          <div className="demo-result-preview">
            <div className="result-item winner">
              <span className="result-label">🏆 Winner</span>
              <span className="result-value">MacBook Pro M4</span>
              <span className="result-score">92 / 100</span>
            </div>
            <div className="result-item">
              <span className="result-label">Contender</span>
              <span className="result-value">Dell XPS 15</span>
              <span className="result-score">78 / 100</span>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* STATS */}
      <section className="stats-strip">
        {[
          { n: 11, s: " agents", label: "Specialized AI Agents" },
          { n: 5, s: " modes", label: "Input Types Supported" },
          { n: 8, s: " domains", label: "Comparison Domains" },
          { n: 100, s: "%", label: "Evidence-Grounded" },
        ].map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-num"><AnimatedCounter target={stat.n} suffix={stat.s} /></div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* USE CASES */}
      <section className="section use-cases" id="usecases">
        <div className="section-label">What you can compare</div>
        <h2 className="section-title">Any input. Any domain.</h2>
        <div className="use-case-grid">
          {USE_CASES.map((uc, i) => (
            <motion.div key={uc.label} className="use-case-card" whileHover={{ y: -4, borderColor: "rgba(99,102,241,0.6)" }} transition={{ duration: 0.2 }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} custom={i}>
              <span className="uc-tag">{uc.tag}</span>
              <span className="uc-label">{uc.label}</span>
              <span className="uc-arrow">↗</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="section features" id="features">
        <div className="section-label">Core capabilities</div>
        <h2 className="section-title">Decision intelligence,<br />built for depth.</h2>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} className="feature-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.5 }} whileHover={{ y: -6 }}>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AGENT ARCHITECTURE */}
      <section className="section agents" id="agents">
        <div className="section-label">Multi-Agent System</div>
        <h2 className="section-title">Eleven specialized agents.<br />One unified decision.</h2>
        <div className="agents-grid">
          {AGENTS.map((agent, i) => (
            <motion.div key={agent.name} className="agent-card" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} whileHover={{ scale: 1.03 }}>
              <div className="agent-color-bar" style={{ background: agent.color }} />
              <div className="agent-info">
                <div className="agent-name">{agent.name}</div>
                <div className="agent-desc">{agent.desc}</div>
              </div>
              <div className="agent-indicator" style={{ background: agent.color }} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* OUTPUT PREVIEW */}
      <section className="section output-preview">
        <div className="section-label">What you get</div>
        <h2 className="section-title">Every comparison ships with<br />enterprise-grade output.</h2>
        <div className="output-cards">
          {[
            { icon: "📋", title: "Executive Summary", desc: "Crisp, decision-ready narrative for stakeholders" },
            { icon: "📊", title: "Side-by-Side Table", desc: "Attribute-level comparison with evidence citations" },
            { icon: "🏅", title: "Weighted Scoring", desc: "Explainable scores per criterion with your weights" },
            { icon: "⚠️", title: "Contradiction Report", desc: "Flagged conflicts with source attribution" },
            { icon: "🎯", title: "Winner Recommendation", desc: "Persona-aware final verdict with rationale" },
            { icon: "📤", title: "Export Ready", desc: "PDF, Markdown, and executive report formats" },
          ].map((o, i) => (
            <motion.div key={o.title} className="output-card" initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <span className="output-icon">{o.icon}</span>
              <div>
                <div className="output-title">{o.title}</div>
                <div className="output-desc">{o.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-glow" />
        <motion.div className="cta-content" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="cta-title">Stop guessing.<br />Start comparing.</h2>
          <p className="cta-sub">Upload any two things. Get a structured, evidence-grounded, AI-powered decision in seconds.</p>
          <Link href="/compare" className="btn-cta">Launch CompareIQ AI →</Link>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="land-footer">
        <div className="footer-logo">
          <span className="logo-mark">◈</span>
          <span>CompareIQ AI</span>
        </div>
        <div className="footer-creator">
          Created by <span className="creator-name">Raja Abimanyu N</span>
          <span className="creator-title">Data Scientist | AI &amp; Applied Machine Learning</span>
        </div>
        <div className="footer-links">
          <a href="#features">Features</a>
          <a href="#agents">Architecture</a>
          <Link href="/auth">Sign in</Link>
        </div>
      </footer>

      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --bg: #030712;
          --surface: rgba(15, 20, 40, 0.7);
          --border: rgba(99, 102, 241, 0.15);
          --border-hover: rgba(99, 102, 241, 0.5);
          --indigo: #6366f1;
          --violet: #8b5cf6;
          --cyan: #06b6d4;
          --green: #10b981;
          --text: #f1f5f9;
          --muted: #94a3b8;
          --dim: #475569;
        }

        html { scroll-behavior: smooth; }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'DM Sans', 'Outfit', 'Helvetica Neue', sans-serif;
          overflow-x: hidden;
        }

        .land { min-height: 100vh; }

        /* NAV */
        .land-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 2rem; height: 64px;
          background: rgba(3, 7, 18, 0.8);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
        }
        .nav-logo { display: flex; align-items: center; gap: 8px; }
        .logo-mark { font-size: 1.4rem; color: var(--indigo); }
        .logo-text { font-size: 1.1rem; font-weight: 700; letter-spacing: -0.02em; }
        .logo-badge {
          font-size: 0.6rem; font-weight: 700; letter-spacing: 0.1em;
          background: linear-gradient(135deg, var(--indigo), var(--cyan));
          padding: 2px 6px; border-radius: 4px; color: white;
        }
        .nav-links { display: flex; gap: 2rem; }
        .nav-links a {
          font-size: 0.875rem; color: var(--muted); text-decoration: none;
          transition: color 0.2s;
        }
        .nav-links a:hover { color: var(--text); }
        .nav-cta { display: flex; gap: 12px; align-items: center; }
        .btn-ghost {
          font-size: 0.875rem; color: var(--muted); text-decoration: none;
          padding: 6px 14px; border-radius: 8px; transition: color 0.2s;
        }
        .btn-ghost:hover { color: var(--text); }
        .btn-primary {
          font-size: 0.875rem; font-weight: 600; text-decoration: none;
          padding: 8px 18px; border-radius: 8px; color: white;
          background: linear-gradient(135deg, var(--indigo), var(--violet));
          transition: opacity 0.2s, transform 0.2s;
        }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }

        /* HERO */
        .hero {
          min-height: 100vh;
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; text-align: center;
          padding: 120px 2rem 80px;
          position: relative; overflow: hidden;
          gap: 3rem;
        }
        .hero-glow {
          position: absolute; border-radius: 50%;
          filter: blur(80px); pointer-events: none;
        }
        .glow-1 {
          width: 600px; height: 400px;
          background: radial-gradient(ellipse, rgba(99,102,241,0.25) 0%, transparent 70%);
          top: 10%; left: 20%;
        }
        .glow-2 {
          width: 400px; height: 400px;
          background: radial-gradient(ellipse, rgba(139,92,246,0.2) 0%, transparent 70%);
          top: 30%; right: 10%;
        }
        .glow-3 {
          width: 500px; height: 300px;
          background: radial-gradient(ellipse, rgba(6,182,212,0.15) 0%, transparent 70%);
          bottom: 20%; left: 30%;
        }
        .noise-overlay {
          position: absolute; inset: 0; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          opacity: 0.4;
        }
        .hero-content { max-width: 760px; position: relative; z-index: 2; }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 0.8rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--indigo); margin-bottom: 1.5rem;
          padding: 6px 14px; border: 1px solid rgba(99,102,241,0.3);
          border-radius: 100px; background: rgba(99,102,241,0.08);
        }
        .eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--indigo); animation: pulse 2s infinite;
        }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        .hero-title {
          font-size: clamp(3rem, 7vw, 5.5rem);
          font-weight: 800; line-height: 1.05;
          letter-spacing: -0.03em; margin-bottom: 1.5rem;
        }
        .title-line { display: block; }
        .gradient-text {
          background: linear-gradient(135deg, var(--indigo) 0%, var(--violet) 40%, var(--cyan) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-sub {
          font-size: 1.1rem; color: var(--muted); line-height: 1.7;
          max-width: 580px; margin: 0 auto 2rem;
        }
        .hero-actions { display: flex; gap: 1rem; justify-content: center; margin-bottom: 1.5rem; }
        .btn-hero-primary {
          display: flex; align-items: center; gap: 8px;
          padding: 14px 28px; border-radius: 12px; font-weight: 700;
          font-size: 1rem; text-decoration: none; color: white;
          background: linear-gradient(135deg, var(--indigo), var(--violet));
          box-shadow: 0 0 40px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.15);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-hero-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 60px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.15);
        }
        .btn-arrow { transition: transform 0.2s; }
        .btn-hero-primary:hover .btn-arrow { transform: translateX(4px); }
        .btn-hero-ghost {
          padding: 14px 28px; border-radius: 12px; font-weight: 600;
          font-size: 1rem; text-decoration: none; color: var(--text);
          border: 1px solid var(--border); background: var(--surface);
          backdrop-filter: blur(10px); transition: border-color 0.2s, background 0.2s;
        }
        .btn-hero-ghost:hover { border-color: var(--border-hover); background: rgba(99,102,241,0.1); }
        .hero-trust {
          display: flex; align-items: center; justify-content: center;
          gap: 12px; font-size: 0.8rem; color: var(--dim);
        }
        .trust-item { display: flex; align-items: center; gap: 6px; }
        .trust-dot {
          width: 6px; height: 6px; border-radius: 50%;
        }
        .trust-dot.green { background: var(--green); }
        .trust-dot.blue { background: var(--cyan); }
        .trust-dot.violet { background: var(--violet); }
        .trust-sep { color: var(--dim); }

        /* DEMO CARD */
        .hero-demo-card {
          width: 100%; max-width: 580px; position: relative; z-index: 2;
          background: rgba(15, 20, 40, 0.85);
          border: 1px solid rgba(99,102,241,0.25);
          border-radius: 16px;
          backdrop-filter: blur(20px);
          box-shadow: 0 20px 80px rgba(0,0,0,0.5), 0 0 40px rgba(99,102,241,0.1);
          overflow: hidden;
        }
        .demo-card-header {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(99,102,241,0.1);
          background: rgba(99,102,241,0.05);
        }
        .demo-dots { display: flex; gap: 6px; }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .dot.red { background: #ef4444; }
        .dot.yellow { background: #f59e0b; }
        .dot.green { background: var(--green); }
        .demo-title { font-size: 0.75rem; color: var(--muted); font-weight: 500; }
        .pipeline-demo { padding: 16px; display: flex; flex-direction: column; gap: 6px; }
        .pipeline-step {
          display: flex; align-items: center; gap: 10px;
          font-size: 0.8rem; color: var(--dim);
          position: relative; padding: 4px 0;
          transition: color 0.3s;
        }
        .pipeline-step.done { color: var(--green); }
        .pipeline-step.active { color: var(--text); }
        .step-dot { width: 16px; text-align: center; font-size: 0.7rem; flex-shrink: 0; }
        .pipeline-step.done .step-dot { color: var(--green); }
        .pipeline-step.active .step-dot { color: var(--indigo); }
        .step-label { flex: 1; text-align: left; }
        .step-bar {
          position: absolute; bottom: 0; left: 26px; right: 0; height: 1px;
          background: linear-gradient(90deg, var(--indigo), transparent);
          transform-origin: left;
        }
        .demo-result-preview {
          display: flex; gap: 12px; padding: 12px 16px;
          border-top: 1px solid rgba(99,102,241,0.1);
          background: rgba(16, 185, 129, 0.04);
        }
        .result-item {
          flex: 1; display: flex; flex-direction: column; gap: 2px;
          padding: 8px 12px; border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.02);
        }
        .result-item.winner { border-color: rgba(16,185,129,0.3); background: rgba(16,185,129,0.08); }
        .result-label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--dim); }
        .result-item.winner .result-label { color: var(--green); }
        .result-value { font-size: 0.85rem; font-weight: 600; color: var(--text); }
        .result-score { font-size: 0.75rem; font-weight: 700; color: var(--muted); }
        .result-item.winner .result-score { color: var(--green); }

        /* STATS */
        .stats-strip {
          display: flex; justify-content: center; gap: 0;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          background: rgba(99,102,241,0.04);
        }
        .stat-card {
          flex: 1; max-width: 220px;
          padding: 2.5rem 2rem; text-align: center;
          border-right: 1px solid var(--border);
        }
        .stat-card:last-child { border-right: none; }
        .stat-num {
          font-size: 2.5rem; font-weight: 800; letter-spacing: -0.03em;
          background: linear-gradient(135deg, var(--indigo), var(--cyan));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .stat-label { font-size: 0.8rem; color: var(--muted); margin-top: 4px; }

        /* SECTIONS */
        .section { padding: 100px 2rem; max-width: 1200px; margin: 0 auto; }
        .section-label {
          font-size: 0.7rem; font-weight: 600; letter-spacing: 0.15em;
          text-transform: uppercase; color: var(--indigo); margin-bottom: 1rem;
        }
        .section-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800; letter-spacing: -0.02em; line-height: 1.1;
          margin-bottom: 3rem;
        }

        /* USE CASES */
        .use-case-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 12px;
        }
        .use-case-card {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 20px; border-radius: 12px;
          background: var(--surface);
          border: 1px solid var(--border);
          cursor: pointer; transition: border-color 0.2s, background 0.2s;
        }
        .uc-tag {
          font-size: 0.7rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.08em; color: var(--indigo);
          background: rgba(99,102,241,0.1); padding: 3px 8px; border-radius: 100px;
          flex-shrink: 0;
        }
        .uc-label { font-size: 0.9rem; font-weight: 500; color: var(--text); flex: 1; padding: 0 12px; }
        .uc-arrow { color: var(--dim); font-size: 1rem; }

        /* FEATURES */
        .features-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 16px;
        }
        .feature-card {
          padding: 28px; border-radius: 16px;
          background: var(--surface);
          border: 1px solid var(--border);
          backdrop-filter: blur(10px);
          transition: border-color 0.2s, transform 0.2s;
          cursor: default;
        }
        .feature-card:hover { border-color: var(--border-hover); }
        .feature-icon { font-size: 2rem; margin-bottom: 16px; display: block; }
        .feature-title { font-size: 1.05rem; font-weight: 700; margin-bottom: 8px; }
        .feature-desc { font-size: 0.875rem; color: var(--muted); line-height: 1.6; }

        /* AGENTS */
        .agents { background: rgba(99,102,241,0.02); border-radius: 24px; }
        .agents-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 12px;
        }
        .agent-card {
          display: flex; align-items: center; gap: 14px;
          padding: 16px; border-radius: 12px;
          background: var(--surface);
          border: 1px solid var(--border);
          transition: transform 0.2s, border-color 0.2s;
          overflow: hidden; position: relative;
        }
        .agent-color-bar { width: 3px; height: 36px; border-radius: 2px; flex-shrink: 0; }
        .agent-name { font-size: 0.9rem; font-weight: 600; color: var(--text); }
        .agent-desc { font-size: 0.75rem; color: var(--muted); margin-top: 2px; }
        .agent-info { flex: 1; }
        .agent-indicator {
          width: 6px; height: 6px; border-radius: 50%;
          opacity: 0.7; flex-shrink: 0;
          animation: pulse 2s infinite;
        }

        /* OUTPUT */
        .output-cards {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 16px;
        }
        .output-card {
          display: flex; align-items: flex-start; gap: 16px;
          padding: 24px; border-radius: 14px;
          background: var(--surface);
          border: 1px solid var(--border);
        }
        .output-icon { font-size: 1.8rem; flex-shrink: 0; margin-top: 2px; }
        .output-title { font-size: 0.95rem; font-weight: 700; margin-bottom: 4px; }
        .output-desc { font-size: 0.8rem; color: var(--muted); line-height: 1.5; }

        /* CTA */
        .cta-section {
          text-align: center; padding: 120px 2rem;
          position: relative; overflow: hidden;
          border-top: 1px solid var(--border);
        }
        .cta-glow {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 700px; height: 400px;
          background: radial-gradient(ellipse, rgba(99,102,241,0.2) 0%, transparent 70%);
          pointer-events: none;
        }
        .cta-content { position: relative; z-index: 2; }
        .cta-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800; letter-spacing: -0.03em; line-height: 1.05;
          margin-bottom: 1.5rem;
        }
        .cta-sub {
          font-size: 1.05rem; color: var(--muted); max-width: 500px;
          margin: 0 auto 2.5rem; line-height: 1.7;
        }
        .btn-cta {
          display: inline-flex; align-items: center;
          padding: 16px 36px; border-radius: 14px; font-weight: 700;
          font-size: 1.1rem; text-decoration: none; color: white;
          background: linear-gradient(135deg, var(--indigo), var(--violet));
          box-shadow: 0 0 60px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.15);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 0 80px rgba(99,102,241,0.6), inset 0 1px 0 rgba(255,255,255,0.15);
        }

        /* FOOTER */
        .land-footer {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 1rem;
          padding: 2rem; border-top: 1px solid var(--border);
          background: rgba(3,7,18,0.9);
        }
        .footer-logo {
          display: flex; align-items: center; gap: 8px;
          font-weight: 700; font-size: 1rem;
        }
        .footer-creator {
          display: flex; flex-direction: column; gap: 2px;
          font-size: 0.8rem; color: var(--dim); text-align: center;
        }
        .creator-name { color: var(--indigo); font-weight: 600; }
        .creator-title { font-size: 0.7rem; }
        .footer-links {
          display: flex; gap: 1.5rem;
        }
        .footer-links a {
          font-size: 0.8rem; color: var(--dim); text-decoration: none;
          transition: color 0.2s;
        }
        .footer-links a:hover { color: var(--text); }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .stats-strip { flex-wrap: wrap; }
          .stat-card { border-right: none; border-bottom: 1px solid var(--border); min-width: 150px; }
          .land-footer { flex-direction: column; align-items: center; text-align: center; }
        }
      `}</style>
    </div>
  );
}
