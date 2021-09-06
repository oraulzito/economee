import {ID} from '@datorama/akita';

export interface MonthByMonth {
  id: ID;
  incomes: [GraphicData];
  expenses: [GraphicData];
}

export interface GraphicData {
  id: number | string;
  date_reference: string;
  total: number;
}
