import { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

export interface SuccessResponse {
  type: 'success';
  data: any;
}

export interface ErrorResponse {
  type: 'error';
  status: number;
  message: string;
}

function setErrorAndRedirect(code: number, message: string) {
  const { store } = window.electron;
  store.set('appError', {
    code,
    message,
    lastPath: window.location.hash,
  });
  window.location.hash = '#error';
}

// error statuses:
// -1 - bad request maden by developer
// 4xx - client side error
// 5xx - server side error
export async function request(
  axiosInstance: AxiosInstance,
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  data?: any,
): Promise<SuccessResponse | ErrorResponse> {
  try {
    const response = await axiosInstance[method](url, data);
    return { type: 'success', data: response.data };
  } catch (error) {
    const e = error as AxiosError;
    // server responded with error
    if (e.response) {
      const res: AxiosResponse = e.response;
      if (res.status >= 400 && res.status < 500) {
        return {
          type: 'error',
          status: res.status,
          message: res.data?.error || e.code,
        };
      }
      if (window.location.hash !== '#error') {
        setErrorAndRedirect(res.status, res.data?.error || e.code);
      }
      return {
        type: 'error',
        status: res.status,
        message: 'The server is currently unavailable.',
      };
    }
    // server not responding
    if (e.request) {
      if (window.location.hash !== '#error') {
        setErrorAndRedirect(503, 'Unable to connect to the server.');
      }
      return {
        type: 'error',
        status: 503,
        message: 'Unable to connect to the server.',
      };
    }
    // request error
    return { type: 'error', status: -1, message: e.message };
  }
}
