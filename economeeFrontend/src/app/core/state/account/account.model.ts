import {ID} from '@datorama/akita';
import {Currency} from '../currency/currency.model';

export interface Account {
  id: ID;
  owner_id: ID;
  name: string;
  currency: Currency;
  is_main_account: boolean;
  total_available: number;
}

export function createAccount(params: Partial<Account>) {
  return {} as Account;
}


