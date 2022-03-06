import {ID} from "@datorama/akita";

export interface CategoryGraphic {
  id: ID,
  name: string,
  total: number
}

export function createCategory(params: Partial<CategoryGraphic>) {
  return {} as CategoryGraphic;
}
