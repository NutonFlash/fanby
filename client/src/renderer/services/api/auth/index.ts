import axios from 'axios';
import login from './login';
import register from './register';
import { ErrorResponse, SuccessResponse } from '../../request';

const API_BASE_URL = window.electron.env.get('API_BASE_URL');

class Auth {
  private authAxios = axios.create({
    baseURL: `${API_BASE_URL}/auth`,
  });

  getAxios() {
    return this.authAxios;
  }

  async login(
    email: string,
    password: string,
  ): Promise<SuccessResponse | ErrorResponse> {
    return login(this.authAxios, email, password);
  }

  async register(
    email: string,
    password: string,
    referalCode: string,
  ): Promise<SuccessResponse | ErrorResponse> {
    return register(this.authAxios, email, password, referalCode);
  }
}

export default new Auth();
