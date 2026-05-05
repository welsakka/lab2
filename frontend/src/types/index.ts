export type HalalStatus = "halal" | "borderline" | "monitor" | "not-halal" | "unknown";

export interface StockScreenResult {
  ticker: string;
  name: string;
  sector: string;
  status: HalalStatus;
  ratios: {
    debtToAssets: number;
    interestIncomeRatio: number;
    cashAndSecuritiesRatio: number;
    nonPermissibleIncomeRatio: number;
  };
  purificationAmount: number | null;
  lastChecked: string;
  notes: string;
}

export interface PortfolioHolding {
  ticker: string;
  name: string;
  shares: number;
  currentPrice: number;
  totalValue: number;
  weight: number;
  status: HalalStatus;
  purificationPerShare: number;
}

export interface ZakatAssets {
  cash: number;
  stocks: number;
  gold: number;
  silver: number;
  businessEquity: number;
  receivables: number;
}

export interface ZakatReport {
  assets: ZakatAssets;
  totalZakatableWealth: number;
  nisabThreshold: number;
  aboveNisab: boolean;
  zakatDue: number;
  goldPricePerOz: number;
  calculatedAt: string;
}

export interface CreditCard {
  id: string;
  name: string;
  bank: string;
  currentBalance: number;
  creditLimit: number;
  aprEndDate: string;
  daysUntilEnd: number;
}

export interface ArbitrageStrategy {
  monthlySpend: number;
  bufferAccount: number;
  floatAmount: number;
  cards: CreditCard[];
  projectedAnnualGain: number;
  investmentReturns: number;
  creditCardRewards: number;
}

export interface RetirementPlan {
  currentAge: number;
  targetRetirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedReturn: number;
  projectedValue: number;
  monthlyIncomeAtRetirement: number;
  zakatProjectedAtRetirement: number;
  onTrack: boolean;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  plan: "free" | "essential" | "premium" | "family";
  createdAt: string;
}
