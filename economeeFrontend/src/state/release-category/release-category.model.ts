export interface ReleaseCategory {
  id: number | string;
  name: string;
}

export function createReleaseCategory(params: Partial<ReleaseCategory>) {
  return {} as ReleaseCategory;
}
