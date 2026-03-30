/**
 * CompareIQ AI — Custom React Hooks
 */

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { compareApi, ingestApi, type ComparisonStatus, type IngestResponse } from "@/lib/api/client";
import { usePipeline } from "@/store/appStore";

// ─── Hook: SSE Pipeline Stream ────────────────────────────────────────────────
export interface PipelineEvent {
  event: string;
  step?: string;
  detail?: string;
  status?: string;
  progress?: number;
  current_step?: string;
  data?: Record<string, unknown>;
}

export function useComparisonStream(jobId: string | null) {
  const [events, setEvents] = useState<PipelineEvent[]>([]);
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const esRef = useRef<EventSource | null>(null);
  const { updateStep } = usePipeline();

  useEffect(() => {
    if (!jobId) return;
    setStatus("running");
    esRef.current = compareApi.subscribeStatus(jobId, (data) => {
      const ev = data as PipelineEvent;
      setEvents((prev) => [...prev, ev]);

      if (ev.progress !== undefined) setProgress(ev.progress);
      if (ev.current_step) setCurrentStep(ev.current_step);

      if (ev.event === "step_start" && ev.step) {
        updateStep(ev.step, "running");
      }
      if (ev.event === "step_done" && ev.step) {
        updateStep(ev.step, "done");
      }
      if (ev.event === "step_error" && ev.step) {
        updateStep(ev.step, "error");
      }
      if (ev.event === "comparison_done") {
        setStatus("done");
        setProgress(1);
        esRef.current?.close();
      }
      if (ev.event === "comparison_error") {
        setStatus("error");
        esRef.current?.close();
      }
    });

    return () => {
      esRef.current?.close();
    };
  }, [jobId, updateStep]);

  return { events, status, progress, currentStep };
}

// ─── Hook: Comparison Poller (fallback if SSE unavailable) ────────────────────
export function useComparisonPoller(jobId: string | null, interval = 2000) {
  const [status, setStatus] = useState<ComparisonStatus | null>(null);

  useEffect(() => {
    if (!jobId) return;
    const timer = setInterval(async () => {
      try {
        const s = await compareApi.getStatus(jobId);
        setStatus(s);
        if (s.status === "done" || s.status === "error") clearInterval(timer);
      } catch { clearInterval(timer); }
    }, interval);
    return () => clearInterval(timer);
  }, [jobId, interval]);

  return status;
}

// ─── Hook: File Upload with Progress ─────────────────────────────────────────
interface UploadState {
  uploading: boolean;
  result: IngestResponse | null;
  error: string | null;
  progress: number;
}

export function useFileUpload() {
  const [state, setState] = useState<UploadState>({
    uploading: false, result: null, error: null, progress: 0,
  });

  const upload = useCallback(async (file: File, type: "pdf" | "image" | "audio") => {
    setState({ uploading: true, result: null, error: null, progress: 0 });
    try {
      setState((s) => ({ ...s, progress: 30 }));
      const fn = type === "pdf" ? ingestApi.pdf : type === "image" ? ingestApi.image : ingestApi.audio;
      const result = await fn(file);
      setState({ uploading: false, result, error: null, progress: 100 });
      return result;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setState({ uploading: false, result: null, error: msg, progress: 0 });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ uploading: false, result: null, error: null, progress: 0 });
  }, []);

  return { ...state, upload, reset };
}

// ─── Hook: URL Ingest ─────────────────────────────────────────────────────────
export function useUrlIngest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IngestResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ingest = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await ingestApi.url(url);
      setResult(res);
      return res;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "URL fetch failed";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, result, error, ingest };
}

// ─── Hook: Debounce ───────────────────────────────────────────────────────────
export function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ─── Hook: Copy to clipboard ─────────────────────────────────────────────────
export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* silently fail */ }
  }, []);
  return { copied, copy };
}

// ─── Hook: Intersection Observer (for animations) ─────────────────────────────
export function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}
