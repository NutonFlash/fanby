import { AxiosInstance } from 'axios';
import { request, ErrorResponse, SuccessResponse } from '../../request';

export default async function checkProxies(
  axiosInstance: AxiosInstance,
  ids: string[],
): Promise<SuccessResponse | ErrorResponse> {
  const result = await request(axiosInstance, 'post', `/check`, { ids });
  return result;
}
