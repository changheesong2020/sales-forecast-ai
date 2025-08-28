
import React from 'react';
import { ForecastPoint } from '../types';

interface ForecastTableProps {
  data: ForecastPoint[];
}

const ForecastTable: React.FC<ForecastTableProps> = ({ data }) => {

  const downloadCSV = () => {
    const header = "date,prediction,lowerBound,upperBound\n";
    const csvRows = data.map(row => 
      `${row.date},${row.prediction.toFixed(2)},${row.lowerBound.toFixed(2)},${row.upperBound.toFixed(2)}`
    ).join('\n');
    
    const blob = new Blob([header + csvRows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'forecast_data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900">Forecast Data</h3>
        <button onClick={downloadCSV} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Download CSV
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
            <tr>
              <th scope="col" className="px-6 py-3">Date</th>
              <th scope="col" className="px-6 py-3">Prediction</th>
              <th scope="col" className="px-6 py-3">Lower Bound</th>
              <th scope="col" className="px-6 py-3">Upper Bound</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.date} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{row.date}</td>
                <td className="px-6 py-4">{row.prediction.toFixed(2)}</td>
                <td className="px-6 py-4">{row.lowerBound.toFixed(2)}</td>
                <td className="px-6 py-4">{row.upperBound.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ForecastTable;
