export interface TimelineChart {
  date_reference: string;
  total_expenses: number;
  total_incomes: number;
}

export function createTimeline(params: Partial<TimelineChart>) {
  return {} as TimelineChart;
}
