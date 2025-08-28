
export interface SalesData {
  date: string;
  region: string;
  product: string;
  sales: number;
}

export interface ForecastPoint {
  date: string;
  prediction: number;
  lowerBound: number;
  upperBound: number;
}

export interface AlgorithmParameter {
  id: string;
  name: string;
  description: string;
  type: 'slider' | 'select';
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  defaultValue: number | string;
}

export interface Algorithm {
  name: string;
  description: string;
  parameters: AlgorithmParameter[];
}

export type AlgorithmParameters = Record<string, number | string>;
