import Account from './Account';
import Group from './Group';
import { AccountRow, GroupRow, ProxyRow } from '../types/Row';
import Proxy from './Proxy';

export default class Converter {
  static fromAccountRow(accountRow: AccountRow): Account {
    return new Account(
      accountRow.id,
      accountRow.username,
      accountRow.password,
      accountRow.groups,
      accountRow.proxy,
      accountRow.messages,
      accountRow.messageNumber,
      accountRow.retweetNumber,
    );
  }

  static fromGroupRow(groupRow: GroupRow): Group {
    return new Group(
      groupRow.id,
      groupRow.groupId,
      groupRow.requiredRetweets,
      groupRow.comment,
      groupRow.usedBy,
    );
  }

  static fromProxyRow(proxyRow: ProxyRow): Proxy {
    return new Proxy(
      proxyRow.id,
      proxyRow.host,
      proxyRow.port,
      proxyRow.username,
      proxyRow.password,
    );
  }
}
