import { FC } from 'react';
import { BarChart, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Area } from 'recharts';
import { timeFormatter } from '../../shared/timeFormatter';
import { ChartDataItem } from '../../interfaces/ChartDataItem';

interface ChartProps {
  type: 'bar' | 'area';
  chartData: ChartDataItem[];
}

const Chart: FC<ChartProps> = ({ type, chartData }) => {
  if (!chartData.length) return <p>Not enough chart data</p>;

  if (type === 'bar')
    return (
      <BarChart width={600} height={400} data={chartData}>
        <defs>
          <linearGradient id="colorSprint" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorAudiocall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#84bfd8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#84bfd8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="date" minTickGap={40} tickFormatter={timeFormatter} />
        <YAxis />
        <Tooltip />
        <Bar dataKey="sprint" stroke="#8884d8" fillOpacity={1} fill="url(#colorSprint)" />
        <Bar dataKey="audiocall" stroke="#84bfd8" fillOpacity={1} fill="url(#colorAudiocall)" />
      </BarChart>
    );

  return (
    <AreaChart width={600} height={400} data={chartData}>
      <defs>
        <linearGradient id="colorSprint" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="colorAudiocall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#84bfd8" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#84bfd8" stopOpacity={0} />
        </linearGradient>
      </defs>
      <XAxis dataKey="date" minTickGap={40} tickFormatter={timeFormatter} />
      <YAxis />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <Tooltip />
      <Area dataKey="sprint" stroke="#8884d8" fillOpacity={1} fill="url(#colorSprint)" />
      <Area dataKey="audiocall" stroke="#84bfd8" fillOpacity={1} fill="url(#colorAudiocall)" />
    </AreaChart>
  );
};

export default Chart;
