import { AxiosInstance } from 'axios';
import { request, ErrorResponse, SuccessResponse } from '../../request';
import Proxy from '../../../models/Proxy';

export default async function addProxies(
  axiosInstance: AxiosInstance,
  proxies: Proxy[],
): Promise<SuccessResponse | ErrorResponse> {
  const result = await request(axiosInstance, 'post', '/', { proxies });
  return result;
}
