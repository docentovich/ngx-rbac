import { DoCheckerType } from './do-checker-type';

export interface DoRoleType extends DoCheckerType {
  canRoles: string[];
  inheritedRole?: DoRoleType;
}
