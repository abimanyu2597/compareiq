/**
 * CompareIQ AI — Zustand Global Store
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Types ────────────────────────────────────────────────────────────────────
interface User {
  id: string;
  name: string;
  email: string;
}

interface ComparisonJob {
  id: string;
  status: "pending" | "running" | "done" | "error";
  progress: number;
  currentStep?: string;
  intent: string;
  createdAt: string;
  result?: Record<string, unknown>;
}

interface PipelineStep {
  id: string;
  label: string;
  status: "pending" | "running" | "done" | "error";
}

interface UIState {
  sidebarOpen: boolean;
  theme: "dark" | "midnight" | "deep-purple";
}

interface AppState {
  // Auth
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;

  // Comparisons
  comparisons: ComparisonJob[];
  activeJobId: string | null;
  pipelineSteps: PipelineStep[];
  addComparison: (job: ComparisonJob) => void;
  updateComparison: (id: string, updates: Partial<ComparisonJob>) => void;
  setActiveJob: (id: string | null) => void;
  setPipelineSteps: (steps: PipelineStep[]) => void;
  updatePipelineStep: (id: string, status: PipelineStep["status"]) => void;

  // UI
  ui: UIState;
  setTheme: (theme: UIState["theme"]) => void;
  toggleSidebar: () => void;
}

// ─── Initial pipeline steps ───────────────────────────────────────────────────
const INITIAL_STEPS: PipelineStep[] = [
  { id: "ingest", label: "Ingesting inputs", status: "pending" },
  { id: "parse", label: "Parsing content", status: "pending" },
  { id: "extract", label: "Extracting structured facts", status: "pending" },
  { id: "normalize", label: "Normalizing fields & units", status: "pending" },
  { id: "evidence", label: "Retrieving evidence snippets", status: "pending" },
  { id: "compare", label: "Building comparison matrix", status: "pending" },
  { id: "contradict", label: "Running contradiction check", status: "pending" },
  { id: "score", label: "Scoring entities", status: "pending" },
  { id: "recommend", label: "Generating recommendation", status: "pending" },
  { id: "report", label: "Building final report", status: "pending" },
];

// ─── Store ────────────────────────────────────────────────────────────────────
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null, comparisons: [], activeJobId: null }),

      // Comparisons
      comparisons: [],
      activeJobId: null,
      pipelineSteps: INITIAL_STEPS,

      addComparison: (job) =>
        set((s) => ({ comparisons: [job, ...s.comparisons] })),

      updateComparison: (id, updates) =>
        set((s) => ({
          comparisons: s.comparisons.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),

      setActiveJob: (id) =>
        set({ activeJobId: id, pipelineSteps: INITIAL_STEPS }),

      setPipelineSteps: (steps) => set({ pipelineSteps: steps }),

      updatePipelineStep: (id, status) =>
        set((s) => ({
          pipelineSteps: s.pipelineSteps.map((step) =>
            step.id === id ? { ...step, status } : step
          ),
        })),

      // UI
      ui: { sidebarOpen: true, theme: "dark" },
      setTheme: (theme) => set((s) => ({ ui: { ...s.ui, theme } })),
      toggleSidebar: () => set((s) => ({ ui: { ...s.ui, sidebarOpen: !s.ui.sidebarOpen } })),
    }),
    {
      name: "compareiq-store",
      partialize: (s) => ({ token: s.token, user: s.user, ui: s.ui }),
    }
  )
);

// ─── Selectors ────────────────────────────────────────────────────────────────
export const useAuth = () => useAppStore((s) => ({ user: s.user, token: s.token, setUser: s.setUser, setToken: s.setToken, logout: s.logout }));
export const useComparisons = () => useAppStore((s) => ({ comparisons: s.comparisons, addComparison: s.addComparison, updateComparison: s.updateComparison }));
export const usePipeline = () => useAppStore((s) => ({ steps: s.pipelineSteps, activeJobId: s.activeJobId, setActiveJob: s.setActiveJob, updateStep: s.updatePipelineStep }));
export const useUI = () => useAppStore((s) => ({ ui: s.ui, setTheme: s.setTheme, toggleSidebar: s.toggleSidebar }));
