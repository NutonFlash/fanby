export default class AccountProxy {
  id: string;

  host: string;

  port: number;

  username: string;

  password: string;

  constructor(
    id: string,
    host: string,
    port: number,
    username = '',
    password = '',
  ) {
    this.id = id;
    this.host = host;
    this.port = port;
    this.username = username;
    this.password = password;
  }

  toString(): string {
    let proxyStr = `${this.host}:${this.port}`;
    if (this.username && this.password) {
      proxyStr += `@${this.username}:${this.password}`;
    }
    return proxyStr;
  }
}
