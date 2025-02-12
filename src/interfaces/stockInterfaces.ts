// All the interfaces used throughout the app

export interface CompanyOverview {
  symbol: string;
  name: string;
  currentPrice: number;
}

export interface IncomeStatement {
  year: number;           // e.g. 2021
  totalRevenue: number;   // in millions (or your chosen unit)
  netIncome: number;      // in millions
  profitMargin?: number;  // e.g. 10.5
}

export interface BalanceSheet {
  year: number;
  totalAssets: number;      // in millions
  totalLiabilities: number; // in millions
  debtRatio?: number;       // e.g. 0.5 => 50%
}

export interface CashFlow {
  year: number;
  freeCashFlow: number;   // in millions
  fcfSalesRatio?: number; // e.g. 10 => 10%
}

export interface ValuationMetrics {
  dividendPerShare: number;
  sharesIssued: number;
  peRatio: number;
}

export interface AnalysisScores {
  quickScanScore: number; // 0-100
  returnPotentialScore: number;
  minReturn3Y: number;
  avgReturn3Y: number;
  maxReturn3Y: number;
  valuationIndicator: 'Overvalued' | 'Undervalued' | 'Fairly Valued';
}

export interface StockData {
  overview: CompanyOverview;
  incomeStatements: IncomeStatement[];
  balanceSheets: BalanceSheet[];
  cashFlows: CashFlow[];
  valuation: ValuationMetrics;
  analysis: AnalysisScores;
}
