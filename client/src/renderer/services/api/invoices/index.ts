import axios from 'axios';
import createInvoice from './create';
import getAllInvoices from './all';
import { ErrorResponse, SuccessResponse } from '../../request';

const API_BASE_URL = window.electron.env.get('API_BASE_URL');

class Invoices {
  private invoicesAxios = axios.create({
    baseURL: `${API_BASE_URL}/invoices`,
  });

  getAxios() {
    return this.invoicesAxios;
  }

  async all(): Promise<SuccessResponse | ErrorResponse> {
    return getAllInvoices(this.invoicesAxios);
  }

  async create(
    priceAmount: number,
    orderDescription: string,
  ): Promise<SuccessResponse | ErrorResponse> {
    return createInvoice(this.invoicesAxios, priceAmount, orderDescription);
  }
}

export default new Invoices();
