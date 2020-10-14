import { DoRolePermission } from './do-role-permission';
import { DoRolePermissionType } from '../type/do-role-permission-type';
import { DoStringDictionary } from '../type/do-dictionary';
import { DoRuleType } from '../type/do-rule-type';
import { DoPermissionType } from '../type/do-permission-type';
import { DoDebugType } from '../type/do-debug-type';

export class DoPermission extends DoRolePermission {}

export function doCreatePermission(name: string): DoRolePermissionType {
  return new DoPermission(name);
}

export function doCreatePermissions(names: string[]): DoRolePermissionType[] {
  return names.map((name) => new DoPermission(name));
}
