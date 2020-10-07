import {
  creatChecker,
  creatStringChecker,
  DoChecker,
} from '../checker/do-checker';
import { DoCheckerType } from '../type/do-checker-type';
import { Dependency } from '../type/dependency';
import {
  AllPossibleCheckers,
  DoCheckerFunction,
} from '../type/do-checker-function';
import {
  DefaultOptions,
  DoRuleOptions,
  DoSuppressErrors,
} from '../type/do-rule-options';

export function doAnd(
  checkers: AllPossibleCheckers[],
  options: DoRuleOptions = DefaultOptions,
  name = 'logical and'
): DoCheckerType {
  checkers = checkers.filter(chk => !!chk);
  if (!checkers || checkers?.length === 0) {
    return null;
  }
  return creatChecker(name, (args: any[], dependency: Dependency) => {
      return anyCheckerToDoChecker(checkers).every(
        safeRunCheck(args, dependency, options, true)
      );
    });
}

export function doOr(
  checkers: AllPossibleCheckers[],
  options: DoRuleOptions = DefaultOptions,
  name = 'logical or'
): DoCheckerType {
  checkers = checkers.filter(chk => !!chk);
  if (!checkers || checkers?.length === 0) {
    return null;
  }
  return creatChecker(name, (args: any[], dependency: Dependency) => {
      return anyCheckerToDoChecker(checkers).some(
        safeRunCheck(args, dependency, options, false)
      );
    });
}

export function doNot(
  checker: AllPossibleCheckers,
  options: DoRuleOptions = DefaultOptions,
  name = 'logical not'
): DoCheckerType {
  if (!checker) {
    return null;
  }
  return creatChecker(name, (args: any[], dependency: Dependency) => {
    return !safeRunCheck(
      args,
      dependency,
      options,
      false
    )(anyCheckerToDoChecker(Array.isArray(checker) ? checker : [checker])[0]);
  });
}

function anyCheckerToDoChecker(checkers: AllPossibleCheckers[]): DoChecker[] {
  return checkers
    .filter((chk) => !!chk)
    .map((checker) =>
      checker instanceof DoChecker
        ? checker
        : typeof checker === 'string'
        ? creatStringChecker(checker)
        : creatChecker(name, checker as DoCheckerFunction)
    );
}

function safeRunCheck(
  args: any[],
  dependency: Dependency,
  options: DoRuleOptions,
  returnDefault: boolean
) {
  return (checker: DoChecker) => {
    try {
      return checker.check(args, dependency);
    } catch (e) {
      if (options.suppressErrors === DoSuppressErrors.allErrors) {
        throw e;
      } else if (options.suppressErrors === DoSuppressErrors.warnings) {
        console.error(e.message);
      }

      return returnDefault;
    }
  };
}
