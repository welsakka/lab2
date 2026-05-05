import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (typeof window !== "undefined") {
      if (err.response?.status === 401) {
        window.location.href = "/login";
      }
      if (err.response?.status === 402) {
        const detail = err.response.data?.detail;
        if (detail?.code === "PLAN_REQUIRED") {
          import("@/lib/upgrade-store").then(({ useUpgradeStore }) => {
            useUpgradeStore.getState().setRequired(detail.required_plans ?? []);
          });
        }
      }
    }
    return Promise.reject(err);
  }
);

// ── Auth ─────────────────────────────────────────────────────────────────────

export const login = (email: string, password: string) =>
  api.post("/api/v1/auth/login", { email, password }).then((r) => r.data);

export const register = (name: string, email: string, password: string) =>
  api.post("/api/v1/auth/register", { name, email, password }).then((r) => r.data);

export const logout = () =>
  api.post("/api/v1/auth/logout").then((r) => r.data);

export const getMe = () =>
  api.get("/api/v1/auth/me").then((r) => r.data);

// ── Stock Screening ───────────────────────────────────────────────────────────

export const screenStock = (ticker: string) =>
  api.get(`/api/v1/screening/${ticker}`).then((r) => r.data);

export const batchScreenStocks = (tickers: string[]) =>
  api.post("/api/v1/screening/batch", { tickers }).then((r) => r.data);

// ── Portfolio ─────────────────────────────────────────────────────────────────

export const getPortfolio = () =>
  api.get("/api/v1/portfolio").then((r) => r.data);

export const addHolding = (ticker: string, shares: number, avg_cost?: number) =>
  api.post("/api/v1/portfolio/holdings", { ticker, shares, avg_cost }).then((r) => r.data);

export const removeHolding = (holdingId: string) =>
  api.delete(`/api/v1/portfolio/holdings/${holdingId}`);

// ── Zakat ─────────────────────────────────────────────────────────────────────

export const calculateZakat = (assets: Record<string, number>) =>
  api.post("/api/v1/zakat/calculate", assets).then((r) => r.data);

export const getGoldPrice = () =>
  api.get("/api/v1/zakat/gold-price").then((r) => r.data);

// ── Banking ───────────────────────────────────────────────────────────────────

export const generateArbitrageStrategy = (params: {
  monthly_spend: number;
  credit_score: string;
  risk_tolerance: string;
}) => api.post("/api/v1/banking/arbitrage-strategy", params).then((r) => r.data);

// ── Planning ──────────────────────────────────────────────────────────────────

export const getRetirementPlan = (params: {
  current_age: number;
  target_retirement_age: number;
  current_savings: number;
  monthly_contribution: number;
  annual_return_pct?: number;
}) => api.post("/api/v1/planning/retirement", params).then((r) => r.data);

// ── Plaid ─────────────────────────────────────────────────────────────────────

export const getPlaidLinkToken = () =>
  api.post("/api/v1/plaid/link-token").then((r) => r.data.link_token);

export const exchangePlaidToken = (public_token: string, institution_name: string) =>
  api.post("/api/v1/plaid/exchange-token", { public_token, institution_name }).then((r) => r.data);

export const syncPlaidHoldings = () =>
  api.post("/api/v1/plaid/sync").then((r) => r.data);

// ── Stripe ────────────────────────────────────────────────────────────────────

export const createCheckout = (price_id: string) =>
  api.post("/api/v1/stripe/checkout", { price_id }).then((r) => r.data);

// ── AI Coach (streaming) ──────────────────────────────────────────────────────

export const streamAICoach = async (
  messages: Array<{ role: string; content: string }>,
  onChunk: (text: string) => void,
  onError?: (message: string) => void
): Promise<void> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  const response = await fetch(`${baseUrl}/api/v1/ai/coach/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    if (response.status === 402 && err?.detail?.code === "PLAN_REQUIRED") {
      const { useUpgradeStore } = await import("@/lib/upgrade-store");
      useUpgradeStore.getState().setRequired(err.detail.required_plans ?? []);
      return;
    }
    throw new Error(err?.detail || "AI coach unavailable");
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  if (!reader) return;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
    for (const line of lines) {
      const data = line.slice(6).trim();
      if (data === "[DONE]") return;
      try {
        const parsed = JSON.parse(data);
        if (parsed.error) {
          onError?.(parsed.error);
          return;
        }
        if (parsed.text) onChunk(parsed.text);
      } catch {}
    }
  }
};

export default api;
