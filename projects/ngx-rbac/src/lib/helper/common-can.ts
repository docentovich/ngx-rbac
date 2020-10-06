import { Dependency } from '../type/dependency';
import { DoRule } from '../checker/do-rule';
import { Dictionary } from '../type/dictionary';
import { DoRuleType } from '../type/do-rule-type';

export function commonCan(
  dependency: Dependency,
  rulesComputed: Dictionary<DoRuleType>,
  ruleName: string,
  args?: any[]
): any {
  const rule: DoRule = Object.values(rulesComputed).find(
    (r) => r.name === ruleName
  );
  if (!rule) {
    throw Error('No rule for ' + ruleName);
  }

  return rule.check(args, dependency);
}
