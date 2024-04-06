import { AxiosInstance } from 'axios';
import { request, ErrorResponse, SuccessResponse } from '../../request';

export default async function addAccount(
  axiosInstance: AxiosInstance,
  username: string,
  password: string,
  proxyId: string | null,
): Promise<SuccessResponse | ErrorResponse> {
  const result = await request(axiosInstance, 'post', '/', {
    username,
    password,
    proxyId,
  });
  return result;
}
