import { AxiosInstance } from 'axios';
import { request, ErrorResponse, SuccessResponse } from '../../request';

export default async function createInvoice(
  axiosInstance: AxiosInstance,
  priceAmount: number,
  orderDescription: string,
): Promise<SuccessResponse | ErrorResponse> {
  const result = await request(axiosInstance, 'post', '/', {
    priceAmount,
    orderDescription,
  });
  return result;
}
