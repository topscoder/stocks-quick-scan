import React from 'react';
import {
  IncomeStatement,
  BalanceSheet,
  CashFlow,
  ValuationMetrics,
} from '../interfaces/stockInterfaces';

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
  return (
    <div className="overflow-auto mb-4">
      {/* INCOME STATEMENT */}
      <table className="min-w-full text-sm text-left border-collapse mb-4">
        <thead className="bg-yellow-200">
          <tr>
            <th className="p-2 border-r border-gray-300" colSpan={6}>
              INCOME STATEMENT
            </th>
          </tr>
          <tr className="bg-yellow-100 text-gray-700">
            <th className="p-2 border-r border-gray-300">Year</th>
            {incomeStatements.map((item, i) => (
              <th key={i} className="p-2 border-r border-gray-300">
                {item.year}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Total Revenue */}
          <tr>
            <td className="p-2 border-r border-gray-300 font-bold">Total Revenue (M)</td>
            {incomeStatements.map((item, i) => (
              <td key={i} className="p-2 border-r border-gray-300">
                ${item.totalRevenue.toLocaleString()}
              </td>
            ))}
          </tr>
          {/* Net Income */}
          <tr>
            <td className="p-2 border-r border-gray-300 font-bold">Net Income (M)</td>
            {incomeStatements.map((item, i) => (
              <td
                key={i}
                className={`p-2 border-r border-gray-300 ${
                  item.netIncome < 0 ? 'text-red-600' : 'text-green-600'
                }`}
              >
                ${item.netIncome.toLocaleString()}
              </td>
            ))}
          </tr>
          {/* Profit Margin */}
          <tr className="border-b border-gray-300">
            <td className="p-2 border-r border-gray-300 font-bold">Profit Margin</td>
            {incomeStatements.map((item, i) => (
              <td key={i} className="p-2 border-r border-gray-300">
                {item.profitMargin?.toFixed(2)}%
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      {/* BALANCE SHEET */}
      <table className="min-w-full text-sm text-left border-collapse mb-4">
        <thead className="bg-yellow-200">
          <tr>
            <th className="p-2 border-r border-gray-300" colSpan={6}>
              BALANCE SHEET
            </th>
          </tr>
          <tr className="bg-yellow-100 text-gray-700">
            <th className="p-2 border-r border-gray-300">Year</th>
            {balanceSheets.map((item, i) => (
              <th key={i} className="p-2 border-r border-gray-300">
                {item.year}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Total Assets */}
          <tr>
            <td className="p-2 border-r border-gray-300 font-bold">Total Assets (M)</td>
            {balanceSheets.map((item, i) => (
              <td key={i} className="p-2 border-r border-gray-300">
                ${item.totalAssets.toLocaleString()}
              </td>
            ))}
          </tr>
          {/* Total Liabilities */}
          <tr>
            <td className="p-2 border-r border-gray-300 font-bold">Total Liabilities (M)</td>
            {balanceSheets.map((item, i) => (
              <td key={i} className="p-2 border-r border-gray-300">
                ${item.totalLiabilities.toLocaleString()}
              </td>
            ))}
          </tr>
          {/* Debt Ratio */}
          <tr className="border-b border-gray-300">
            <td className="p-2 border-r border-gray-300 font-bold">Debt Ratio</td>
            {balanceSheets.map((item, i) => (
              <td key={i} className="p-2 border-r border-gray-300">
                {(item.debtRatio! * 100).toFixed(2)}%
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      {/* CASH FLOW */}
      <table className="min-w-full text-sm text-left border-collapse mb-4">
        <thead className="bg-yellow-200">
          <tr>
            <th className="p-2 border-r border-gray-300" colSpan={6}>
              CASH FLOW
            </th>
          </tr>
          <tr className="bg-yellow-100 text-gray-700">
            <th className="p-2 border-r border-gray-300">Year</th>
            {cashFlows.map((item, i) => (
              <th key={i} className="p-2 border-r border-gray-300">
                {item.year}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Free Cash Flow */}
          <tr>
            <td className="p-2 border-r border-gray-300 font-bold">Free Cash Flow (M)</td>
            {cashFlows.map((item, i) => (
              <td
                key={i}
                className={`p-2 border-r border-gray-300 ${
                  item.freeCashFlow < 0 ? 'text-red-600' : 'text-green-600'
                }`}
              >
                ${item.freeCashFlow.toLocaleString()}
              </td>
            ))}
          </tr>
          {/* FCF/Sales Ratio */}
          <tr className="border-b border-gray-300">
            <td className="p-2 border-r border-gray-300 font-bold">FCF/Sales Ratio</td>
            {cashFlows.map((item, i) => (
              <td key={i} className="p-2 border-r border-gray-300">
                {item.fcfSalesRatio?.toFixed(2)}%
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      {/* VALUATION */}
      <table className="min-w-full text-sm text-left border-collapse">
        <thead className="bg-yellow-200">
          <tr>
            <th className="p-2 border-r border-gray-300" colSpan={6}>
              VALUATION
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-300">
            <td className="p-2 border-r border-gray-300 font-bold">Dividend per Share</td>
            <td className="p-2 border-r border-gray-300" colSpan={5}>
              ${valuation.dividendPerShare.toFixed(2)}
            </td>
          </tr>
          <tr className="border-b border-gray-300">
            <td className="p-2 border-r border-gray-300 font-bold">Shares Issued</td>
            <td className="p-2 border-r border-gray-300" colSpan={5}>
              {valuation.sharesIssued.toLocaleString()}
            </td>
          </tr>
          <tr className="border-b border-gray-300">
            <td className="p-2 border-r border-gray-300 font-bold">P/E Ratio</td>
            <td className="p-2 border-r border-gray-300" colSpan={5}>
              {valuation.peRatio.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FinancialData;
