import React, { useState, ChangeEvent, useEffect } from 'react';
import type { SalesData } from '../types';

interface DataInputProps {
  onDataLoaded: (data: SalesData[]) => void;
}

const DataInput: React.FC<DataInputProps> = ({ onDataLoaded }) => {
  const [originalData, setOriginalData] = useState<SalesData[]>([]);
  const [countryFilter, setCountryFilter] = useState('All');
  const [productFilter, setProductFilter] = useState('All');
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
        const requiredHeaders = ['year', 'month', 'sales', 'country', 'product'];
        if (!requiredHeaders.every(h => header.includes(h))) {
          throw new Error('CSV must contain year, month, sales, country, and product columns.');
        }

        const data: SalesData[] = rows.slice(1).map(row => {
          const values = row.split(',');
          return {
            year: parseInt(values[header.indexOf('year')].trim(), 10),
            month: parseInt(values[header.indexOf('month')].trim(), 10),
            sales: parseFloat(values[header.indexOf('sales')].trim()),
            country: values[header.indexOf('country')].trim(),
            product: values[header.indexOf('product')].trim(),
          };
        }).filter(d => !isNaN(d.sales) && !isNaN(d.year) && !isNaN(d.month));

        setOriginalData(data);
      } catch (err) {
        setError('Failed to parse CSV file. Please check the format.');
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  const countries = Array.from(new Set(originalData.map(d => d.country)));
  const products = Array.from(new Set(originalData.map(d => d.product)));

  useEffect(() => {
    const filtered = originalData.filter(d =>
      (countryFilter === 'All' || d.country === countryFilter) &&
      (productFilter === 'All' || d.product === productFilter)
    );
    onDataLoaded(filtered);
  }, [originalData, countryFilter, productFilter, onDataLoaded]);

  const sampleData: SalesData[] = [
    { year: 2022, month: 1, sales: 1500, country: 'North', product: 'Gadget' },
    { year: 2022, month: 2, sales: 1650, country: 'North', product: 'Gadget' },
    { year: 2022, month: 3, sales: 1800, country: 'North', product: 'Gadget' },
    { year: 2022, month: 4, sales: 1750, country: 'North', product: 'Gadget' },
    { year: 2022, month: 5, sales: 1900, country: 'North', product: 'Gadget' },
    { year: 2022, month: 6, sales: 2100, country: 'North', product: 'Gadget' },
    { year: 2022, month: 7, sales: 2050, country: 'North', product: 'Gadget' },
    { year: 2022, month: 8, sales: 2200, country: 'North', product: 'Gadget' },
    { year: 2022, month: 9, sales: 2300, country: 'North', product: 'Gadget' },
    { year: 2022, month: 10, sales: 2500, country: 'North', product: 'Gadget' },
    { year: 2022, month: 11, sales: 2800, country: 'North', product: 'Gadget' },
    { year: 2022, month: 12, sales: 3200, country: 'North', product: 'Gadget' },
    { year: 2023, month: 1, sales: 1800, country: 'North', product: 'Gadget' },
    { year: 2023, month: 2, sales: 1950, country: 'North', product: 'Gadget' },
    { year: 2023, month: 3, sales: 2100, country: 'North', product: 'Gadget' },
    { year: 2023, month: 4, sales: 2050, country: 'North', product: 'Gadget' },
  ];

  return (
    <div className="bg-dark-surface rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-dark-text-primary">1. Input Your Data</h2>

      {originalData.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-dark-text-secondary mb-1">Country</label>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-dark-text-primary focus:ring-brand-primary focus:border-brand-primary"
            >
              <option value="All">All Countries</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-text-secondary mb-1">Product</label>
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-dark-text-primary focus:ring-brand-primary focus:border-brand-primary"
            >
              <option value="All">All Products</option>
              {products.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-2 text-dark-text-secondary">Upload CSV</h3>
        <p className="text-sm text-gray-400 mb-3">Must contain columns: year, month, sales, country, product.</p>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-secondary file:text-brand-primary hover:file:bg-blue-200"
        />
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        <p className="text-center my-4 text-gray-500">OR</p>
        <button
          onClick={() => setOriginalData(sampleData)}
          className="w-full bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300"
        >
          Load Sample Data
        </button>
      </div>
    </div>
  );
};

export default DataInput;

