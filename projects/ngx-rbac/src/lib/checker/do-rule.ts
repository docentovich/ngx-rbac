import { DoChecker } from './do-checker';
import { AllPossibleCheckers, CheckerFunction } from '../type/checker-function';
import { doAnd, doOr } from '../helper/logic-operator';
import { DoRole } from '../checker/do-role';
import { DoRoleType } from '../type/do-role-type';
import { DoRuleType } from '../type/do-rule-type';
import { NamedDictionary } from '../type/named-dictionary';
import { DefaultOptions, DoRuleOptions } from '../type/do-rule-options';

export class DoRule extends DoChecker implements DoRuleType {

  public options: DoRuleOptions;

  static checkerFactory(
    checkers: AllPossibleCheckers[],
    options: DoRuleOptions
  ): CheckerFunction {
    const elseCheckers: Array<DoRuleType | CheckerFunction | string> = [];
    const roleCheckers: DoRoleType[] = [];
    checkers.forEach((checker) => {
      if (checker instanceof DoRole) {
        roleCheckers.push(checker);
      } else {
        elseCheckers.push(checker);
      }
    });

    const chainCheckers = doAnd([
      ...doOr(roleCheckers, options),
      ...doAnd(elseCheckers, options),
    ], options);

    return chainCheckers[0].check;
  }

  constructor(
    checkers: AllPossibleCheckers[],
    name: string = 'no-name-rule-checker',
    options?: DoRuleOptions
  ) {
    super(
      DoRule.checkerFactory(
        checkers,
        options || DefaultOptions
      ),
      name
    );
    this.options = options || DefaultOptions;
  }
}

export function creatRule(
  args: AllPossibleCheckers[],
  options?: DoRuleOptions
): DoRuleType {
  return new DoRule(args, 'no-name-rule-checker', options);
}

export function creatRuleSet<T extends {
    [key: string]: AllPossibleCheckers[];
  }>(args: T, options?: DoRuleOptions): NamedDictionary<T, DoRule> {
  return Object.entries(args).reduce((acc, [name, checker]) => {
    acc[name] = creatRule(checker, options);
    acc[name].setName(name);
    return acc;
  }, {} as any);
}
