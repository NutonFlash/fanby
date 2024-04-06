import { AxiosInstance } from 'axios';
import { request, ErrorResponse, SuccessResponse } from '../../request';
import Account from '../../../models/Account';

export default async function updateAccount(
  axiosInstance: AxiosInstance,
  id: string,
  account: Account,
): Promise<SuccessResponse | ErrorResponse> {
  const result = await request(axiosInstance, 'put', `/${id}`, account);
  return result;
}
