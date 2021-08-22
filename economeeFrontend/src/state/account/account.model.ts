import {ID} from '@datorama/akita';

export interface Account {
  id: ID;
  name: string;
  currency: string;
  is_main_account: boolean;
  balances: ID[];
  cards: ID[];
  total_available: number;
  total_incomes: number;
  total_expenses: number;
}
