import { AxiosInstance } from 'axios';
import { request, ErrorResponse, SuccessResponse } from '../../request';

export default async function register(
  axiosInstance: AxiosInstance,
  email: string,
  password: string,
  referalCode: string,
): Promise<SuccessResponse | ErrorResponse> {
  const result = request(axiosInstance, 'post', '/register', {
    email,
    password,
    referalCode,
  });

  return result;
}
