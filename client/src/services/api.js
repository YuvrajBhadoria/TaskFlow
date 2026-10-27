// Base API client using Fetch API
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const getAuthToken = () => {
  return localStorage.getItem('taskflow_token');
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('taskflow_token', token);
  } else {
    localStorage.removeItem('taskflow_token');
  }
};

export const removeAuthToken = () => {
  localStorage.removeItem('taskflow_token');
};

/**
 * Common fetch wrapper that:
 * 1. Automatically attaches Authorization header if token exists
 * 2. Handles credentials for cookie-based setups
 * 3. Formats error responses consistently
 * 4. Handles 204 No Content gracefully
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
    credentials: 'include' // Send cookies cross-origin/same-origin
  };

  try {
    const response = await fetch(url, config);

    // 204 No Content has no body
    if (response.status === 204) {
      return null;
    }

    let data = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage = data?.error?.message || data?.message || `Request failed with status ${response.status}`;
      const errorCode = data?.error?.code || 'API_ERROR';
      const error = new Error(errorMessage);
      error.status = response.status;
      error.code = errorCode;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    // If it was a network error (offline, refused connection)
    if (!err.status) {
      err.code = 'NETWORK_ERROR';
      err.message = 'Unable to connect to the server. Please check your connection or server status.';
    }
    throw err;
  }
}
