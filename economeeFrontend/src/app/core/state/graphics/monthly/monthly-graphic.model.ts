import {ID} from "@datorama/akita";

export interface MonthlyGraphic {
  incomes: [graphicsData],
  expenses: [graphicsData],
}

interface graphicsData {
  id: ID,
  date_reference: Date,
  total: number
}

export function createMonthlyGraphic(params: Partial<MonthlyGraphic>) {
  return {} as MonthlyGraphic;
}
