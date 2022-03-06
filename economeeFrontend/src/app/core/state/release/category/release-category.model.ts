export interface ReleaseCategory {
  id: number | string;
  name: string;
  color: string;
}

export function createReleaseCategory(params: Partial<ReleaseCategory>) {
  return {} as ReleaseCategory;
}
