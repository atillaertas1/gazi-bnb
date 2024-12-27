import axios from 'axios';

const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      console.log('No token found, user is not logged in');
      return null;
    }

    const response = await axios.get('http://localhost:8080/api/users/current', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    return response.data;

  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized access - token might be invalid or expired');
    }
    console.error('Error fetching current user:', error.message);
    return null;
  }
};

export { getCurrentUser };
