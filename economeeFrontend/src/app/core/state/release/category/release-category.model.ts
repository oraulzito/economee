export interface ReleaseCategory {
  id: number | string;
  name: string;
  color: string;
  owner_id: number;
}

export function createReleaseCategory(params: Partial<ReleaseCategory>) {
  return {} as ReleaseCategory;
}
