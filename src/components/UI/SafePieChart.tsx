
import React from 'react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';

interface SafePieChartProps {
  data: { name: string; value: number; status: string }[];
  dataKey: string;
  nameKey: string;
  children?: React.ReactNode;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const SafePieChart: React.FC<SafePieChartProps> = ({ data, dataKey, nameKey, children }) => {
  const hasData = data && data.length > 0;
  
  if (!hasData) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <PieChart width={400} height={300}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={80}
        fill="#8884d8"
        dataKey={dataKey}
        nameKey={nameKey}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <RechartsTooltip />
      {children}
    </PieChart>
  );
};

export default SafePieChart;
