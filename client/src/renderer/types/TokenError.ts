export default class TokenError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'TokenError';
    this.status = status;
  }
}
