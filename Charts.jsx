import React from 'react';
import { counties, generateMonthlyData, getAnnualWaterStressData } from './counties';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Cell
} from 'recharts';
import { TrendingUp, Droplets, BarChart3 } from 'lucide-react';

const Charts = ({ selectedRegion }) => {
  const county = counties.find(c => c.id === selectedRegion);
  const monthlyData = county ? generateMonthlyData(selectedRegion) : [];
  const annualData = getAnnualWaterStressData();

  // Custom colors for water stress levels
  const getWaterStressColor = (value) => {
    if (value >= 75) return '#ef4444'; // High stress - red
    if (value >= 50) return '#f59e0b'; // Medium stress - orange
    if (value >= 25) return '#eab308'; // Low-medium stress - yellow
    return '#22c55e'; // Low stress - green
  };

  return (
    <div className="space-y-6">
      {/* Monthly Trends for Selected County */}
      {county && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              Monthly Trends - {county.name}
            </h3>
            <p className="text-gray-600 mt-1">
              Last 3 months: Water stress, rainfall, and water access metrics
            </p>
          </div>

          {/* Combined Chart: Water Stress (Bar) + Rainfall & Water Access (Lines) */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-800 mb-4">Water Metrics Overview</h4>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  stroke="#6b7280"
                  style={{ fontSize: '12px', fontWeight: 500 }}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  label={{ value: 'Rainfall (mm)', angle: 90, position: 'insideRight' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="line"
                />
                
                {/* Bar Chart for Water Stress */}
                <Bar
                  yAxisId="left"
                  dataKey="waterStress"
                  fill="#3b82f6"
                  name="Water Stress (%)"
                  radius={[8, 8, 0, 0]}
                >
                  {monthlyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getWaterStressColor(entry.waterStress)} />
                  ))}
                </Bar>
                
                {/* Line Charts for Rainfall and Water Access */}
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="rainfall"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  name="Rainfall (mm)"
                  dot={{ fill: '#06b6d4', r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="waterAccess"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Water Access Rate (%)"
                  dot={{ fill: '#10b981', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Individual Bar Chart for Water Stress */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-4">Water Stress Levels</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  stroke="#6b7280"
                  style={{ fontSize: '12px', fontWeight: 500 }}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar
                  dataKey="waterStress"
                  name="Water Stress (%)"
                  radius={[8, 8, 0, 0]}
                >
                  {monthlyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getWaterStressColor(entry.waterStress)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Annual Water Stress Scatter Plot - All Counties */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            Annual Water Stress - All 47 Counties
          </h3>
          <p className="text-gray-600 mt-1">
            Scatter plot showing water stress levels across Kenya
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4">
          <ResponsiveContainer width="100%" height={500}>
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 80, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                type="number"
                dataKey="waterStress"
                name="Water Stress"
                unit="%"
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                label={{
                  value: 'Water Stress Level (%)',
                  position: 'insideBottom',
                  offset: -10,
                  style: { fontSize: '14px', fontWeight: 600 }
                }}
                domain={[0, 100]}
              />
              <YAxis
                type="number"
                dataKey="population"
                name="Population Estimate"
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                label={{
                  value: 'Population (thousands)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fontSize: '14px', fontWeight: 600 }
                }}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-lg">
                        <p className="font-bold text-gray-800">{data.county}</p>
                        <p className="text-sm text-gray-600">
                          Water Stress: <span className="font-semibold">{data.waterStress}%</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Population: <span className="font-semibold">{(data.population / 1000).toFixed(1)}k</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter
                name="Counties"
                data={annualData}
                fill="#8b5cf6"
              >
                {annualData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getWaterStressColor(entry.waterStress)}
                    opacity={0.8}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500" />
              <span className="text-sm text-gray-700">Low Stress (0-25%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500" />
              <span className="text-sm text-gray-700">Low-Medium (25-50%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-500" />
              <span className="text-sm text-gray-700">Medium-High (50-75%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500" />
              <span className="text-sm text-gray-700">High Stress (75-100%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;

