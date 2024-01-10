import AccountProxy from './AccountProxy';

export default class Account {
  id: string;

  username: string;

  password: string;

  proxy: AccountProxy | null;

  messageNumber: number;

  retweetNumber: number;

  groups: string[];

  messages: string[];

  constructor(
    id: string,
    username = '',
    password = '',
    proxy = null,
    messageNumber = 0,
    retweetNumber = 0,
    groups = [],
    messages = [],
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.proxy = proxy;
    this.messageNumber = messageNumber;
    this.retweetNumber = retweetNumber;
    this.groups = groups;
    this.messages = messages;
  }
}
