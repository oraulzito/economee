export interface Balance {
  id: number | string;
  // TODO it should be date, but API return a string
  date_reference: string;
  account: Account;
}

export function createBalance(params: Partial<Balance>) {
  return {

  } as Balance;
}
