export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const ENDPOINTS = {
  login: `${API_URL}/auth/login`,
  register: `${API_URL}/users`,
  profile: `${API_URL}/users/profile`,
  sendResetPassword: `${API_URL}/auth/send-reset-password`,
  resetPassword: `${API_URL}/auth/reset-password`,
};