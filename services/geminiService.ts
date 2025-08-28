
import { GoogleGenAI, Type } from "@google/genai";
import { SalesData, Algorithm, AlgorithmParameters, ForecastPoint } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

function formatDataToCSV(data: SalesData[]): string {
  const header = 'date,region,product,sales\n';
  const rows = data.map(d => `${d.date},${d.region},${d.product},${d.sales}`);
  return header + rows.join('\n');
}

const forecastSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      date: {
        type: Type.STRING,
        description: "The date of the forecast point in YYYY-MM-DD format.",
      },
      prediction: {
        type: Type.NUMBER,
        description: "The forecasted sales value for that date.",
      },
      lowerBound: {
        type: Type.NUMBER,
        description: "The lower bound of the 80% confidence interval for the prediction.",
      },
      upperBound: {
        type: Type.NUMBER,
        description: "The upper bound of the 80% confidence interval for the prediction.",
      },
    },
    required: ["date", "prediction", "lowerBound", "upperBound"],
  },
};

export async function generateForecast(
  historicalData: SalesData[], 
  algorithm: Algorithm, 
  params: AlgorithmParameters,
  googleTrendsKeywords?: string
): Promise<ForecastPoint[]> {

  const lastDate = historicalData[historicalData.length - 1].date;
  const dataAsCSV = formatDataToCSV(historicalData);
  const paramsString = JSON.stringify(params, null, 2);

  const trendsPrompt = googleTrendsKeywords 
    ? `Additionally, consider the potential impact of Google Trends for the following keywords as an exogenous variable: "${googleTrendsKeywords}". Increase the weight of this factor in your prediction.`
    : '';

  const prompt = `
    You are a world-class data scientist specializing in sales forecasting.
    Your task is to generate a 24-month sales forecast based on the provided historical data.

    **Historical Data (CSV Format):**
    ---
    ${dataAsCSV}
    ---
    
    **Forecasting Task:**
    1.  **Last Data Point:** The historical data ends on ${lastDate}.
    2.  **Forecast Horizon:** Generate a monthly forecast for the next 24 months, starting from the month after the last data point.
    3.  **Algorithm:** Use the principles of the **${algorithm.name}** model.
    4.  **Parameters:** Apply the following parameters for the model: ${paramsString}.
    5.  ${trendsPrompt}
    6.  **Output Format:** Provide the forecast as a JSON array of objects, strictly adhering to the specified JSON schema. Each object must contain the date (YYYY-MM-DD, use the first day of each month), the predicted sales value, and the lower/upper bounds of an 80% confidence interval.
    
    Ensure the forecast follows the general trend and seasonality of the historical data. The confidence interval should widen for dates further in the future.
  `;
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: forecastSchema,
    },
  });

  const responseText = response.text.trim();
  
  try {
    const parsedJson = JSON.parse(responseText);
    // Basic validation
    if (Array.isArray(parsedJson) && parsedJson.length > 0 && 'prediction' in parsedJson[0]) {
      return parsedJson as ForecastPoint[];
    }
    throw new Error('Invalid JSON structure');
  } catch (error) {
    console.error("Failed to parse Gemini response:", responseText);
    throw new Error("The AI returned an invalid data format. Please try again.");
  }
}
