import {ID} from '@datorama/akita';
import {Card} from "../card/card.model";

export interface Invoice {
  id: ID;
  date_reference: string;
  is_paid: boolean;
  card_id: Card['id'];
  total_card_expenses: number;
}

export function createInvoice(params: Partial<Invoice>) {
  return {} as Invoice;
}
