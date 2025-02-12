import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

interface ChartDataPoint {
  [key: string]: number;
}

interface StockChartProps {
  data: ChartDataPoint[];
  xKey: string;
  lineKeys: string[];
  title?: string;
}

const StockChart: React.FC<StockChartProps> = ({ data, xKey, lineKeys, title }) => {
  return (
    <div className="border p-4 rounded mb-4 bg-white">
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {lineKeys.map((key) => (
            <Line key={key} type="monotone" dataKey={key} stroke="#8884d8" />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
