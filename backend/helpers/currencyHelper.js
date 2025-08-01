const axios = require("axios");
require('dotenv').config();

const API_KEY = process.env.API_KEY; 
const BASE_URL = process.env.BASE_URL;

const getExchangeRates = async () => {
    try {
        const response = await axios.get(BASE_URL);
        return response.data.conversion_rates;
    } catch (error) {
        console.error("Error fetching exchange rates:", error);
        throw new Error("Failed to fetch exchange rates.");
    }
};

const convertCurrency = async (amount, fromCurrency, toCurrency) => {
    try {
        const rates = await getExchangeRates();
        if (!rates[fromCurrency] || !rates[toCurrency]) {
            throw new Error("Invalid currency code.");
        }
        const convertedAmount = (amount / rates[fromCurrency]) * rates[toCurrency];
        return convertedAmount.toFixed(2); // 2 decimal places
    } catch (error) {
        console.error("Error converting currency:", error);
        throw new Error("Failed to convert currency.");
    }
};

module.exports = { getExchangeRates, convertCurrency };