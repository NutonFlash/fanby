export default class Message {
  id: string;

  accountId: string;

  content: string;

  constructor(id: string, accountId: string, content: string) {
    this.id = id;
    this.accountId = accountId;
    this.content = content;
  }
}
