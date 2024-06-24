// pages/api/quote.js

import axios from 'axios';
import { parseStringPromise } from 'xml2js';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function fetchWithRetry(url, options, retries = MAX_RETRIES) {
  try {
    return await axios(url, options);
  } catch (error) {
    if (retries === 1 || error.response.status !== 502) {
      throw error;
    }
    console.log(`Retrying... (${MAX_RETRIES - retries + 1})`);
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    return fetchWithRetry(url, options, retries - 1);
  }
}

async function parseXmlResponse(xmlString) {
  try {
    const parsedResult = await parseStringPromise(xmlString, { explicitArray: false });
    return parsedResult;
  } catch (error) {
    console.error('Error parsing XML:', error);
    throw new Error('Failed to parse XML response');
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Fetching quote from Europcar API');
    const quoteResponse = await fetchWithRetry('https://originlaravel.iahwservice.com/getQuote', {
      method: 'GET',
    });

    console.log('Quote XML response:', quoteResponse.data);

    // Parse XML response
    const parsedResponse = await parseXmlResponse(quoteResponse.data);

    console.log('Parsed quote response:', parsedResponse);

    // Return the parsed response
    return res.status(200).json(parsedResponse);
  } catch (error) {
    console.error('Error fetching quote from Europcar API:', {
      message: error.message,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data,
      } : 'No response received',
    });
    return res.status(500).json({ message: 'Error fetching quote from Europcar API', details: error.message });
  }
}
