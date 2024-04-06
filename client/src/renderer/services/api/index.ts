import accounts from './accounts';
import auth from './auth';
import health from './health';
import invoices from './invoices';
import proxies from './proxies';
import user from './user';
import setupAuthInterceptor from '../utils';

const needAuth = [accounts, invoices, proxies, user];

export default class ApiService {
  accounts = accounts;

  auth = auth;

  health = health;

  invoices = invoices;

  proxies = proxies;

  user = user;

  constructor() {
    needAuth.forEach((service) => {
      setupAuthInterceptor(service.getAxios());
    });
  }
}
