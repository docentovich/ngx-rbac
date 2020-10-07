import { DoChecker } from './do-checker';
import { AllPossibleCheckers, DoCheckerFunction } from '../type/do-checker-function';
import { doAnd, doOr } from '../helper/logic-operator';
import { DoRole } from '../checker/do-role';
import { DoRoleType } from '../type/do-role-type';
import { DoRuleType } from '../type/do-rule-type';
import { DoNamedDictionary } from '../type/do-named-dictionary';
import { DefaultOptions, DoRuleOptions } from '../type/do-rule-options';

export class DoRule extends DoChecker implements DoRuleType {

  public options: DoRuleOptions;

  static checkerFactory(
    checkers: AllPossibleCheckers[],
    options: DoRuleOptions
  ): DoCheckerFunction {
    const elseCheckers: Array<DoRuleType | DoCheckerFunction | string> = [];
    const roleCheckers: DoRoleType[] = [];
    checkers.forEach((checker) => {
      if (checker instanceof DoRole) {
        roleCheckers.push(checker);
      } else {
        elseCheckers.push(checker);
      }
    });

    const chainCheckers = doAnd([
      doOr(roleCheckers, options),
      doAnd(elseCheckers, options),
    ], options);

    return chainCheckers.check;
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

export function doCreatRule(
  args: AllPossibleCheckers[],
  options?: DoRuleOptions
): DoRuleType {
  return new DoRule(args, 'no-name-rule-checker', options);
}

export function doCreatRuleSet<T extends {
    [key: string]: AllPossibleCheckers[];
  }>(args: T, options?: DoRuleOptions): DoNamedDictionary<T, DoRule> {
  return Object.entries(args).reduce((acc, [name, checker]) => {
    acc[name] = doCreatRule(checker, options);
    acc[name].setName(name);
    return acc;
  }, {} as any);
}
