import axios from 'axios';
import checkServerHealth from './server';
import checkPaymentHealth from './payment';
import checkDatabaseHealth from './database';
import { ErrorResponse, SuccessResponse } from '../../request';

const API_BASE_URL = window.electron.env.get('API_BASE_URL');

class Health {
  private healthAxios = axios.create({
    baseURL: `${API_BASE_URL}/health`,
  });

  getAxios() {
    return this.healthAxios;
  }

  async server(): Promise<SuccessResponse | ErrorResponse> {
    return checkServerHealth(this.healthAxios);
  }

  async payment(): Promise<SuccessResponse | ErrorResponse> {
    return checkPaymentHealth(this.healthAxios);
  }

  async database(): Promise<SuccessResponse | ErrorResponse> {
    return checkDatabaseHealth(this.healthAxios);
  }
}

export default new Health();
