import { DoCheckerType } from './do-checker-type';
import { DoRuleType } from './do-rule-type';
import { DoRoleType } from './do-role-type';
import { DoPermissionType } from './do-permission-type';

export type DoNamedDictionary<C, T> = {
  [key in keyof C]: T;
};

export interface DoStringDictionary<T> {
  [key: string]: T;
}

