export interface Card {
  id: number | string;
  name: string;
  pay_date: Date;
  credit: number;
  credit_available: number;
}

export function createCard(params: Partial<Card>) {
  return {} as Card;
}
