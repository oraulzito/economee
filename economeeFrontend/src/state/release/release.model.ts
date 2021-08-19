import {ReleaseCategory} from '../release-category/release-category.model';
import {ID} from "@datorama/akita";

export interface Release {
  id: number | string;
  description: string;
  value: number;
  date_release: Date;
  date_repeat: Date;
  installment_number: number;
  repeat_times: number;
  is_release_paid: boolean;
  category: ReleaseCategory;
  balance_id: ID;
  invoice_id: ID;
}

export function createRelease(params: Partial<Release>) {
  return {} as Release;
}
