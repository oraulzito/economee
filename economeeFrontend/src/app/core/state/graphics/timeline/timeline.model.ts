export interface Timeline {
  date_reference: string;
  total_expenes: number;
  total_incomes: number;
}

export function createTimeline(params: Partial<Timeline>) {
  return {} as Timeline;
}
