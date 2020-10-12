import { DoStringDictionary } from '../type/do-dictionary';
import { DoRolePermission } from './do-role-permission';

export class DoPermission extends DoRolePermission {}

export function createPermissions(
  permissions: string[],
): DoStringDictionary<DoPermission> {
  return permissions.reduce(
    (acc: DoStringDictionary<DoPermission>, permissionName) => ({
      ...acc,
      [permissionName]: new DoPermission(permissionName),
    }),
    {}
  );
}
