import { DoRoleType } from '@doce/ngx-rbac';

export interface User {
  id: string;
  name: string;
  deleted: boolean;
  roles: DoRoleType[];
}
