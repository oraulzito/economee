import {ID} from '@datorama/akita';

export interface Invoice {
  id: ID;
  date_reference: string;
  is_paid: boolean;
  card_id: ID;
  total_card_expenses: number;
}

export function createInvoice(params: Partial<Invoice>) {
  return {} as Invoice;
}
