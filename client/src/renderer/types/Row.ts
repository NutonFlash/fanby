import Account from '../models/Account';
import Group from '../models/Group';
import Proxy from '../models/Proxy';
import Invoice from '../models/Invoice';

export interface Row {
  id: string;
  index: number;
}

export interface AccountRow extends Account, Row {}
export interface GroupRow extends Group, Row {}
export interface ProxyRow extends Proxy, Row {}
export interface InvoiceRow extends Invoice, Row {}

export type RowsType = (AccountRow | GroupRow | ProxyRow | InvoiceRow)[];
