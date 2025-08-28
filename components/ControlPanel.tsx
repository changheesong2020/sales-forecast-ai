
import React from 'react';
import type { Algorithm, AlgorithmParameters } from '../types';

interface ControlPanelProps {
  algorithms: Algorithm[];
  selectedAlgorithm: Algorithm;
  onAlgorithmChange: (name: string) => void;
  params: AlgorithmParameters;
  onParamsChange: (paramId: string, value: number | string) => void;
  googleTrendsKeywords: string;
  onGoogleTrendsKeywordsChange: (keywords: string) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  algorithms,
  selectedAlgorithm,
  onAlgorithmChange,
  params,
  onParamsChange,
  googleTrendsKeywords,
  onGoogleTrendsKeywordsChange
}) => {
  return (
    <div className="bg-dark-surface rounded-xl shadow-lg p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4 text-dark-text-primary">2. Configure Forecast</h2>
        <label htmlFor="algorithm-select" className="block text-sm font-medium text-dark-text-secondary mb-1">
          Forecasting Algorithm
        </label>
        <select
          id="algorithm-select"
          value={selectedAlgorithm.name}
          onChange={(e) => onAlgorithmChange(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-dark-text-primary focus:ring-brand-primary focus:border-brand-primary"
        >
          {algorithms.map(algo => (
            <option key={algo.name} value={algo.name}>{algo.name}</option>
          ))}
        </select>
        <p className="text-xs text-gray-400 mt-2">{selectedAlgorithm.description}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 text-dark-text-secondary">Algorithm Parameters</h3>
        <div className="space-y-4">
          {selectedAlgorithm.parameters.map(param => (
            <div key={param.id}>
              <label htmlFor={param.id} className="block text-sm font-medium text-dark-text-primary mb-1 flex justify-between">
                <span>{param.name}</span>
                <span>{params[param.id]}</span>
              </label>
              {param.type === 'slider' && (
                <input
                  id={param.id}
                  type="range"
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  value={params[param.id] as number}
                  onChange={(e) => onParamsChange(param.id, parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              )}
               {param.type === 'select' && (
                <select
                  id={param.id}
                  value={params[param.id] as string}
                  onChange={(e) => onParamsChange(param.id, e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-dark-text-primary focus:ring-brand-primary focus:border-brand-primary"
                >
                  {param.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              )}
              <p className="text-xs text-gray-400 mt-1">{param.description}</p>
            </div>
          ))}
        </div>
      </div>

       <div>
        <h3 className="text-lg font-semibold mb-3 text-dark-text-secondary">Google Trends (Optional)</h3>
         <label htmlFor="google-trends" className="block text-sm font-medium text-dark-text-primary mb-1">
           Keywords
        </label>
        <input
          id="google-trends"
          type="text"
          value={googleTrendsKeywords}
          onChange={(e) => onGoogleTrendsKeywordsChange(e.target.value)}
          placeholder="e.g., sustainable products, AI tools"
          className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-dark-text-primary focus:ring-brand-primary focus:border-brand-primary"
        />
        <p className="text-xs text-gray-400 mt-1">Add keywords to have the AI consider their trend impact.</p>
      </div>
    </div>
  );
};

export default ControlPanel;
