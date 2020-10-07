import { Dependency } from '../type/dependency';
import { DoStringDictionary } from '../type/do-named-dictionary';
import { DoRuleType } from '../type/do-rule-type';

export function commonCan(
  dependency: Dependency,
  rulesComputed: DoStringDictionary<DoRuleType>,
  ruleName: string,
  args?: any[]
): boolean {
  const rule: DoRuleType = Object.values(rulesComputed).find(
    (r) => r.name === ruleName
  );
  if (!rule) {
    throw Error('No rule for ' + ruleName);
  }

  return rule.check(args, dependency);
}
