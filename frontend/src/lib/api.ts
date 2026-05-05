import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// Stock Screening
export const screenStock = (ticker: string) =>
  api.get(`/api/v1/screening/${ticker}`).then((r) => r.data);

export const batchScreenStocks = (tickers: string[]) =>
  api.post("/api/v1/screening/batch", { tickers }).then((r) => r.data);

// Portfolio
export const getPortfolio = () =>
  api.get("/api/v1/portfolio").then((r) => r.data);

export const addHolding = (ticker: string, shares: number) =>
  api.post("/api/v1/portfolio/holdings", { ticker, shares }).then((r) => r.data);

// Zakat
export const calculateZakat = (assets: Record<string, number>) =>
  api.post("/api/v1/zakat/calculate", assets).then((r) => r.data);

export const getGoldPrice = () =>
  api.get("/api/v1/zakat/gold-price").then((r) => r.data);

// Banking
export const generateArbitrageStrategy = (params: {
  monthlySpend: number;
  creditScore: string;
  riskTolerance: string;
}) => api.post("/api/v1/banking/arbitrage-strategy", params).then((r) => r.data);

// Planning
export const getRetirementPlan = (params: {
  currentAge: number;
  targetAge: number;
  currentSavings: number;
  monthlyContribution: number;
}) => api.post("/api/v1/planning/retirement", params).then((r) => r.data);

// AI Coach
export const streamAICoach = async (
  messages: Array<{ role: string; content: string }>,
  onChunk: (text: string) => void
) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ai/coach/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ messages }),
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  if (!reader) return;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
    for (const line of lines) {
      const data = line.slice(6);
      if (data === "[DONE]") return;
      try {
        const parsed = JSON.parse(data);
        if (parsed.text) onChunk(parsed.text);
      } catch {}
    }
  }
};

export default api;
