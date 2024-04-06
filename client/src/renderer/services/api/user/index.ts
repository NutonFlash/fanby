import axios from 'axios';
import getUser from './get';
import getInfo from './info';
import { ErrorResponse, SuccessResponse } from '../../request';

const API_BASE_URL = window.electron.env.get('API_BASE_URL');

class User {
  private accountsAxios = axios.create({
    baseURL: `${API_BASE_URL}/user`,
  });

  getAxios() {
    return this.accountsAxios;
  }

  async get(): Promise<SuccessResponse | ErrorResponse> {
    return getUser(this.accountsAxios);
  }

  async info(): Promise<SuccessResponse | ErrorResponse> {
    return getInfo(this.accountsAxios);
  }
}

export default new User();
