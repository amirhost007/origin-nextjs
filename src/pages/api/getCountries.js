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
    console.log('Fetching countries from API');
    const countriesResponse = await fetchWithRetry('https://originlaravel.iahwservice.com/getCountries', {
      method: 'GET',
    });

    console.log('Countries XML response:', countriesResponse.data);

    // Parse XML response
    const parsedResponse = await parseXmlResponse(countriesResponse.data);

    console.log('Parsed countries response:', parsedResponse);

    // Extract country list from parsed response
    const countryList = parsedResponse.message.serviceResponse.countryList.country;

    // Ensure countryList is an array
    const countryArray = Array.isArray(countryList) ? countryList : [countryList];

    return res.status(200).json(countryArray);
  } catch (error) {
    console.error('Error fetching data from API:', {
      message: error.message,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data,
      } : 'No response received',
    });
    return res.status(500).json({ message: 'Error fetching data from API', details: error.message });
  }
}
