import { DoRoleType } from './do-role-type';
import { DoStringDictionary } from './do-dictionary';
import { DoRuleType } from './do-rule-type';

export type Dependency = [DoRoleType[], DoStringDictionary<DoRuleType>];
