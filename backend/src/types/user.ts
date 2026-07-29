export interface UserRow {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPublic {
  id: number;
  email: string;
  name: string;
  role: string;
}
