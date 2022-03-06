import {Card} from "../card/card.model";
import {Release} from "../release/release.model";

export interface Invoice {
  id: number | string;
  date_reference: Date;
  total_value: Date;
  is_paid: boolean;
  card_id: Card['id'];
}

export function createInvoice(params: Partial<Invoice>) {
  return {} as Invoice;
}
