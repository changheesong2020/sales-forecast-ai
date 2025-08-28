
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts';
import { SalesData, ForecastPoint } from '../types';

interface ForecastChartProps {
  historicalData: SalesData[];
  forecastData: ForecastPoint[];
}

const ForecastChart: React.FC<ForecastChartProps> = ({ historicalData, forecastData }) => {
  const chartData = [
    ...historicalData.map(d => ({
      date: `${d.year}-${String(d.month).padStart(2, '0')}`,
      actual: d.sales
    })),
    ...forecastData.map(d => ({
      date: d.date,
      predicted: d.prediction,
      confidence: [d.lowerBound, d.upperBound]
    }))
  ];

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="date" stroke="#666" tick={{ fontSize: 12 }} />
          <YAxis stroke="#666" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #ddd' }}
            labelStyle={{ color: '#000000' }}
          />
          <Legend wrapperStyle={{color: '#000000'}} />
          <Line type="monotone" dataKey="actual" stroke="#1a73e8" strokeWidth={2} dot={false} name="Historical Sales" />
          <Line type="monotone" dataKey="predicted" stroke="#34a853" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Forecasted Sales" />
          <Area type="monotone" dataKey="confidence" stroke={false} fill="#34a853" fillOpacity={0.2} name="Confidence Interval" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastChart;
