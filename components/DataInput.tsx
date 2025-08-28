
import React, { useState, ChangeEvent } from 'react';
import type { SalesData } from '../types';

interface DataInputProps {
  onDataLoaded: (data: SalesData[]) => void;
}

const DataInput: React.FC<DataInputProps> = ({ onDataLoaded }) => {
  const [activeTab, setActiveTab] = useState<'csv' | 'manual'>('csv');
  const [manualData, setManualData] = useState<Partial<SalesData>[]>([
    { date: '2022-01-01', region: 'North', product: 'A', sales: 1000 },
    { date: '2022-02-01', region: 'North', product: 'A', sales: 1100 },
  ]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const rows = text.split('\n').filter(row => row.trim() !== '');
        const header = rows[0].split(',').map(h => h.trim());
        const requiredHeaders = ['date', 'region', 'product', 'sales'];
        if(!requiredHeaders.every(h => header.includes(h))) {
            throw new Error('CSV must contain date, region, product, and sales columns.');
        }

        const data: SalesData[] = rows.slice(1).map(row => {
          const values = row.split(',');
          return {
            date: values[header.indexOf('date')].trim(),
            region: values[header.indexOf('region')].trim(),
            product: values[header.indexOf('product')].trim(),
            sales: parseFloat(values[header.indexOf('sales')].trim())
          };
        }).filter(d => !isNaN(d.sales));
        
        onDataLoaded(data);
      } catch (err) {
        setError('Failed to parse CSV file. Please check the format.');
        console.error(err);
      }
    };
    reader.readAsText(file);
  };
  
  return (
    <div className="bg-dark-surface rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-dark-text-primary">1. Input Your Data</h2>
      {/* Tabs would go here if needed, simplified for now */}
      <div>
        <h3 className="text-lg font-semibold mb-2 text-dark-text-secondary">Upload CSV</h3>
        <p className="text-sm text-gray-400 mb-3">Must contain columns: date, region, product, sales.</p>
        <input 
          type="file" 
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-secondary file:text-brand-primary hover:file:bg-blue-200"
        />
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        <p className="text-center my-4 text-gray-500">OR</p>
        <button 
            onClick={() => onDataLoaded([
                { date: '2022-01-01', region: 'North', product: 'Gadget', sales: 1500 },
                { date: '2022-02-01', region: 'North', product: 'Gadget', sales: 1650 },
                { date: '2022-03-01', region: 'North', product: 'Gadget', sales: 1800 },
                { date: '2022-04-01', region: 'North', product: 'Gadget', sales: 1750 },
                { date: '2022-05-01', region: 'North', product: 'Gadget', sales: 1900 },
                { date: '2022-06-01', region: 'North', product: 'Gadget', sales: 2100 },
                { date: '2022-07-01', region: 'North', product: 'Gadget', sales: 2050 },
                { date: '2022-08-01', region: 'North', product: 'Gadget', sales: 2200 },
                { date: '2022-09-01', region: 'North', product: 'Gadget', sales: 2300 },
                { date: '2022-10-01', region: 'North', product: 'Gadget', sales: 2500 },
                { date: '2022-11-01', region: 'North', product: 'Gadget', sales: 2800 },
                { date: '2022-12-01', region: 'North', product: 'Gadget', sales: 3200 },
                { date: '2023-01-01', region: 'North', product: 'Gadget', sales: 1800 },
                { date: '2023-02-01', region: 'North', product: 'Gadget', sales: 1950 },
                { date: '2023-03-01', region: 'North', product: 'Gadget', sales: 2100 },
                { date: '2023-04-01', region: 'North', product: 'Gadget', sales: 2050 },
            ])}
            className="w-full bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300"
        >
            Load Sample Data
        </button>
      </div>
    </div>
  );
};

export default DataInput;
