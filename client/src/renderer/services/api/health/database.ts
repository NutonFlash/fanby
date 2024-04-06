import { AxiosInstance } from 'axios';
import { request, ErrorResponse, SuccessResponse } from '../../request';

export default async function checkDatabaseHealth(
  axiosInstance: AxiosInstance,
): Promise<SuccessResponse | ErrorResponse> {
  const result = await request(axiosInstance, 'post', '/database');
  return result;
}
