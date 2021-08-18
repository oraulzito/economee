export interface Card {
  id: number | string;
  name: string;
  credit: number;
  pay_date: Date;
  account: Account;
}

export function createCard(params: Partial<Card>) {
  return {

  } as Card;
}
