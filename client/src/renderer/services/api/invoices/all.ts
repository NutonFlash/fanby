import { AxiosInstance } from 'axios';
import { request, ErrorResponse, SuccessResponse } from '../../request';

export default async function getAllInvoices(
  axiosInstance: AxiosInstance,
): Promise<SuccessResponse | ErrorResponse> {
  const result = await request(axiosInstance, 'get', '/');
  return result;
}
