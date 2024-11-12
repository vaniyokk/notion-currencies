import { API_ENDPOINTS } from "../constants.js";

const fetchData = async (endpoint) => {
  const BASE_URL = process.env.CURRENCY_API_URL;
  const url = `${BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};

export const fetchCurrencies = async () => {
  return await fetchData(API_ENDPOINTS.currencies);
};

export const fetchExchangeRates = async () => {
  const data = await fetchData(API_ENDPOINTS.rates);
  const baseCurrency = (process.env.BASE_CURRENCY || "USD").toLowerCase();

  return data[baseCurrency];
};
