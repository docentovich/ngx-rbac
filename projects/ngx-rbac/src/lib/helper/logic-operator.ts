import { Dependency } from '../type/dependency';
import {
  AllPossibleCheckers,
  DoCheckerFunction,
} from '../type/do-checker-function';
import {
  DefaultRuleOptions,
  DoAbsentRuleBehavior,
  DoRuleOptions,
} from '../type/do-rule-options';
import { DoRuleType } from '../type/do-rule-type';
import { creatStringRule, DoRule } from '../model/do-rule';

export function doAnd(
  checkers: AllPossibleCheckers[],
  options: DoRuleOptions = DefaultRuleOptions,
  name = 'logical and'
): DoRuleType {
  checkers = checkers.filter((chk) => !!chk);
  if (!checkers || checkers?.length === 0) {
    return null;
  }
  return new DoRule((args: any[], dependency: Dependency) => {
    return anyCheckerToDoChecker(checkers).every(
      safeRunCheck(
        args,
        dependency,
        options,
        [DoAbsentRuleBehavior.ignore, DoAbsentRuleBehavior.warnings].includes(
          options.absentRuleBehavior
        )
          ? true
          : false
      )
    );
  }, name);
}

export function doOr(
  checkers: AllPossibleCheckers[],
  options: DoRuleOptions = DefaultRuleOptions,
  name = 'logical or'
): DoRuleType {
  checkers = checkers.filter((chk) => !!chk);
  if (!checkers || checkers?.length === 0) {
    return null;
  }
  return new DoRule((args: any[], dependency: Dependency) => {
    return anyCheckerToDoChecker(checkers).some(
      safeRunCheck(args, dependency, options, false)
    );
  }, name);
}

export function doNot(
  checker: AllPossibleCheckers,
  options: DoRuleOptions = DefaultRuleOptions,
  name = 'logical not'
): DoRuleType {
  if (!checker) {
    return null;
  }
  return new DoRule((args: any[], dependency: Dependency) => {
    return !safeRunCheck(
      args,
      dependency,
      options,
      true
    )(anyCheckerToDoChecker(Array.isArray(checker) ? checker : [checker])[0]);
  }, name);
}

function anyCheckerToDoChecker(checkers: AllPossibleCheckers[]): DoRule[] {
  return checkers
    .filter((chk) => !!chk)
    .map((checker) =>
      checker instanceof DoRule
        ? checker
        : typeof checker === 'string'
        ? creatStringRule(checker)
        : new DoRule(checker as DoCheckerFunction, name)
    );
}

function safeRunCheck(
  args: any[],
  dependency: Dependency,
  options: DoRuleOptions,
  returnDefault: boolean
) {
  return (checker: DoRule) => {
    try {
      return checker.check(args, dependency);
    } catch (e) {
      if (options.absentRuleBehavior === DoAbsentRuleBehavior.allErrors) {
        throw e;
      } else if (options.absentRuleBehavior === DoAbsentRuleBehavior.warnings) {
        console.error(e.message);
      }

      return returnDefault;
    }
  };
}
