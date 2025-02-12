import React, { useState, useCallback } from "react";
import StockSearch from "../components/StockSearch";
import { useFetchStockData } from "../hooks/useFetchStockData";
import LoadingSpinner from "../components/LoadingSpinner";
import StockSummary from "../components/StockSummary";
import FinancialData from "../components/FinancialData";
import AnalysisScoresComponent from "../components/AnalysisScores";
import StockChart from "../components/StockChart";
import ApiKeyInput from "../components/ApiKeyInput";

const Home: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>("");

  // Our custom fetch hook
  const { stockData, loading, error } = useFetchStockData(selectedSymbol);

  const handleSelectSymbol = (symbol: string) => {
    setSelectedSymbol(symbol);
  };

  const handleRefreshPrice = useCallback(() => {
    setSelectedSymbol((prev) => prev); // triggers re-fetch
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Stock Analysis Web Application</h1>

      {/* Let user input the key first */}
      <ApiKeyInput />

      <StockSearch onSelectSymbol={handleSelectSymbol} />

      {loading && <LoadingSpinner />}
      {error && <p className="text-red-500">Error: {error}</p>}

      {stockData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* LEFT COLUMN */}
          <div className="bg-white border rounded p-4">
            <StockSummary
              overview={stockData.overview}
              onRefreshPrice={handleRefreshPrice}
            />

            <FinancialData
              incomeStatements={stockData.incomeStatements}
              balanceSheets={stockData.balanceSheets}
              cashFlows={stockData.cashFlows}
              valuation={stockData.valuation}
            />

            <AnalysisScoresComponent analysis={stockData.analysis} />
          </div>

          {/* RIGHT COLUMN - Charts */}
          <div className="space-y-4">
            {/* Revenue vs Net Income */}
            <StockChart
              data={stockData.incomeStatements.map(is => ({
                year: is.year,
                revenue: is.totalRevenue,
                netIncome: is.netIncome,
              }))}
              xKey="year"
              lineKeys={["revenue", "netIncome"]}
              title="Revenue vs Net Income"
            />

            {/* Assets vs Liabilities */}
            <StockChart
              data={stockData.balanceSheets.map(bs => ({
                year: bs.year,
                totalAssets: bs.totalAssets,
                totalLiabilities: bs.totalLiabilities,
              }))}
              xKey="year"
              lineKeys={["totalAssets", "totalLiabilities"]}
              title="Assets vs Liabilities"
            />

            {/* Profit Margin */}
            <StockChart
              data={stockData.incomeStatements.map(is => ({
                year: is.year,
                profitMargin: is.profitMargin || 0,
              }))}
              xKey="year"
              lineKeys={["profitMargin"]}
              title="Profit Margin"
            />

            {/* Debt Ratio */}
            <StockChart
              data={stockData.balanceSheets.map(bs => ({
                year: bs.year,
                debtRatio: bs.debtRatio || 0,
              }))}
              xKey="year"
              lineKeys={["debtRatio"]}
              title="Debt Ratio"
            />

            {/* FCF/Sales Ratio */}
            <StockChart
              data={stockData.cashFlows.map(cf => ({
                year: cf.year,
                fcfSalesRatio: cf.fcfSalesRatio || 0,
              }))}
              xKey="year"
              lineKeys={["fcfSalesRatio"]}
              title="FCF / Sales Ratio"
            />

            {/* Shares Issued */}
            <StockChart
              data={stockData.incomeStatements.map(is => ({
                year: is.year,
                shares: stockData.valuation.sharesIssued,
              }))}
              xKey="year"
              lineKeys={["shares"]}
              title="Shares Issued"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
