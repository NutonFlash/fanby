import { AxiosInstance } from 'axios';
import { request, ErrorResponse, SuccessResponse } from '../../request';

export default async function deleteProxies(
  axiosInstance: AxiosInstance,
  ids: string[],
): Promise<SuccessResponse | ErrorResponse> {
  const result = await request(
    axiosInstance,
    'delete',
    `/?ids=${ids.join(',')}`,
  );
  return result;
}
