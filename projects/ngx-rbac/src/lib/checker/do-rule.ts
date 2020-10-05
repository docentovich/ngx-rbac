import { DoChecker } from './do-checker';
import { checkerFunction } from '../type/checker-function';
import { doAnd, doOr } from '../helper/logic-operator';
import { DoRole } from '../checker/do-role';
import { DoCheckerType } from '../type/do-checker-type';
import { DoRoleType } from '../type/do-role-type';
import { DoRuleType } from '../type/do-rule-type';
import { Dependency } from '../type/dependency';

export class DoRule extends DoChecker implements DoRuleType {
  static checkerFactory(
    checkers: Array<checkerFunction | DoCheckerType>
  ): checkerFunction {
    const elseCheckers: Array<DoRuleType | checkerFunction> = [];
    const roleCheckers: DoRoleType[] = [];
    checkers.forEach((checker) => {
      if (checker instanceof DoRole) {
        roleCheckers.push(checker);
      } else {
        elseCheckers.push(checker);
      }
    });

    const chainCheckers = doAnd([doOr(roleCheckers), doAnd(elseCheckers)]);

    return (args: any[], dependency: Dependency) =>
      chainCheckers.check(args, dependency);
  }

  constructor(
    checkers: Array<checkerFunction | DoCheckerType>,
    name: string = 'no-name-rule-checker'
  ) {
    super(DoRule.checkerFactory(checkers), name);
  }
}

export function creatRule(
  args: Array<DoRuleType | DoRoleType | checkerFunction>
): DoRuleType {
  return new DoRule(args);
}
