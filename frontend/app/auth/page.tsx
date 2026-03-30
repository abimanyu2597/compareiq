"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { authApi } from "@/lib/api/client";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = mode === "login"
        ? await authApi.login(email, password)
        : await authApi.register(email, password, name);
      localStorage.setItem("compareiq_token", res.access_token);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-glow g1" />
        <div className="auth-glow g2" />
      </div>

      <div className="auth-card-wrap">
        <motion.div className="auth-card" initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
          <Link href="/" className="auth-logo">
            <span className="logo-mark">◈</span>
            <span className="logo-text">CompareIQ</span>
            <span className="logo-ai">AI</span>
          </Link>

          <h1 className="auth-title">
            {mode === "login" ? "Welcome back" : "Get started"}
          </h1>
          <p className="auth-sub">
            {mode === "login"
              ? "Sign in to your CompareIQ workspace"
              : "Create your decision intelligence account"}
          </p>

          <div className="auth-tabs">
            <button className={`auth-tab ${mode === "login" ? "active" : ""}`} onClick={() => setMode("login")}>Sign in</button>
            <button className={`auth-tab ${mode === "register" ? "active" : ""}`} onClick={() => setMode("register")}>Register</button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {mode === "register" && (
                <motion.div key="name-field" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <div className="form-field">
                    <label className="field-label">Full name</label>
                    <input className="field-input" type="text" placeholder="Raja Abimanyu N" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="form-field">
              <label className="field-label">Email</label>
              <input className="field-input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="form-field">
              <label className="field-label">Password</label>
              <input className="field-input" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            </div>

            {error && (
              <div className="auth-error">⚠ {error}</div>
            )}

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? <><span className="spin" /> {mode === "login" ? "Signing in…" : "Creating account…"}</> : mode === "login" ? "Sign in →" : "Create account →"}
            </button>
          </form>

          <div className="auth-demo">
            <span className="demo-label">Demo credentials</span>
            <button className="demo-fill" onClick={() => { setEmail("demo@compareiq.ai"); setPassword("demo12345"); }}>
              Use demo account
            </button>
          </div>
        </motion.div>

        <div className="auth-footer">
          Created by <span className="creator">Raja Abimanyu N</span> · Data Scientist | AI &amp; Applied Machine Learning
        </div>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          background: var(--bg); position: relative; overflow: hidden;
        }
        .auth-bg { position: absolute; inset: 0; pointer-events: none; }
        .auth-glow {
          position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none;
        }
        .g1 { width: 500px; height: 500px; top: -100px; left: -100px; background: radial-gradient(ellipse, rgba(99,102,241,0.2) 0%, transparent 70%); }
        .g2 { width: 400px; height: 400px; bottom: -100px; right: -100px; background: radial-gradient(ellipse, rgba(139,92,246,0.15) 0%, transparent 70%); }

        .auth-card-wrap { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 16px; }
        .auth-card {
          width: 420px; padding: 36px;
          background: rgba(15, 20, 40, 0.85);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 20px;
          backdrop-filter: blur(24px);
          box-shadow: 0 20px 80px rgba(0,0,0,0.5);
        }
        .auth-logo {
          display: flex; align-items: center; gap: 8px;
          text-decoration: none; color: var(--text); margin-bottom: 24px;
          font-weight: 700; font-size: 1rem;
        }
        .logo-mark { font-size: 1.3rem; color: var(--indigo); }
        .logo-ai {
          font-size: 0.6rem; font-weight: 700;
          background: linear-gradient(135deg, var(--indigo), var(--cyan));
          padding: 2px 6px; border-radius: 4px; color: white;
        }
        .auth-title { font-size: 1.6rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 6px; }
        .auth-sub { font-size: 0.875rem; color: var(--muted); margin-bottom: 24px; }

        .auth-tabs {
          display: flex; gap: 4px; background: rgba(0,0,0,0.2);
          border-radius: 10px; padding: 4px; margin-bottom: 24px;
        }
        .auth-tab {
          flex: 1; padding: 8px; border-radius: 8px; border: none;
          font-size: 0.875rem; font-weight: 600; cursor: pointer;
          background: none; color: var(--muted); transition: all 0.2s;
        }
        .auth-tab.active { background: rgba(99,102,241,0.2); color: var(--indigo); }

        .auth-form { display: flex; flex-direction: column; gap: 14px; }
        .form-field { display: flex; flex-direction: column; gap: 6px; overflow: hidden; }
        .field-label { font-size: 0.8rem; font-weight: 600; color: var(--muted); }
        .field-input {
          padding: 10px 14px; border-radius: 10px;
          background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.08);
          color: var(--text); font-family: inherit; font-size: 0.9rem;
          transition: border-color 0.2s;
        }
        .field-input:focus { outline: none; border-color: var(--indigo); }
        .field-input::placeholder { color: var(--dim); }
        .auth-error {
          padding: 10px 14px; border-radius: 8px;
          background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3);
          color: var(--red); font-size: 0.825rem;
        }
        .auth-submit {
          padding: 12px; border-radius: 10px; border: none; cursor: pointer;
          font-weight: 700; font-size: 0.95rem; color: white;
          background: linear-gradient(135deg, var(--indigo), var(--violet));
          box-shadow: 0 0 30px rgba(99,102,241,0.3);
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: opacity 0.2s, transform 0.2s; margin-top: 4px;
        }
        .auth-submit:hover { opacity: 0.92; transform: translateY(-1px); }
        .auth-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .spin {
          width: 14px; height: 14px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
          animation: spin 0.7s linear infinite; display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .auth-demo {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 16px; padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .demo-label { font-size: 0.775rem; color: var(--dim); }
        .demo-fill {
          font-size: 0.775rem; color: var(--indigo); background: none;
          border: 1px solid rgba(99,102,241,0.3); padding: 4px 10px;
          border-radius: 6px; cursor: pointer; transition: background 0.2s;
        }
        .demo-fill:hover { background: rgba(99,102,241,0.1); }

        .auth-footer {
          font-size: 0.75rem; color: var(--dim); text-align: center;
        }
        .creator { color: var(--indigo); font-weight: 600; }
      `}</style>
    </div>
  );
}
