import axios from 'axios';

const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      console.log('Token bulunamadı, kullanıcı giriş yapmamış');
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
      console.log('Yetkisiz erişim - token geçersiz veya süresi dolmuş olabilir');
    }
    console.error('Mevcut kullanıcı alınırken hata oluştu:', error.message);
    return null;
  }
};

export { getCurrentUser };
