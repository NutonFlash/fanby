import axios from 'axios';
import getAllProxies from './all';
import addProxies from './add';
import updateProxy from './update';
import deleteProxies from './delete';
import checkProxies from './check';
import { ErrorResponse, SuccessResponse } from '../../request';
import Proxy from '../../../models/Proxy';

const API_BASE_URL = window.electron.env.get('API_BASE_URL');

class Proxies {
  private proxiesAxios = axios.create({
    baseURL: `${API_BASE_URL}/proxies`,
  });

  getAxios() {
    return this.proxiesAxios;
  }

  async all(): Promise<SuccessResponse | ErrorResponse> {
    return getAllProxies(this.proxiesAxios);
  }

  async add(proxies: Proxy[]): Promise<SuccessResponse | ErrorResponse> {
    return addProxies(this.proxiesAxios, proxies);
  }

  async update(
    id: string,
    values: { [x: string]: any },
  ): Promise<SuccessResponse | ErrorResponse> {
    return updateProxy(this.proxiesAxios, id, values);
  }

  async delete(ids: string[]): Promise<SuccessResponse | ErrorResponse> {
    return deleteProxies(this.proxiesAxios, ids);
  }

  async check(ids: string[]): Promise<SuccessResponse | ErrorResponse> {
    return checkProxies(this.proxiesAxios, ids);
  }
}

export default new Proxies();
