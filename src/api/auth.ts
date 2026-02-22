import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://itg-collect-api.enhanceable.io/api';

export const authApi = {
  login(email: string, password: string) {
    return axios.post(`${API_URL}/token`, {
      email,
      password,
      device_name: 'itg-collect-pwa',
    });
  },

  register(name: string, email: string, password: string, password_confirmation: string) {
    return axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
      password_confirmation,
    });
  },

  updateProfile(token: string, profile: any) {
    return axios.put(`${API_URL}/profile`, profile, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
