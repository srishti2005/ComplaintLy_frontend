import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const signup = async (name, email, password) => {
  const response = await api.post('/signup', { name, email, password });
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post('/login', { email, password });
  return response.data;
};

export const classifyComplaint = async (complaintData) => {
  const response = await api.post('/classify', complaintData);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

export const getComplaints = async () => {
  const response = await api.get('/complaints');
  return response.data;
};

export const updateComplaint = async (complaintId, data) => {
  const response = await api.put(`/complaint/${complaintId}`, data);
  return response.data;
};

export default api;