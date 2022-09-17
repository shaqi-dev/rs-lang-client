import { FC, useState, useEffect } from 'react';
import { BarChart, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Area } from 'recharts';
import { timeFormatter } from '../../shared/timeFormatter';
import { ChartDataItem } from '../../interfaces/ChartDataItem';

interface ChartProps {
  type: 'bar' | 'area';
  chartData: ChartDataItem[];
}

const Chart: FC<ChartProps> = ({ type, chartData }) => {
  const [chartWidth, setChartWidth] = useState(600);
  const [chartHeight, setChartHeight] = useState(400);

  useEffect(() => {
    if (window.innerWidth <= 650) {
      setChartWidth(300);
      setChartHeight(200);
    }
  }, []);

  if (!chartData.length) return <p>Not enough chart data</p>;

  window.addEventListener('resize', () => {
    if (window.innerWidth <= 650) {
      setChartWidth(300);
      setChartHeight(200);
    } else {
      setChartWidth(600);
      setChartHeight(400);
    }
  });

  if (type === 'bar')
    return (
      <BarChart width={chartWidth} height={chartHeight} data={chartData}>
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
    <AreaChart width={chartWidth} height={chartHeight} data={chartData}>
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
