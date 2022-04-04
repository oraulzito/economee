export interface Card {
  id: number;
  name: string;
  pay_date: string;
  credit: number;
  credit_available: number;
}

export function createCard(params: Partial<Card>) {
  return {} as Card;
}
