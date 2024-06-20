// pages/api/getCarCategories.js

import axios from 'axios';
import { parseStringPromise } from 'xml2js';

const CAR_CATEGORIES_API_URL = 'https://originlaravel.iahwservice.com/getCarCategories';

export default async function handler(req, res) {
  try {
    // Fetch data from the external XML API
    const response = await axios.get(CAR_CATEGORIES_API_URL);

    // Parse XML response to JSON using xml2js
    const parsedResponse = await parseStringPromise(response.data, { explicitArray: false });

    // Extract car categories list from parsed response
    const carCategories = parsedResponse.message.serviceResponse.carCategoryList.carCategory;

    // Ensure carCategories is an array
    const carCategoriesArray = Array.isArray(carCategories) ? carCategories : [carCategories];

    // Send the car categories data as JSON response
    res.status(200).json(carCategoriesArray);
  } catch (error) {
    console.error('Error fetching car categories:', error);
    res.status(500).json({ message: 'Error fetching car categories' });
  }
}
