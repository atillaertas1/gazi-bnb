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
    console.error('Listeleme verileri alınırken hata oluştu:', error);
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
    console.error('Kullanıcıya ait listelemeler alınırken hata oluştu:', error.response?.data || error.message);
    throw new Error('Kullanıcıya ait listelemeler alınırken hata oluştu');
  }
};

export const deleteListing = async (listingId, token) => {
  try {
    await axios.delete(`http://localhost:8080/api/listings/${listingId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    throw new Error('Listeleme silinirken hata oluştu');
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
      throw new Error('Bu listeleme için veri bulunamadı');
    }

    return response.data;
  } catch (error) {
    console.error(`ID ${listingId} olan listeleme alınırken hata oluştu:`, error.message);
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
    throw new Error('Listeleme oluşturulamadı');
  }

  return response.json();
};
