import React from 'react';
import {
  IncomeStatement,
  BalanceSheet,
  CashFlow,
  ValuationMetrics,
} from '../interfaces/stockInterfaces';

// A utility to compare the current value against the previous year's value
// for "positive" metrics: if current > prev => green, if current < prev => no color
// for "negative" metrics: if current > prev => red, if current < prev => no color
function getColorClass(
  current: number,
  prev: number | null,
  isPositiveMetric: boolean
) {
  if (prev === null) return ''; // no previous year to compare
  // We only apply color if there's an "improvement" or "deterioration"
  // based on whether the metric is considered positive or negative.

  if (isPositiveMetric) {
    // If current is larger than previous => green
    if (current > prev) return 'text-green-600 font-semibold';
  } else {
    // If current is larger than previous => red (bad for negative metrics)
    if (current > prev) return 'text-red-600 font-semibold';
  }
  return '';
}

interface FinancialDataProps {
  incomeStatements: IncomeStatement[];
  balanceSheets: BalanceSheet[];
  cashFlows: CashFlow[];
  valuation: ValuationMetrics;
}

const FinancialData: React.FC<FinancialDataProps> = ({
  incomeStatements,
  balanceSheets,
  cashFlows,
  valuation,
}) => {
  // 1) Sort arrays by ascending year so oldest is first
  const sortedIncome = [...incomeStatements].sort((a, b) => a.year - b.year);
  const sortedBalance = [...balanceSheets].sort((a, b) => a.year - b.year);
  const sortedCash = [...cashFlows].sort((a, b) => a.year - b.year);

  // We'll map these sorted arrays in the same order (e.g. left to right = oldest -> newest).
  // Then for each cell, compare current year's value to the previous year's.

  return (
    <div className="overflow-auto mb-4">
      {/* INCOME STATEMENT */}
      <table className="min-w-full text-sm text-left border-collapse mb-4">
        <thead className="bg-yellow-200">
          <tr>
            <th className="p-2 border-r border-gray-300" colSpan={1 + sortedIncome.length}>
              INCOME STATEMENT
            </th>
          </tr>
          <tr className="bg-yellow-100 text-gray-700">
            <th className="p-2 border-r border-gray-300">Year</th>
            {sortedIncome.map((item) => (
              <th key={item.year} className="p-2 border-r border-gray-300">
                {item.year}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Total Revenue */}
          <tr>
            <td className="p-2 border-r border-gray-300 font-bold">Total Revenue (M)</td>
            {sortedIncome.map((item, i) => {
              // Compare with previous
              const prev = i === 0 ? null : sortedIncome[i - 1].totalRevenue;
              const colorClass = getColorClass(item.totalRevenue, prev, /* isPositiveMetric= */ true);
              return (
                <td key={item.year} className={`p-2 border-r border-gray-300 ${colorClass}`}>
                  ${item.totalRevenue.toLocaleString()}
                </td>
              );
            })}
          </tr>
          {/* Net Income */}
          <tr>
            <td className="p-2 border-r border-gray-300 font-bold">Net Income (M)</td>
            {sortedIncome.map((item, i) => {
              const prev = i === 0 ? null : sortedIncome[i - 1].netIncome;
              const colorClass = getColorClass(item.netIncome, prev, true);
              return (
                <td key={item.year} className={`p-2 border-r border-gray-300 ${colorClass}`}>
                  ${item.netIncome.toLocaleString()}
                </td>
              );
            })}
          </tr>
          {/* Profit Margin */}
          <tr className="border-b border-gray-300">
            <td className="p-2 border-r border-gray-300 font-bold">Profit Margin</td>
            {sortedIncome.map((item, i) => {
              const prev = i === 0 ? null : sortedIncome[i - 1].profitMargin || 0;
              const colorClass = getColorClass(item.profitMargin || 0, prev, true);
              return (
                <td key={item.year} className={`p-2 border-r border-gray-300 ${colorClass}`}>
                  {item.profitMargin?.toFixed(2)}%
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>

      {/* BALANCE SHEET */}
      <table className="min-w-full text-sm text-left border-collapse mb-4">
        <thead className="bg-yellow-200">
          <tr>
            <th className="p-2 border-r border-gray-300" colSpan={1 + sortedBalance.length}>
              BALANCE SHEET
            </th>
          </tr>
          <tr className="bg-yellow-100 text-gray-700">
            <th className="p-2 border-r border-gray-300">Year</th>
            {sortedBalance.map((item) => (
              <th key={item.year} className="p-2 border-r border-gray-300">
                {item.year}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Total Assets */}
          <tr>
            <td className="p-2 border-r border-gray-300 font-bold">Total Assets (M)</td>
            {sortedBalance.map((item, i) => {
              const prev = i === 0 ? null : sortedBalance[i - 1].totalAssets;
              const colorClass = getColorClass(item.totalAssets, prev, true);
              return (
                <td key={item.year} className={`p-2 border-r border-gray-300 ${colorClass}`}>
                  ${item.totalAssets.toLocaleString()}
                </td>
              );
            })}
          </tr>
          {/* Total Liabilities */}
          <tr>
            <td className="p-2 border-r border-gray-300 font-bold">Total Liabilities (M)</td>
            {sortedBalance.map((item, i) => {
              const prev = i === 0 ? null : sortedBalance[i - 1].totalLiabilities;
              // For negative metrics: "If the value of the previous year is higher => mark red if current is bigger"
              // We'll do the inverse logic (isPositiveMetric=false).
              const colorClass = getColorClass(item.totalLiabilities, prev, false);
              return (
                <td key={item.year} className={`p-2 border-r border-gray-300 ${colorClass}`}>
                  ${item.totalLiabilities.toLocaleString()}
                </td>
              );
            })}
          </tr>
          {/* Debt Ratio */}
          <tr className="border-b border-gray-300">
            <td className="p-2 border-r border-gray-300 font-bold">Debt Ratio</td>
            {sortedBalance.map((item, i) => {
              const prev = i === 0 ? null : sortedBalance[i - 1].debtRatio || 0;
              // negative metric => bigger is bad => red
              const colorClass = getColorClass(item.debtRatio || 0, prev, false);
              return (
                <td key={item.year} className={`p-2 border-r border-gray-300 ${colorClass}`}>
                  {(item.debtRatio! * 100).toFixed(2)}%
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>

      {/* CASH FLOW */}
      <table className="min-w-full text-sm text-left border-collapse mb-4">
        <thead className="bg-yellow-200">
          <tr>
            <th className="p-2 border-r border-gray-300" colSpan={1 + sortedCash.length}>
              CASH FLOW
            </th>
          </tr>
          <tr className="bg-yellow-100 text-gray-700">
            <th className="p-2 border-r border-gray-300">Year</th>
            {sortedCash.map((item) => (
              <th key={item.year} className="p-2 border-r border-gray-300">
                {item.year}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Free Cash Flow */}
          <tr>
            <td className="p-2 border-r border-gray-300 font-bold">Free Cash Flow (M)</td>
            {sortedCash.map((item, i) => {
              const prev = i === 0 ? null : sortedCash[i - 1].freeCashFlow;
              const colorClass = getColorClass(item.freeCashFlow, prev, true);
              return (
                <td key={item.year} className={`p-2 border-r border-gray-300 ${colorClass}`}>
                  ${item.freeCashFlow.toLocaleString()}
                </td>
              );
            })}
          </tr>
          {/* FCF/Sales Ratio */}
          <tr className="border-b border-gray-300">
            <td className="p-2 border-r border-gray-300 font-bold">FCF/Sales Ratio</td>
            {sortedCash.map((item, i) => {
              const prev = i === 0 ? null : sortedCash[i - 1].fcfSalesRatio || 0;
              // Usually "positive metric" => bigger FCF ratio is good => green
              const colorClass = getColorClass(item.fcfSalesRatio || 0, prev, true);
              return (
                <td key={item.year} className={`p-2 border-r border-gray-300 ${colorClass}`}>
                  {item.fcfSalesRatio?.toFixed(2)}%
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>

      {/* VALUATION */}
      {/* For dividend per share or shares issued, we only have a single value in the example. 
          If you had multiple data points over multiple years, you'd do a similar approach with sorting & comparing. */}
      <table className="min-w-full text-sm text-left border-collapse">
        <thead className="bg-yellow-200">
          <tr>
            <th className="p-2 border-r border-gray-300" colSpan={2}>
              VALUATION
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-300">
            <td className="p-2 border-r border-gray-300 font-bold">Dividend per Share</td>
            <td className="p-2 border-r border-gray-300">
              {/* There's only one data point in the example. No previous year to compare. */}
              ${valuation.dividendPerShare.toFixed(2)}
            </td>
          </tr>
          <tr className="border-b border-gray-300">
            <td className="p-2 border-r border-gray-300 font-bold">Shares Issued</td>
            <td className="p-2 border-r border-gray-300">
              {/* Also only one data point, no color compare. 
                  If you had multiple, you'd do the negative metric logic. */}
              {valuation.sharesIssued.toLocaleString()}
            </td>
          </tr>
          <tr className="border-b border-gray-300">
            <td className="p-2 border-r border-gray-300 font-bold">P/E Ratio</td>
            <td className="p-2 border-r border-gray-300">
              {valuation.peRatio.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FinancialData;
