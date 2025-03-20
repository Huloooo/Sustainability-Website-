'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { SustainabilityData, ChartData, PieChartData } from '@/types';
import { useStore } from '../store/useStore';

interface DataChartProps {
  data: SustainabilityData[];
  columns: string[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function DataChart({ data, columns }: DataChartProps) {
  const { isDarkMode } = useStore();

  // Convert data to chart format
  const chartData: ChartData[] = data.map((row, index) => {
    const chartRow: ChartData = {
      name: `Row ${index + 1}`,
      ...Object.fromEntries(
        columns.map((col) => [
          col,
          typeof row[col] === 'number' ? row[col] : Number(row[col]) || 0,
        ])
      ),
    };
    return chartRow;
  });

  // Calculate total values for pie chart
  const pieData: PieChartData[] = columns.map((col) => ({
    name: col,
    value: chartData.reduce((sum, row) => sum + (Number(row[col]) || 0), 0),
  }));

  const textColor = isDarkMode ? '#ffffff' : '#000000';
  const gridColor = isDarkMode ? '#404040' : '#e5e7eb';
  const tooltipBgColor = isDarkMode ? '#2d2d2d' : '#ffffff';
  const tooltipBorderColor = isDarkMode ? '#404040' : '#e5e7eb';

  const tooltipStyle = {
    backgroundColor: tooltipBgColor,
    border: `1px solid ${tooltipBorderColor}`,
    color: textColor,
    borderRadius: '0.5rem',
    padding: '0.5rem',
  };

  return (
    <div className="space-y-8">
      {/* Bar Chart */}
      <div className="w-full h-[300px]">
        <h3 className="text-lg font-semibold mb-4 text-center">Bar Chart</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" stroke={textColor} />
            <YAxis stroke={textColor} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ color: textColor }} />
            {columns.map((col, index) => (
              <Bar
                key={col}
                dataKey={col}
                fill={COLORS[index % COLORS.length]}
                name={col}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart */}
      <div className="w-full h-[300px]">
        <h3 className="text-lg font-semibold mb-4 text-center">Line Chart</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" stroke={textColor} />
            <YAxis stroke={textColor} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ color: textColor }} />
            {columns.map((col, index) => (
              <Line
                key={col}
                type="monotone"
                dataKey={col}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={{ fill: COLORS[index % COLORS.length], strokeWidth: 2 }}
                name={col}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="w-full h-[300px]">
        <h3 className="text-lg font-semibold mb-4 text-center">Pie Chart</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ color: textColor }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 