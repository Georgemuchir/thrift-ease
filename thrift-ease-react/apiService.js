import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const signIn = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/signin`, credentials);
    return response.data;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signUp = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, userData);
    return response.data;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};