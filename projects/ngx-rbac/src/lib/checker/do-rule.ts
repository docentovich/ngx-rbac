import { creatChecker, DoChecker } from './do-checker';
import { checkerFunction } from '../type/checker-function';
import { and, or } from '../helper/logic-operator';
import { DoRole } from '../checker/do-role';
import { DoCheckerType } from '../type/do-checker-type';
import { DoRoleType } from '../type/do-role-type';
import { DoRuleType } from '../type/do-rule-type';
import { Dependency } from '../type/dependency';

export class DoRule extends DoChecker {
  static doCheckerFactory(
    checkers: Array<checkerFunction | DoCheckerType>
  ): checkerFunction {
    if (!Array.isArray(checkers)) {
      throw Error('checkers must be of array type');
    }

    checkers.forEach((checker, index) => {
      if ((checker as DoRoleType) instanceof DoChecker) {
        return;
      }
      return (checkers[index] = creatChecker(
        'simple-checker',
        checker as checkerFunction
      ));
    });

    const roleCheckers: DoRoleType[] = checkers.filter(
      (checker) => (checker as DoRuleType) instanceof DoRole
    ) as DoRoleType[];

    const simpleCheckerCheckers: DoRoleType[] = checkers.filter(
      (checker) =>
        (checker as DoRoleType) instanceof DoChecker &&
        !(
          (checker as DoRuleType) instanceof DoRule ||
          (checker as DoRuleType) instanceof DoRole
        )
    ) as DoRoleType[];

    const ruleCheckers: DoRuleType[] = checkers.filter(
      (checker) => (checker as DoRuleType) instanceof DoRule
    ) as DoRuleType[];

    const chainCheckers = and([
      or(roleCheckers),
      and([...ruleCheckers, ...simpleCheckerCheckers]),
    ]);

    return (args: any[], dependency: Dependency) =>
      chainCheckers.check(args, dependency);
  }

  constructor(checkers: Array<checkerFunction | DoCheckerType>, name: string) {
    super(DoRule.doCheckerFactory(checkers), name);
  }
}

export function creatRule(
  name: string,
  args: Array<DoRuleType | DoRoleType | checkerFunction>
): DoRuleType {
  return new DoRule(args, name);
}
