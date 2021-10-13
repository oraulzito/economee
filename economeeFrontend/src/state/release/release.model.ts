import {ReleaseCategory} from '../release-category/release-category.model';
import {ID} from '@datorama/akita';
import {Balance} from "../balance/balance.model";
import {Invoice} from "../invoice/invoice.model";

export interface Release {
  id: number | string;
  description: string;
  place: string;
  value: number;
  value_installment: number;
  // TODO it should be date, but API return a string
  date_release: string;
  // TODO it should be date, but API return a string
  date_repeat: string;
  date_creation: string;
  type: string;
  installment_number: number;
  repeat_times: number;
  is_release_paid: boolean;
  category: ReleaseCategory;
  balance_id: Balance['id'];
  invoice_id: Invoice['id'];
}

export function createRelease(params: Partial<Release>) {
  return {} as Release;
}
