import { DoRuleOptions } from './do-rule-options';
import { DoCheckerFunction } from './do-checker-function';

export interface DoRuleType {
  check: DoCheckerFunction;
  name: string;
  options: DoRuleOptions;

  setName(name: string): void;
  toString(): string;
}
