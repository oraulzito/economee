import {ID} from '@datorama/akita';

export interface Account {
  id: ID;
  name: string;
  currency: string;
  is_main_account: boolean;
}

export function createAccount(params: Partial<Account>) {
  return {} as Account;
}