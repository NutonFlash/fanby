import { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import TokenError from '../types/TokenError';
import { checkAndRefreshTokens } from './tokens';

export default function setupAuthInterceptor(axiosInstance: AxiosInstance) {
  axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const result = await checkAndRefreshTokens();
      if (result.type === 'error') {
        throw new TokenError(result.message, result.status);
      }
      config.headers.Authorization = `Bearer ${result.data}`;
      return config;
    },
  );
}
