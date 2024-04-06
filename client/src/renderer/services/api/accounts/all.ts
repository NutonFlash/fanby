import { AxiosInstance } from 'axios';
import { request, ErrorResponse, SuccessResponse } from '../../request';

export default async function getAllAccounts(
  axiosInstance: AxiosInstance,
  withStats: boolean,
  withGroups: boolean,
): Promise<SuccessResponse | ErrorResponse> {
  const result = await request(
    axiosInstance,
    'get',
    `/?${withStats ? 'withStats=true&' : ''}${withGroups ? 'withGroups=true' : ''}`,
  );
  return result;
}
