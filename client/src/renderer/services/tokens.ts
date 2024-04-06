import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { request, SuccessResponse, ErrorResponse } from './request';

const API_BASE_URL = window.electron.env.get('API_BASE_URL');

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

function clearTokensAndRedirect() {
  window.electron.store.delete('accessToken');
  window.electron.store.delete('refreshToken');
  window.location.hash = '#login';
}

function saveTokens(accessToken: string, refreshToken: string) {
  window.electron.store.set('accessToken', accessToken);
  window.electron.store.set('refreshToken', refreshToken);
}

export function getUserIdFromToken(token: string) {
  const decoded: any = jwtDecode(token);
  return decoded.id;
}

export function isTokenExpired(token: string) {
  const decoded = jwtDecode(token);
  return decoded.exp && decoded.exp < Date.now() / 1000;
}

export async function refreshTokens(): Promise<
  SuccessResponse | ErrorResponse
> {
  const refreshToken = window.electron.store.get('refreshToken', '');
  if (refreshToken) {
    const result = await request(axiosInstance, 'post', '/auth/refresh', {
      refreshToken,
    });

    if (result.type === 'error') {
      return result;
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      result.data;

    saveTokens(newAccessToken, newRefreshToken);

    return { type: 'success', data: newAccessToken };
  }

  // no refresh token
  return {
    type: 'error',
    status: 401,
    message: 'Authorization error. Please relogin in the app.',
  };
}

export async function checkAndRefreshTokens(): Promise<
  SuccessResponse | ErrorResponse
> {
  const accessToken = window.electron.store.get('accessToken', '');
  const refreshToken = window.electron.store.get('refreshToken', '');

  if (!accessToken || !refreshToken) {
    clearTokensAndRedirect();
    return {
      type: 'error',
      status: 401,
      message: 'Authorization error. Please relogin in the app.',
    };
  }

  if (!isTokenExpired(accessToken)) {
    return { type: 'success', data: accessToken };
  }

  if (!isTokenExpired(refreshToken)) {
    const result = await refreshTokens();
    if (result.type === 'error' && result.status === 401) {
      clearTokensAndRedirect();
    }
    return result;
  }

  clearTokensAndRedirect();
  return {
    type: 'error',
    status: 401,
    message: 'Authorization error. Please relogin in the app.',
  };
}

export default {
  isTokenExpired,
  refreshTokens,
  checkAndRefreshTokens,
  getUserIdFromToken,
};
