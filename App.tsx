
import React, { useState, useCallback } from 'react';
import { SalesData, ForecastPoint, Algorithm, AlgorithmParameters } from './types';
import { ALGORITHMS } from './constants';
import { generateForecast } from './services/geminiService';
import Header from './components/Header';
import DataInput from './components/DataInput';
import ControlPanel from './components/ControlPanel';
import ForecastChart from './components/ForecastChart';
import ForecastTable from './components/ForecastTable';
import Spinner from './components/Spinner';

export default function App() {
  const [historicalData, setHistoricalData] = useState<SalesData[]>([]);
  const [forecastData, setForecastData] = useState<ForecastPoint[]>([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>(ALGORITHMS[0]);
  const [algorithmParams, setAlgorithmParams] = useState<AlgorithmParameters>(
    ALGORITHMS[0].parameters.reduce((acc, p) => ({ ...acc, [p.id]: p.defaultValue }), {})
  );
  const [googleTrendsKeywords, setGoogleTrendsKeywords] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAlgorithmChange = useCallback((algorithmName: string) => {
    const newAlgorithm = ALGORITHMS.find(a => a.name === algorithmName);
    if (newAlgorithm) {
      setSelectedAlgorithm(newAlgorithm);
      const newParams = newAlgorithm.parameters.reduce((acc, p) => ({ ...acc, [p.id]: p.defaultValue }), {});
      setAlgorithmParams(newParams);
    }
  }, []);

  const handleParamsChange = useCallback((paramId: string, value: number | string) => {
    setAlgorithmParams(prevParams => ({
      ...prevParams,
      [paramId]: value
    }));
  }, []);

  const handleRunForecast = async () => {
    if (historicalData.length < 10) {
      setError('Please provide at least 10 data points for a meaningful forecast.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setForecastData([]);

    try {
      const keywords = googleTrendsKeywords.trim();
      const forecast = await generateForecast(
        historicalData,
        selectedAlgorithm,
        algorithmParams,
        keywords ? keywords : undefined
      );
      setForecastData(forecast);
    } catch (e) {
      console.error(e);
      setError('Failed to generate forecast. The AI model might be busy or an error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <DataInput onDataLoaded={setHistoricalData} />
            <ControlPanel
              algorithms={ALGORITHMS}
              selectedAlgorithm={selectedAlgorithm}
              onAlgorithmChange={handleAlgorithmChange}
              params={algorithmParams}
              onParamsChange={handleParamsChange}
              googleTrendsKeywords={googleTrendsKeywords}
              onGoogleTrendsKeywordsChange={setGoogleTrendsKeywords}
            />
            <button
              onClick={handleRunForecast}
              disabled={isLoading || historicalData.length === 0}
              className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? <Spinner /> : 'Run Forecast'}
            </button>
            {error && <p className="text-red-400 text-center mt-2">{error}</p>}
          </div>

          <div className="lg:col-span-8">
            <div className="bg-dark-surface rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-dark-text-primary">Forecast Visualization</h2>
              {isLoading && (
                 <div className="flex flex-col items-center justify-center h-96">
                    <Spinner />
                    <p className="mt-4 text-dark-text-secondary">Generating your 24-month forecast...</p>
                 </div>
              )}
              {!isLoading && forecastData.length === 0 && (
                <div className="flex items-center justify-center h-96 bg-gray-800 rounded-lg">
                  <p className="text-dark-text-secondary">Your forecast chart will appear here.</p>
                </div>
              )}
              {!isLoading && forecastData.length > 0 && (
                <>
                  <ForecastChart historicalData={historicalData} forecastData={forecastData} />
                  <div className="mt-8">
                    <ForecastTable data={forecastData} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
