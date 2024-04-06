import { AxiosInstance } from 'axios';
import { request, ErrorResponse, SuccessResponse } from '../../request';

export default async function login(
  axiosInstance: AxiosInstance,
  email: string,
  password: string,
): Promise<SuccessResponse | ErrorResponse> {
  const result = request(axiosInstance, 'post', '/login', {
    email,
    password,
  });

  return result;
}
