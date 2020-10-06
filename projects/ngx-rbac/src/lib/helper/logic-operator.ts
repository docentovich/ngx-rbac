import { creatChecker, DoChecker } from '../checker/do-checker';
import { DoCheckerType } from '../type/do-checker-type';
import { Dependency } from '../type/dependency';
import { checkerFunction } from '../type/checker-function';

export function doAnd(
  checkers: Array<DoCheckerType | checkerFunction>,
  name = 'logical and'
): DoCheckerType[] {
  if (!checkers || checkers?.length === 0) {
    return [];
  }
  return [
    creatChecker(name, (args: any[], dependency: Dependency) => {
      return anyCheckerToDoChecker(checkers).every((checker) =>
        checker.check(args, dependency)
      );
    }),
  ];
}

export function doOr(
  checkers: Array<DoCheckerType | checkerFunction>,
  name = 'logical or'
): DoCheckerType[] {
  if (!checkers || checkers?.length === 0) {
    return [];
  }
  return [
    creatChecker(name, (args: any[], dependency: Dependency) => {
      return anyCheckerToDoChecker(checkers).some((checker) =>
        checker.check(args, dependency)
      );
    }),
  ];
}

export function doNot(
  checker: DoCheckerType | checkerFunction,
  name = 'logical not'
): DoCheckerType[] {
  if (!checker) {
    return [];
  }
  return [
    creatChecker(name, (args: any[], dependency: Dependency) => {
      return !anyCheckerToDoChecker([checker])[0].check(args, dependency);
    }),
  ];
}

function anyCheckerToDoChecker(
  checkers: Array<DoCheckerType | checkerFunction>
): DoChecker[] {
  return checkers
    .filter((chk) => !!chk)
    .map((checker) =>
      checker instanceof DoChecker
        ? checker
        : new DoChecker(checker as checkerFunction, name)
    );
}
