import { AxiosInstance } from 'axios';
import { request, ErrorResponse, SuccessResponse } from '../../request';

export default async function getInfo(
  axiosInstance: AxiosInstance,
): Promise<SuccessResponse | ErrorResponse> {
  const result = await request(axiosInstance, 'get', '/info');
  return result;
}
