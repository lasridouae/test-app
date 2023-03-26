import { Role } from './role';

export class User {
  id: number;
  email: string;
  password: string;
  name:string;
  role: Role;
  token?: string;
  status?: number;
  avatare?: string;
}
