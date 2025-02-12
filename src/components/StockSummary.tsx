import React, { useEffect } from 'react';
import { CompanyOverview } from '../interfaces/stockInterfaces';

interface StockSummaryProps {
  overview: CompanyOverview;
  onRefreshPrice: () => void;
}

const StockSummary: React.FC<StockSummaryProps> = ({ overview, onRefreshPrice }) => {
  useEffect(() => {
    const interval = setInterval(() => {
      onRefreshPrice();
    }, 60000); // 60s refresh

    return () => clearInterval(interval);
  }, [onRefreshPrice]);

  return (
    <div className="border-b border-gray-300 mb-4">
      <div className="flex flex-wrap items-center">
        <div className="w-full md:w-1/4 font-bold bg-yellow-200 p-2 border-r border-gray-300">
          Ticker
        </div>
        <div className="w-full md:w-3/4 p-2 border-b border-gray-300 md:border-b-0">
          {overview.symbol.toUpperCase()}
        </div>

        <div className="w-full md:w-1/4 font-bold bg-yellow-200 p-2 border-r border-gray-300">
          Company
        </div>
        <div className="w-full md:w-3/4 p-2 border-b border-gray-300 md:border-b-0">
          {overview.name}
        </div>

        <div className="w-full md:w-1/4 font-bold bg-yellow-200 p-2 border-r border-gray-300">
          Price
        </div>
        <div className="w-full md:w-3/4 p-2 flex justify-between items-center">
          <span>${overview.currentPrice.toFixed(2)}</span>
          <button
            onClick={onRefreshPrice}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockSummary;
