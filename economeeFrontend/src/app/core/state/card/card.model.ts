import {Account} from "../account/account.model";

export interface Card {
  id: number | string;
  name: string;
  credit: number;
  // TODO it should be date, but API return a string
  pay_date: string;
  account_id: Account['id'];
}

export function createCard(params: Partial<Card>) {
  return {} as Card;
}
