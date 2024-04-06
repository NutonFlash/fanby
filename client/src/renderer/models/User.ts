export default class User {
  id: string;

  email: string;

  referalCode: string;

  activationsLeft: number;

  constructor(
    id: string,
    email: string,
    referalCode: string,
    activationsLeft: number,
  ) {
    this.id = id;
    this.email = email;
    this.referalCode = referalCode;
    this.activationsLeft = activationsLeft;
  }
}
