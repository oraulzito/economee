export interface Card {
  id: number | string;
  name: string;
  credit: number;
  // TODO it should be date, but API return a string
  pay_date: string;
  account: Account;
}

export function createCard(params: Partial<Card>) {
  return {

  } as Card;
}
