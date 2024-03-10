import {ID} from "@datorama/akita";

export interface MonthlyChart {
  incomes: [chartsData],
  expenses: [chartsData],
}

interface chartsData {
  id: ID,
  reference_date: string,
  total: number
}

export function createMonthlyChart(params: Partial<MonthlyChart>) {
  return {} as MonthlyChart;
}
