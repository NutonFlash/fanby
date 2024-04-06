import AccountStatistics from './AccountStatistics';

export default class Account {
  id: string;

  userId: string;

  proxyId: string;

  username: string;

  password: string;

  accountStatistics: AccountStatistics;

  isActivated: boolean;

  expirationDate: Date;

  isRunning: boolean;

  statusType: 'success' | 'warning' | 'error' | 'disabled';

  statusLabel: string;

  statusDetails: string;

  constructor(
    id: string,
    userId: string,
    proxyId: string,
    username: string,
    password: string,
    // accountStatistics: AccountStatistics,
    isActivated: boolean,
    expirationDate: Date,
    isRunning: boolean,
    statusType: 'success' | 'warning' | 'error' | 'disabled',
    statusLabel: string,
    statusDetails: string,
  ) {
    this.id = id;
    this.userId = userId;
    this.proxyId = proxyId;
    this.username = username;
    this.password = password;
    // this.accountStatistics = accountStatistics;
    this.isActivated = isActivated;
    this.expirationDate = expirationDate;
    this.isRunning = isRunning;
    this.statusType = statusType;
    this.statusLabel = statusLabel;
    this.statusDetails = statusDetails;
  }

  static serialize(account: Account): object {
    return {
      ...account,
      // accountStatistics: AccountStatistics.serialize(account.accountStatistics),
    };
  }

  static deserialize(object: any): Account {
    return new Account(
      object.id,
      object.userId,
      object.proxyId,
      object.username,
      object.password,
      // AccountStatistics.deserialize(object.accountStatistics),
      object.isActivated,
      new Date(object.expirationDate),
      object.isRunning,
      object.statusType,
      object.statusLabel,
      object.statusDetails,
    );
  }
}
