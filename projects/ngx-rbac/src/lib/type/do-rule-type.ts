import { DoCheckerType } from './do-checker-type';
import { DoRuleOptions } from './do-rule-options';

export interface DoRuleType extends DoCheckerType {
  options?: DoRuleOptions;
}
