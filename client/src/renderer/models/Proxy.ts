export default class Proxy {
  id: string;

  userId: string;

  host: string;

  port: number;

  username: string;

  password: string;

  constructor(
    id: string,
    userId: string,
    host: string,
    port: number,
    username = '',
    password = '',
  ) {
    this.id = id;
    this.userId = userId;
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

  static serialize(proxy: Proxy): object {
    return {
      id: proxy.id,
      userId: proxy.userId,
      host: proxy.host,
      port: proxy.port,
      username: proxy.username,
      password: proxy.password,
    };
  }

  static deserialize(obj: any): Proxy {
    return new Proxy(
      obj.id,
      obj.userId,
      obj.host,
      obj.port,
      obj.username,
      obj.password,
    );
  }
}
