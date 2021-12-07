import {ID} from '@datorama/akita';
import {Currency} from '../currency/currency.model';

export interface Account {
  id: ID;
  name: string;
  currency: Currency;
  is_main_account: boolean;
  balances: ID[];
  cards: ID[];
  total_available: number;
}
