import { DoRolePermissionType } from './do-role-permission-type';

export interface DoRoleType extends DoRolePermissionType {
  addChild(child: DoRolePermissionType): void;
}
