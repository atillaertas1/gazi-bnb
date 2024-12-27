import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const addFavorite = async (userId, listingId, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/users/favorites/addFavorite`,
      {
        user: { id: userId },
        listing: { id: listingId },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; 
  } catch (error) {
    console.error('Error adding favorite', error);
    throw error;
  }
};

export const removeFavorite = async (userId, listingId, token) => {
  try {
    const response = await axios.delete(
      `${API_URL}/users/favorites/remove/${userId}/${listingId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; 
  } catch (error) {
    console.error('Error removing favorite', error);
    throw error;
  }
};

export const getFavorites = async (userId, token) => {
  try {
    const response = await axios.get(
      `${API_URL}/users/favorites/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting favorites', error);
    throw error;
  }
};
