type PaymentStatus =
  | 'Created'
  | 'Pending'
  | 'Expired'
  | 'Completed'
  | 'Error'
  | 'Unknown';

export default class Invoice {
  id: string;

  userId: string;

  amount: number;

  link: string;

  received: number;

  currency: string;

  status: PaymentStatus;

  createdAt: Date;

  constructor(
    id: string,
    userId: string,
    amount: number,
    link: string,
    received: number,
    currency: string,
    status: PaymentStatus,
    createdAt: string,
  ) {
    this.id = id;
    this.userId = userId;
    this.amount = amount;
    this.link = link;
    this.received = received;
    this.currency = currency;
    this.status = status;
    this.createdAt = new Date(createdAt);
  }

  static serialize(invoice: Invoice): object {
    return {
      ...invoice,
    };
  }

  static deserialize(object: any): Invoice {
    return new Invoice(
      object.id,
      object.userId,
      object.amount,
      object.link,
      object.received,
      object.currency,
      object.status,
      object.createdAt,
    );
  }
}
