import {ID} from "@datorama/akita";

export interface CategoryChart {
  id: ID,
  name: string,
  total: number
}

export function createCategory(params: Partial<CategoryChart>) {
  return {} as CategoryChart;
}
