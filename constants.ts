
import { Algorithm } from './types';

export const ALGORITHMS: Algorithm[] = [
  {
    name: 'Prophet',
    description: 'A robust forecasting model that works well with time series that have strong seasonal effects and several seasons of historical data.',
    parameters: [
      {
        id: 'growth',
        name: 'Growth Model',
        description: 'Specify "linear" or "logistic" growth.',
        type: 'select',
        options: ['linear', 'logistic'],
        defaultValue: 'linear',
      },
      {
        id: 'changepoint_prior_scale',
        name: 'Trend Flexibility',
        description: 'Adjusts the flexibility of the trend. Higher values make the trend more flexible.',
        type: 'slider',
        min: 0.01,
        max: 0.5,
        step: 0.01,
        defaultValue: 0.05,
      },
      {
        id: 'seasonality_prior_scale',
        name: 'Seasonality Strength',
        description: 'Adjusts the strength of the seasonality. Higher values allow the seasonality to fit larger fluctuations.',
        type: 'slider',
        min: 1,
        max: 20,
        step: 1,
        defaultValue: 10,
      }
    ]
  },
  {
    name: 'ARIMA',
    description: 'Autoregressive Integrated Moving Average. A classic time series model that explains a given time series based on its own past values.',
    parameters: [
      {
        id: 'p',
        name: 'AR order (p)',
        description: 'The number of lag observations included in the model.',
        type: 'slider',
        min: 0,
        max: 10,
        step: 1,
        defaultValue: 5,
      },
      {
        id: 'd',
        name: 'Differencing (d)',
        description: 'The number of times the raw observations are differenced.',
        type: 'slider',
        min: 0,
        max: 3,
        step: 1,
        defaultValue: 1,
      },
      {
        id: 'q',
        name: 'MA order (q)',
        description: 'The size of the moving average window.',
        type: 'slider',
        min: 0,
        max: 10,
        step: 1,
        defaultValue: 0,
      }
    ]
  },
  {
    name: 'Random Forest',
    description: 'A machine learning model that fits a number of decision tree classifiers on various sub-samples of the dataset.',
    parameters: [
      {
        id: 'n_estimators',
        name: 'Number of Trees',
        description: 'The number of trees in the forest.',
        type: 'slider',
        min: 10,
        max: 500,
        step: 10,
        defaultValue: 100,
      },
      {
        id: 'max_depth',
        name: 'Max Tree Depth',
        description: 'The maximum depth of the tree. Limits how complex the model can be.',
        type: 'slider',
        min: 1,
        max: 30,
        step: 1,
        defaultValue: 10,
      }
    ]
  }
];
