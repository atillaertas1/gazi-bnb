import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const getListings = async () => {
  const token = localStorage.getItem('token');

  try {
    const response = await axios.get(`${API_URL}/listings`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching listings:', error);
    throw error; 
  }
};

export const getListingsForUser = async (userId, token) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/listings/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; 
  } catch (error) {
    console.error('Error fetching listings:', error.response?.data || error.message);
    throw new Error('Error fetching listings');
  }
};

export const deleteListing = async (listingId, token) => {
  try {
    await axios.delete(`http://localhost:8080/api/listings/${listingId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    throw new Error('Error deleting listing');
  }
};

export const getListingById = async (listingId, token) => {
  try {
    const response = await axios.get(`${API_URL}/listings/${listingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data) {
      throw new Error('No data found for this listing');
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching listing with ID ${listingId}:`, error.message);
    throw error; 
  }
};


export const createListing = async (data, token) => {
  const formData = new FormData();

  formData.append('listing', JSON.stringify(data)); 

  if (data.imageFile && data.imageFile instanceof File) {
    formData.append('imageFile', data.imageFile); 
  }

  const response = await fetch('http://localhost:8080/api/listings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to create listing');
  }

  return response.json();
};


