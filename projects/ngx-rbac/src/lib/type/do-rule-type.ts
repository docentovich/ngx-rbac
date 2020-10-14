import { DoRuleOptions } from './do-rule-options';
import { DoCheckerFunction } from './do-checker-function';
import { DoStringDictionary } from './do-dictionary';

export interface DoRuleType {
  check: DoCheckerFunction;
  name: string;
  options: DoRuleOptions;
  traceNames: string[];
  childRules: DoStringDictionary<DoRuleType>;

  setName(name: string): void;
  assignChildRules(childRule: DoRuleType): void;
}
