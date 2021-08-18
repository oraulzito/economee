export interface Balance {
  id: number | string;
  date_reference: Date;
  account: Account;
}

export function createBalance(params: Partial<Balance>) {
  return {

  } as Balance;
}
