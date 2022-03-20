import {ID} from "@datorama/akita";

export interface MonthlyChart {
  incomes: [chartsData],
  expenses: [chartsData],
}

interface chartsData {
  id: ID,
  date_reference: Date,
  total: number
}

export function createMonthlyChart(params: Partial<MonthlyChart>) {
  return {} as MonthlyChart;
}
