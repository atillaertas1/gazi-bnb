import axios from 'axios';

export const getUserById = async (userId, token) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error; 
  }
};