import { AxiosInstance } from 'axios';
import { request, ErrorResponse, SuccessResponse } from '../../request';

export default async function getUser(
  axiosInstance: AxiosInstance,
): Promise<SuccessResponse | ErrorResponse> {
  const result = await request(axiosInstance, 'get', '/get');
  return result;
}
