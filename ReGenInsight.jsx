import React, { useState } from 'react';
import { counties } from '../data/counties';
import {
  Brain,
  TreePine,
  Coins,
  Leaf,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Zap,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const ReGenInsight = ({ selectedRegion }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const county = counties.find(c => c.id === selectedRegion);

  const runAIAnalysis = () => {
    setAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const carbonData = [
        { name: 'Sequestered', value: county.carbonPotential * 0.6, color: '#10b981' },
        { name: 'Potential', value: county.carbonPotential * 0.4, color: '#94a3b8' }
      ];

      setAnalysis({
        landHealth: 100 - county.degradation,
        restorationPriority: county.degradation > 60 ? 'High' : county.degradation > 40 ? 'Medium' : 'Low',
        carbonCredits: Math.floor(county.carbonPotential * 0.8 * 20), // $20 per tCO2
        interventionCost: Math.floor(county.area * 15),
        roi: Math.floor(150 + Math.random() * 100),
        carbonData,
        treesRecommended: Math.floor(county.area * 0.6),
        estimatedImpact: {
          co2Reduction: Math.floor(county.carbonPotential * 0.8),
          waterRetention: Math.floor(county.rainfall * 0.15),
          soilImprovement: Math.floor((100 - county.degradation) * 0.8)
        }
      });
      setAnalyzing(false);
    }, 2000);
  };

  if (!county) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Please select a county to access ReGen Insight</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Brain className="w-8 h-8" />
              ReGen Insight
            </h2>
            <p className="text-purple-100 mt-2">
              AI-Powered Regenerative Intelligence for {county.name}
            </p>
          </div>
          <Button
            onClick={runAIAnalysis}
            disabled={analyzing}
            className="bg-white text-purple-600 hover:bg-purple-50"
          >
            {analyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Run AI Analysis
              </>
            )}
          </Button>
        </div>
      </div>

      {/* AI Tree Species Recommender */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TreePine className="w-6 h-6 text-green-600" />
          AI-Based Tree Species Recommender
        </h3>

        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-green-800 mb-3">
            Based on soil type, climate, rainfall, and degradation levels, our AI recommends the following species:
          </p>
          
          <div className="space-y-3">
            {county.recommendedSpecies.map((species, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-green-600" />
                      {species}
                    </h4>
                    <div className="mt-2 grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Survival Rate:</span>
                        <span className="font-semibold text-green-700 ml-1">
                          {85 + idx * 3}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Growth:</span>
                        <span className="font-semibold text-blue-700 ml-1">
                          {idx === 0 ? 'Fast' : idx === 1 ? 'Medium' : 'Slow'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Carbon/tree:</span>
                        <span className="font-semibold text-purple-700 ml-1">
                          {(20 + idx * 5).toFixed(1)} kg/yr
                        </span>
                      </div>
                    </div>
                  </div>
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Environmental Conditions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-blue-700 font-medium mb-1">Soil Type</p>
            <p className="text-sm font-bold text-gray-800">{county.soilType}</p>
          </div>
          <div className="bg-cyan-50 rounded-lg p-3">
            <p className="text-xs text-cyan-700 font-medium mb-1">Climate Zone</p>
            <p className="text-sm font-bold text-gray-800">
              {county.rainfall > 800 ? 'Humid' : county.rainfall > 500 ? 'Semi-arid' : 'Arid'}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs text-green-700 font-medium mb-1">Annual Rainfall</p>
            <p className="text-sm font-bold text-gray-800">{county.rainfall} mm</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <p className="text-xs text-purple-700 font-medium mb-1">NDVI Score</p>
            <p className="text-sm font-bold text-gray-800">{county.ndvi}</p>
          </div>
        </div>
      </div>

      {/* Carbon Estimation Dashboard */}
      {analysis && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Coins className="w-6 h-6 text-yellow-600" />
            Carbon Estimation Dashboard
          </h3>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-5 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-90">Total Carbon Potential</span>
                <TreePine className="w-5 h-5" />
              </div>
              <p className="text-3xl font-bold">{(county.carbonPotential / 1000).toFixed(1)}k</p>
              <p className="text-sm opacity-90 mt-1">tCO₂ over 20 years</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg p-5 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-90">Estimated Credits</span>
                <DollarSign className="w-5 h-5" />
              </div>
              <p className="text-3xl font-bold">${(analysis.carbonCredits / 1000).toFixed(0)}k</p>
              <p className="text-sm opacity-90 mt-1">At $20/tCO₂</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg p-5 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-90">Expected ROI</span>
                <TrendingUp className="w-5 h-5" />
              </div>
              <p className="text-3xl font-bold">{analysis.roi}%</p>
              <p className="text-sm opacity-90 mt-1">Including carbon credits</p>
            </div>
          </div>

          {/* Carbon Distribution Chart */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-4">Carbon Sequestration Progress</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={analysis.carbonData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analysis.carbonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Trees Recommended</span>
                    <TreePine className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {analysis.treesRecommended.toLocaleString()}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Intervention Cost</span>
                    <DollarSign className="w-4 h-4 text-orange-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    ${(analysis.interventionCost / 1000).toFixed(0)}k
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Priority Level</span>
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full font-bold text-sm ${
                    analysis.restorationPriority === 'High' ? 'bg-red-500 text-white' :
                    analysis.restorationPriority === 'Medium' ? 'bg-yellow-500 text-white' :
                    'bg-green-500 text-white'
                  }`}>
                    {analysis.restorationPriority}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Estimated Impact */}
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Estimated Environmental Impact
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600 mb-2">CO₂ Reduction</p>
                <p className="text-2xl font-bold text-green-600">
                  {(analysis.estimatedImpact.co2Reduction / 1000).toFixed(1)}k tCO₂
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600 mb-2">Water Retention</p>
                <p className="text-2xl font-bold text-blue-600">
                  {analysis.estimatedImpact.waterRetention} mm/yr
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600 mb-2">Soil Improvement</p>
                <p className="text-2xl font-bold text-purple-600">
                  {analysis.estimatedImpact.soilImprovement}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReGenInsight;

