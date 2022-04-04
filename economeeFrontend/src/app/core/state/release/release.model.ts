import {ReleaseCategory} from "./category/release-category.model";
import {Balance} from "../balance/balance.model";
import {Invoice} from "../invoice/invoice.model";

export interface Release {
  id: number | string;
  release_id: number | string;
  description: string;
  place: string;
  value: number;
  date_creation: string;
  type: RELEASE_TYPE;
  category_id: number | string;
  date_release: string;
  is_paid: Boolean;
  installment_times: number;
  installment_number: number;
  installment_value: number;
  balance_id: Balance['id'];
  invoice_id: Invoice['id'];
}

export enum RELEASE_TYPE {
  EXPENSE = 0,
  INCOME = 1
}

export enum RELEASE_TYPE {
  CARD = 1,
  ACCOUNT = 2
}

export function createRelease(params: Partial<Release>) {
  return {} as Release;
}
