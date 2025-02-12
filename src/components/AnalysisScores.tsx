import React from 'react';
import { AnalysisScores } from '../interfaces/stockInterfaces';

interface AnalysisScoresProps {
  analysis: AnalysisScores;
}

const AnalysisScoresComponent: React.FC<AnalysisScoresProps> = ({ analysis }) => {
  return (
    <div className="mb-4">
      <table className="min-w-full text-sm text-left border border-gray-300">
        <thead className="bg-yellow-200">
          <tr>
            <th className="p-2" colSpan={2}>
              QUICK SCAN SCORE (REALIZED)
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-300">
            <td className="p-2 font-bold">Quick Scan Score</td>
            <td className="p-2">{analysis.quickScanScore}%</td>
          </tr>
        </tbody>

        <thead className="bg-yellow-200">
          <tr>
            <th className="p-2" colSpan={2}>
              RETURN POTENTIAL SCORE (FUTURE)
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 font-bold">Return Potential Score</td>
            <td className="p-2">{analysis.returnPotentialScore}</td>
          </tr>
          <tr>
            <td className="p-2 font-bold">Min / Avg / Max (3 YR)</td>
            <td className="p-2">
              {analysis.minReturn3Y}% / {analysis.avgReturn3Y}% / {analysis.maxReturn3Y}%
            </td>
          </tr>
          <tr className="border-b border-gray-300">
            <td className="p-2 font-bold">Valuation Indicator</td>
            <td className="p-2">{analysis.valuationIndicator}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AnalysisScoresComponent;
