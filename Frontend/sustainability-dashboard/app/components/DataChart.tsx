'use client';

import React, { useMemo } from 'react';
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

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#8B5CF6'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 1.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="currentColor"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="text-xs"
    >
      {`${name}: ${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

const isNumeric = (value: any): boolean => {
  if (value === null || value === undefined || value === '') return false;
  if (typeof value === 'number') return !isNaN(value);
  if (typeof value === 'string') {
    // Remove commas and currency symbols
    const cleanValue = value.replace(/[$,]/g, '');
    const num = parseFloat(cleanValue);
    return !isNaN(num);
  }
  return false;
};

const parseNumericValue = (value: any): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    // Remove commas and currency symbols
    const cleanValue = value.replace(/[$,]/g, '');
    return parseFloat(cleanValue) || 0;
  }
  return 0;
};

export default function DataChart({ data, columns }: DataChartProps) {
  const { isDarkMode } = useStore();

  // Filter numeric columns
  const numericColumns = useMemo(() => {
    if (!data.length || !columns.length) return [];

    return columns.filter(col => {
      // Check first row to determine if the column is numeric
      const firstValue = data[0][col];
      return isNumeric(firstValue);
    });
  }, [data, columns]);

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!data.length || !numericColumns.length) return [];

    return data.map((row, index) => {
      const chartRow: ChartData = {
        name: `Row ${index + 1}`,
        ...Object.fromEntries(
          numericColumns.map(col => [
            col,
            parseNumericValue(row[col])
          ])
        )
      };
      return chartRow;
    });
  }, [data, numericColumns]);

  // Calculate total values for pie chart
  const pieData: PieChartData[] = useMemo(() => {
    if (!data.length || !numericColumns.length) return [];

    return numericColumns
      .map((col) => ({
        name: col,
        value: data.reduce((sum, row) => sum + parseNumericValue(row[col]), 0)
      }))
      .filter(item => item.value !== 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Show only top 5 values
  }, [data, numericColumns]);

  console.log('Numeric Columns:', numericColumns);
  console.log('Chart Data:', chartData.slice(0, 2));
  console.log('Pie Data:', pieData);

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

  const formatTooltipValue = (value: number) => {
    if (isNaN(value)) return 'N/A';
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toFixed(1);
  };

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="flex items-center gap-2">
              <span className="font-medium">{entry.name}:</span>
              <span>{formatTooltipValue(entry.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!data.length) {
    return (
      <div className="text-center p-4 text-gray-500">
        No data available for visualization
      </div>
    );
  }

  if (numericColumns.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        No numeric columns found in the data. Please make sure your CSV contains numeric values.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Bar Chart */}
      <div className="w-full h-[400px]">
        <h3 className="text-lg font-semibold mb-4 text-center">Data Distribution (First 10 Rows)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData.slice(0, 10)}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              dataKey="name" 
              stroke={textColor}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke={textColor}
              tickFormatter={formatTooltipValue}
            />
            <Tooltip content={customTooltip} />
            <Legend 
              wrapperStyle={{ color: textColor }} 
              layout="horizontal"
              verticalAlign="top"
              align="center"
            />
            {numericColumns.map((col, index) => (
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
      <div className="w-full h-[400px]">
        <h3 className="text-lg font-semibold mb-4 text-center">Trend Analysis (First 20 Rows)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData.slice(0, 20)}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              dataKey="name" 
              stroke={textColor}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke={textColor}
              tickFormatter={formatTooltipValue}
            />
            <Tooltip content={customTooltip} />
            <Legend 
              wrapperStyle={{ color: textColor }}
              layout="horizontal"
              verticalAlign="top"
              align="center"
            />
            {numericColumns.map((col, index) => (
              <Line
                key={col}
                type="monotone"
                dataKey={col}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={{ fill: COLORS[index % COLORS.length], strokeWidth: 2, r: 4 }}
                name={col}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {pieData.length > 0 && (
        <div className="w-full h-[500px]">
          <h3 className="text-lg font-semibold mb-4 text-center">Total Distribution (Top 5 Values)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={140}
                labelLine={true}
                label={renderCustomizedLabel}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={customTooltip} />
              <Legend 
                wrapperStyle={{ color: textColor }} 
                layout="vertical"
                align="right"
                verticalAlign="middle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
} 