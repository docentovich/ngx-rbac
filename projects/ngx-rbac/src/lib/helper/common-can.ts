import { Dependency } from '../type/dependency';
import { DoStringDictionary } from '../type/do-dictionary';
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

  return !!rule ? rule.check(args, dependency) : false;
}
