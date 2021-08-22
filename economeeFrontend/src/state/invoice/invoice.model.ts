import {ID} from '@datorama/akita';

export interface Invoice {
  id: ID;
  // TODO it should be date, but API return a string
  date_reference: string;
  is_paid: boolean;
  card_id: ID;
}

export function createInvoice(params: Partial<Invoice>) {
  return {} as Invoice;
}
