import { DoChecker } from './do-checker';
import { AllPossibleCheckers, CheckerFunction } from '../type/checker-function';
import { doAnd, doOr } from '../helper/logic-operator';
import { DoRole } from '../checker/do-role';
import { DoCheckerType } from '../type/do-checker-type';
import { DoRoleType } from '../type/do-role-type';
import { DoRuleType } from '../type/do-rule-type';
import { NamedDictionary } from '../type/named-dictionary';

export class DoRule extends DoChecker implements DoRuleType {
  static checkerFactory(
    checkers: Array<CheckerFunction | DoCheckerType>
  ): CheckerFunction {
    const elseCheckers: Array<DoRuleType | CheckerFunction> = [];
    const roleCheckers: DoRoleType[] = [];
    checkers.forEach((checker) => {
      if (checker instanceof DoRole) {
        roleCheckers.push(checker);
      } else {
        elseCheckers.push(checker);
      }
    });

    const chainCheckers = doAnd([
      ...doOr(roleCheckers),
      ...doAnd(elseCheckers),
    ]);

    return chainCheckers[0].check;
  }

  constructor(
    checkers: Array<CheckerFunction | DoCheckerType>,
    name: string = 'no-name-rule-checker'
  ) {
    super(DoRule.checkerFactory(checkers), name);
  }
}

export function creatRule(
  args: AllPossibleCheckers[]
): DoRuleType {
  return new DoRule(args);
}

export function creatRuleSet<T extends {
  [key: string]: AllPossibleCheckers[];
}>(args: T): NamedDictionary<T, DoRule> {
  return Object.entries(args).reduce((acc, [name, checker]) => {
    acc[name] = new DoRule(checker, name);
    return acc;
  }, {} as any);
}
