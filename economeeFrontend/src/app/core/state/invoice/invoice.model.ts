import {Card} from "../card/card.model";
import {Release} from "../release/release.model";

export interface Invoice {
  id: number | string;
  reference_date: string;
  total_value: string;
  is_paid: boolean;
  card_id: Card['id'];
}

export function createInvoice(params: Partial<Invoice>) {
  return {} as Invoice;
}
