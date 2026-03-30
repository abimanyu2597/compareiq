/**
 * CompareIQ AI — Typed API Client
 * All requests go through this module for consistent auth and error handling.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ─── Auth helpers ────────────────────────────────────────────────────────────
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("compareiq_token");
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Base fetch ───────────────────────────────────────────────────────────────
async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers as Record<string, string> || {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `API error ${res.status}`);
  }

  return res.json();
}

// ─── Types ────────────────────────────────────────────────────────────────────
export interface EntityInput {
  id: string;
  label: string;
  input_type: "text" | "pdf" | "url" | "image" | "audio";
  content?: string;
  file_path?: string;
}

export interface CriterionWeight {
  name: string;
  weight: number;
}

export interface CompareRequest {
  intent: string;
  entities: EntityInput[];
  criteria: CriterionWeight[];
  persona: string;
  decision_mode: string;
  enable_monitoring?: boolean;
}

export interface ComparisonStatus {
  id: string;
  status: "pending" | "running" | "done" | "error";
  current_step?: string;
  progress: number;
  error?: string;
}

export interface IngestResponse {
  file_id: string;
  input_type: string;
  filename: string;
  size_bytes: number;
  parsed_text_preview?: string;
  page_count?: number;
  duration_seconds?: number;
  status: "ok" | "error";
  message?: string;
}

export interface FollowUpResponse {
  answer: string;
  updated_scores?: unknown[];
  citations: unknown[];
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  name: string;
  email: string;
}

// ─── Compare ──────────────────────────────────────────────────────────────────
export const compareApi = {
  create: (req: CompareRequest) =>
    apiFetch<ComparisonStatus>("/compare/", { method: "POST", body: JSON.stringify(req) }),

  getStatus: (id: string) =>
    apiFetch<ComparisonStatus>(`/compare/${id}`),

  list: () =>
    apiFetch<ComparisonStatus[]>("/compare/"),

  /** Subscribe to SSE pipeline events */
  subscribeStatus: (id: string, onEvent: (data: Record<string, unknown>) => void): EventSource => {
    const token = getToken();
    const url = `${API_BASE}/compare/${id}/status${token ? `?token=${token}` : ""}`;
    const es = new EventSource(url);
    es.onmessage = (e) => {
      try {
        onEvent(JSON.parse(e.data));
      } catch { /* ignore parse errors */ }
    };
    return es;
  },
};

// ─── Ingest ───────────────────────────────────────────────────────────────────
export const ingestApi = {
  pdf: async (file: File): Promise<IngestResponse> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${API_BASE}/ingest/pdf`, {
      method: "POST",
      headers: authHeaders(),
      body: fd,
    });
    return res.json();
  },

  url: async (url: string): Promise<IngestResponse> => {
    const fd = new FormData();
    fd.append("url", url);
    const res = await fetch(`${API_BASE}/ingest/url`, {
      method: "POST",
      headers: authHeaders(),
      body: fd,
    });
    return res.json();
  },

  audio: async (file: File): Promise<IngestResponse> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${API_BASE}/ingest/audio`, {
      method: "POST",
      headers: authHeaders(),
      body: fd,
    });
    return res.json();
  },

  image: async (file: File): Promise<IngestResponse> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${API_BASE}/ingest/image`, {
      method: "POST",
      headers: authHeaders(),
      body: fd,
    });
    return res.json();
  },
};

// ─── Chat ─────────────────────────────────────────────────────────────────────
export const chatApi = {
  followUp: (comparisonId: string, question: string) =>
    apiFetch<FollowUpResponse>("/chat/followup", {
      method: "POST",
      body: JSON.stringify({ comparison_id: comparisonId, question }),
    }),
};

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (email: string, password: string, name: string) =>
    apiFetch<TokenResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    }),

  login: async (email: string, password: string): Promise<TokenResponse> => {
    const fd = new URLSearchParams();
    fd.append("username", email);
    fd.append("password", password);
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: fd.toString(),
    });
    if (!res.ok) throw new Error("Invalid credentials");
    return res.json();
  },

  me: () => apiFetch<{ id: string; name: string; email: string }>("/auth/me"),
};

// ─── Export ───────────────────────────────────────────────────────────────────
export const exportApi = {
  markdown: (id: string) => `${API_BASE}/export/${id}/markdown`,
  pdf: (id: string) => `${API_BASE}/export/${id}/pdf`,
  executive: (id: string) => `${API_BASE}/export/${id}/executive`,
};
