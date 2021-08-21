export interface User {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  dob: Date;
  // photo: string;
}

export function createUser(params: Partial<User>) {
  return {} as User;
}
