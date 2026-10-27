import { apiRequest, setAuthToken, removeAuthToken } from './api';

export const authService = {
  async register({ name, email, password }) {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    if (data?.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  async login({ email, password }) {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data?.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  async logout() {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } finally {
      removeAuthToken();
    }
  },

  async getMe() {
    return apiRequest('/auth/me');
  }
};
