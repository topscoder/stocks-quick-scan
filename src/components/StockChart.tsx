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

const colorPalette = [
  "#8884d8", // purple
  "#82ca9d", // green
  "#ffc658", // yellow
  "#ff7300", // orange
  "#413ea0", // darker purple
  "#0088FE", // blue
  "#FFBB28", // pale yellow
  "#FF8042", // light orange
  "#00C49F", // teal
];

const StockChart: React.FC<StockChartProps> = ({ data, xKey, lineKeys, title }) => {
  // 1) Sort data by xKey if not already sorted
  const sortedData = [...data].sort((a, b) => a[xKey] - b[xKey]);

  return (
    <div className="border p-4 rounded mb-4 bg-white">
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={sortedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {lineKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colorPalette[index % colorPalette.length]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
