export interface Balance {
  id: number | string;
  // TODO it should be date, but API return a string
  date_reference: string;
  account_id: Account['id'];
  total_releases_expenses: number;
  total_releases_incomes: number;
}

export function createBalance(params: Partial<Balance>) {
  return {} as Balance;
}
