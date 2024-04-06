import axios from 'axios';
import getAllAccounts from './all';
import addAccount from './add';
import updateAccount from './update';
import deleteAccounts from './delete';
import { ErrorResponse, SuccessResponse } from '../../request';
import Account from '../../../models/Account';

const API_BASE_URL = window.electron.env.get('API_BASE_URL');

class Accounts {
  private accountsAxios = axios.create({
    baseURL: `${API_BASE_URL}/accounts`,
  });

  getAxios() {
    return this.accountsAxios;
  }

  async all(
    withStats: boolean,
    withGroups: boolean,
  ): Promise<SuccessResponse | ErrorResponse> {
    return getAllAccounts(this.accountsAxios, withStats, withGroups);
  }

  async add(
    username: string,
    password: string,
    proxyId: string | null,
  ): Promise<SuccessResponse | ErrorResponse> {
    return addAccount(this.accountsAxios, username, password, proxyId);
  }

  async update(
    id: string,
    account: Account,
  ): Promise<SuccessResponse | ErrorResponse> {
    return updateAccount(this.accountsAxios, id, account);
  }

  async delete(ids: string[]): Promise<SuccessResponse | ErrorResponse> {
    return deleteAccounts(this.accountsAxios, ids);
  }
}

export default new Accounts();
