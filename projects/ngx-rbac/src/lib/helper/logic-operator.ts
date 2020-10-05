import { creatChecker, DoChecker } from '../checker/do-checker';
import { DoCheckerType } from '../type/do-checker-type';
import { Dependency } from '../type/dependency';
import { checkerFunction } from '../type/checker-function';

export function and(
  checkers: DoCheckerType[],
  name = 'logical and'
): DoCheckerType {
  return andOrCommonLogic(
    checkers,
    (args: any[], f: DoCheckerType, dependency: Dependency, prevVal: boolean = true) => {
      return prevVal && f.check(args, dependency);
    },
    name
  );
}

export function or(
  checkers: DoCheckerType[],
  name = 'logical or'
): DoCheckerType {
  return andOrCommonLogic(
    checkers,
    (args: any[], f: DoCheckerType, dependency: Dependency, prevVal: boolean) => {
      return prevVal || f.check(args, dependency);
    },
    name
  );
}

export function not(
  checker: DoCheckerType,
  name = 'logical not'
): DoCheckerType {
  return andOrCommonLogic(
    [checker],
    (args: any[], f: DoCheckerType, dependency: Dependency, prevVal: boolean = null) => {
      return !f.check(args, dependency);
    },
    name
  );
}

export function andOrCommonLogic(
  checkersRaw: DoCheckerType[],
  fn: (args: any[], f: DoCheckerType, dependency: any[], prevVal?: boolean) => boolean,
  name: string
): DoCheckerType {
  checkersRaw = checkersRaw.filter((chk) => !!chk);

  const { first, checkers } =
    checkersRaw.length !== 0
      ? {
          first: checkersRaw.shift(),
          checkers: checkersRaw,
        }
      : { first: null, checkers: [] };

  return (
    first &&
    creatChecker(name, (args: any[], dependency: Dependency) => {
      return checkers.reduce(
        (acc: boolean, nextChecker: DoCheckerType) =>
          fn(args, nextChecker, dependency, acc),
        fn(args, first, dependency)
      ) as any;
    })
  );
}

export function doNot(checker: DoCheckerType | checkerFunction, name = 'not') {
  return not(
    checker instanceof DoChecker
      ? checker
      : new DoChecker(checker as checkerFunction, name)
  );
}

export function doAnd(
  checkers: Array<DoCheckerType | checkerFunction>,
  name = 'and'
) {
  return and(
    checkers.map((checker) =>
      checker instanceof DoChecker
        ? checker
        : new DoChecker(checker as checkerFunction, name)
    )
  );
}

export function doOr(
  checkers: Array<DoCheckerType | checkerFunction>,
  name = 'or'
) {
  return or(
    checkers.map((checker) =>
      checker instanceof DoChecker
        ? checker
        : new DoChecker(checker as checkerFunction, name)
    )
  );
}
