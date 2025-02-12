import {
  StockData,
  IncomeStatement,
  BalanceSheet,
  CashFlow,
} from "../interfaces/stockInterfaces";

const ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query";
const LOCAL_STORAGE_KEY = "alphaVantageApiKey";

function getApiKey(): string {
  const key = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!key) {
    throw new Error("Alpha Vantage API key not found in localStorage.");
  }
  return key;
}

/**
 * Symbol Search
 */
export async function searchSymbol(keyword: string): Promise<
  Array<{ symbol: string; name: string }>
> {
  if (!keyword) return [];

  try {
    const apiKey = getApiKey(); // retrieve from localStorage
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=${apiKey}`
    );
    const data = await response.json();
    if (data.bestMatches) {
      return data.bestMatches.map((match: any) => ({
        symbol: match["1. symbol"],
        name: match["2. name"],
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error("Symbol search failed:", error);
    return [];
  }
}

/** Helper: safely parse strings to floats */
function parseNumber(value: string | null | undefined) {
  if (!value) return 0;
  return parseFloat(value) || 0;
}

/**
 * Fetch real data for a given symbol from multiple Alpha Vantage endpoints:
 * - Overview
 * - Global Quote
 * - Income Statement
 * - Balance Sheet
 * - Cash Flow
 */
export async function fetchFullStockData(symbol: string): Promise<StockData | null> {
  try {
    if (!symbol) return null;

    const apiKey = getApiKey(); // retrieve from localStorage

    /** 1) Fetch Overview */
    const overviewResp = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`
    );
    const overviewData = await overviewResp.json();
    if (overviewData.Note || Object.keys(overviewData).length === 0) {
      console.warn("Overview Data not available or rate-limited");
      return null;
    }

    /** 2) Fetch Global Quote */
    const quoteResp = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
    );
    const quoteData = await quoteResp.json();
    const priceString = quoteData?.["Global Quote"]?.["05. price"];
    const currentPrice = priceString ? parseFloat(priceString) : 0;

    /** 3) Income Statement */
    const incResp = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${apiKey}`
    );
    const incData = await incResp.json();

    /** 4) Balance Sheet */
    const balResp = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=BALANCE_SHEET&symbol=${symbol}&apikey=${apiKey}`
    );
    const balData = await balResp.json();

    /** 5) Cash Flow */
    const cfResp = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=CASH_FLOW&symbol=${symbol}&apikey=${apiKey}`
    );
    const cfData = await cfResp.json();

    // Arrays of annual reports
    const incReports = incData.annualReports || [];
    const balReports = balData.annualReports || [];
    const cfReports = cfData.annualReports || [];

    // parse... (same as before)
    function parseIncomeStatement(report: any): IncomeStatement {
      const totalRevenue = parseNumber(report.totalRevenue) / 1e6;
      const netIncome = parseNumber(report.netIncome) / 1e6;
      const profitMargin = totalRevenue ? (netIncome / totalRevenue) * 100 : 0;
      const year = parseInt(report.fiscalDateEnding?.substring(0, 4), 10) || 0;
      return { year, totalRevenue, netIncome, profitMargin };
    }

    function parseBalanceSheet(report: any): BalanceSheet {
      const totalAssets = parseNumber(report.totalAssets) / 1e6;
      const totalLiabilities = parseNumber(report.totalLiabilities) / 1e6;
      const debtRatio = totalAssets ? totalLiabilities / totalAssets : 0;
      const year = parseInt(report.fiscalDateEnding?.substring(0, 4), 10) || 0;
      return { year, totalAssets, totalLiabilities, debtRatio };
    }

    function parseCashFlow(report: any): CashFlow {
      const operatingCashflow = parseNumber(report.operatingCashflow);
      const capEx = parseNumber(report.capitalExpenditures);
      const freeCashFlow = operatingCashflow - capEx;
      const year = parseInt(report.fiscalDateEnding?.substring(0, 4), 10) || 0;
      return { year, freeCashFlow: freeCashFlow / 1e6 };
    }

    const parsedIncome = incReports.slice(0, 5).map(parseIncomeStatement);
    const parsedBalance = balReports.slice(0, 5).map(parseBalanceSheet);
    const parsedCash = cfReports.slice(0, 5).map(parseCashFlow);

    // FCF/Sales ratio
    const withFcfRatio = parsedCash.map((cf: CashFlow) => {
      const inc = parsedIncome.find((i: IncomeStatement) => i.year === cf.year);
      const revenue = inc?.totalRevenue || 0;
      const fcfSalesRatio = revenue ? (cf.freeCashFlow / revenue) * 100 : 0;
      return { ...cf, fcfSalesRatio };
    });

    // Build StockData
    return {
      overview: {
        symbol,
        name: overviewData.Name || symbol,
        currentPrice,
      },
      incomeStatements: parsedIncome,
      balanceSheets: parsedBalance,
      cashFlows: withFcfRatio,
      valuation: {
        dividendPerShare: parseNumber(overviewData.DividendPerShare),
        sharesIssued: parseNumber(overviewData.SharesOutstanding),
        peRatio: parseNumber(overviewData.PERatio),
      },
      analysis: {
        quickScanScore: 70,
        returnPotentialScore: 65,
        minReturn3Y: 0,
        avgReturn3Y: 0,
        maxReturn3Y: 0,
        valuationIndicator: "Fairly Valued",
      },
    };
  } catch (err) {
    console.error("Failed to fetch full stock data:", err);
    return null;
  }
}
