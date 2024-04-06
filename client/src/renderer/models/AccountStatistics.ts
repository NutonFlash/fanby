export default class AccountStatistics {
  id: string;

  accountId: string;

  retweetsToday: number;

  retweetsTotal: number;

  messagesToday: number;

  messagesTotal: number;

  groupsTotal: number;

  constructor(
    id: string,
    accountId: string,
    retweetsToday: number,
    retweetsTotal: number,
    messagesToday: number,
    messagesTotal: number,
    groupsTotal: number,
  ) {
    this.id = id;
    this.accountId = accountId;
    this.retweetsToday = retweetsToday;
    this.retweetsTotal = retweetsTotal;
    this.messagesToday = messagesToday;
    this.messagesTotal = messagesTotal;
    this.groupsTotal = groupsTotal;
  }

  static serialize(accountStatistics: AccountStatistics): object {
    return {
      ...accountStatistics,
    };
  }

  static deserialize(object: any): AccountStatistics {
    return new AccountStatistics(
      object.id,
      object.accountId,
      object.retweetsToday,
      object.retweetsTotal,
      object.messagesToday,
      object.messagesTotal,
      object.groupsTotal,
    );
  }
}
