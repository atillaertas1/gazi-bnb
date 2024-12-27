import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const getUserReservations = async (userId, token) => {
  try {
    const response = await axios.get(`${API_URL}/reservations/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching reservations', error);
    throw error;
  }
};

export const cancelReservation = async (reservationId, token) => {
  try {
    const response = await axios.delete(
      `${API_URL}/reservations/${reservationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; 
  } catch (error) {
    console.error('Error cancelling reservation', error);
    throw error;
  }
};

export const getReservationsByListing = async (listingId, token) => {
  try {
    const response = await axios.get(
      `${API_URL}/reservations/listing/${listingId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching reservations for listing ${listingId}:`,
      error.message
    );
    throw error;
  }
};


export const createReservation = async (reservationData, token) => {
  try {
    const response = await axios.post(`${API_URL}/reservations`, reservationData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
};

