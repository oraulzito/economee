export interface CategoryRelease {
  id: number | string;
  name: string;
  total: number;
}

export function createCategoryRelease(params: Partial<CategoryRelease>) {
  return {} as CategoryRelease;
}
