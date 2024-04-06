import { AxiosInstance } from 'axios';
import { request, ErrorResponse, SuccessResponse } from '../../request';

export default async function updateProxy(
  axiosInstance: AxiosInstance,
  id: string,
  values: { [x: string]: any },
): Promise<SuccessResponse | ErrorResponse> {
  const result = await request(axiosInstance, 'put', `/${id}`, values);
  return result;
}
