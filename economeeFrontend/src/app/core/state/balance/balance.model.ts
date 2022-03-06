import {Release} from "../release/release.model";
import {Account} from "../account/account.model";

export interface Balance {
  id: number | string;
  date_reference: string;
  account_id: Account['id'];

  total_incomes: number;
  total_paid_incomes: number;
  total_expenses: number;
  total_paid_expenses: number;
  total_available: number;
  total_invoices: number;
  total_paid_invoices: number;
  will_remain_with_paid: number;
  will_remain_without_paid: number;
  will_remain_with_paid_card: number;
}

export function createBalance(params: Partial<Balance>) {
  return {} as Balance;
}
