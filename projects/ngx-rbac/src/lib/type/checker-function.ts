import { Dependency } from './dependency';
import { DoRuleType } from './do-rule-type';
import { DoRoleType } from './do-role-type';

export type CheckerFunction = (args: any[], dependency: Dependency) => boolean;
export type AllPossibleCheckers = DoRuleType | DoRoleType | CheckerFunction | string;
