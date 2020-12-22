import { Roles } from './../rbac/roles';

export interface User {
  id: string;
  name: string;
  deleted: boolean;
  roles: Roles[];
}
