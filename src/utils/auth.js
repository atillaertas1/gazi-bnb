// src/utils/auth.js

import axios from 'axios';

// Kayıt fonksiyonu
export const registerUser = async (data) => {
  try {
    const response = await axios.post('http://localhost:8080/api/users/register', data);
    return response.data; // Kayıt başarılı olduğunda dönecek veri
  } catch (error) {
    throw new Error('Bir şeyler yanlış gitti.');
  }
};

// Login fonksiyonu (önceki fonksiyon)
export const loginUser = async (data) => {
  try {
    const response = await axios.post('http://localhost:8080/api/users/login', data);
    return response.data; // JWT token döndürülüyor
  } catch (error) {
    throw new Error('Kullanıcı adı veya şifre hatalı!');
  }
};

// Kullanıcı güncelleme fonksiyonu
export const updateUser = async (userId, data, token) => {
  try {
    const response = await axios.put(`http://localhost:8080/api/users/${userId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data; // Güncellenmiş kullanıcı bilgileri döndürülüyor
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Kullanıcı güncellenirken bir hata oluştu!';
    throw new Error(errorMessage);
  }
};
