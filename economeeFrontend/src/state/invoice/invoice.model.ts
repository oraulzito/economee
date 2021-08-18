import {Card} from "../card/card.model";

export interface Invoice {
  id: number | string;
  date_reference: Date;
  is_paid: boolean;
  card: Card;
}

export function createInvoice(params: Partial<Invoice>) {
  return {

  } as Invoice;
}
