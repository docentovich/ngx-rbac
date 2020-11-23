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
import { DoRole } from '../model/do-role';

export function doAnd(
  checkers: AllPossibleCheckers[],
  options: DoRuleOptions = DefaultRuleOptions,
  name = 'Logical and'
): DoRuleType {
  checkers = checkers.filter((chk) => !!chk);
  if (!checkers || checkers?.length === 0) {
    return null;
  }
  name += getCheckerName(checkers);
  // todo check if possible memory leak
  // todo add check on dev mode
  const parentRule = new DoRule((args: any[], dependency: Dependency) => {
    return anyCheckerToDoChecker(checkers, parentRule)
      .map(safeRunCheck(args, dependency, options))
      .every((val) =>
        val === null
          ? [
              DoAbsentRuleBehavior.ignore,
              DoAbsentRuleBehavior.warnings,
            ].includes(options.absentRuleBehavior)
          : val
      ); // todo check ignore and warnings behavior
  }, name);

  return parentRule;
}

export function doOr(
  checkers: AllPossibleCheckers[],
  options: DoRuleOptions = DefaultRuleOptions,
  name = 'Logical or'
): DoRuleType {
  checkers = checkers.filter((chk) => !!chk);
  if (!checkers || checkers?.length === 0) {
    return null;
  }
  name += getCheckerName(checkers);
  // todo check if possible memory leak
  // todo add check on dev mode
  const parentRule = new DoRule((args: any[], dependency: Dependency) => {
    return anyCheckerToDoChecker(checkers, parentRule)
      .map(safeRunCheck(args, dependency, options))
      .filter((val) => val !== null)
      .some((val) => val); // todo check ignore and warnings behavior
  }, name);

  return parentRule;
}

export function doNot(
  checker: AllPossibleCheckers,
  options: DoRuleOptions = DefaultRuleOptions,
  name = 'Logical not'
): DoRuleType {
  if (!checker) {
    return null;
  }
  name += getCheckerName([checker]);
  // todo check if possible memory leak
  // todo add check on dev mode
  const parentRule = new DoRule((args: any[], dependency: Dependency) => {
    return !anyCheckerToDoChecker(
      Array.isArray(checker) ? checker : [checker],
      parentRule
    )
      .map(safeRunCheck(args, dependency, options))
      .filter((val) => val !== null)
      .every((val) => val); // todo check ignore and warnings behavior
  }, name);

  return parentRule;
}

function anyCheckerToDoChecker(
  checkers: AllPossibleCheckers[],
  parentRule: DoRule
): DoRule[] {
  return checkers
    .filter((chk) => !!chk)
    .map((checker) => {
      const rule =
        checker instanceof DoRule
          ? checker
          : typeof checker === 'string'
          ? creatStringRule(checker)
          : new DoRule(checker as DoCheckerFunction, `Simple rule: ${(checker as any).id} ${checker}`);
      parentRule.assignChildRules(rule);

      return rule;
    });
}

function safeRunCheck(
  args: any[],
  dependency: Dependency,
  options: DoRuleOptions
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

      return null;
    }
  };
}

function getCheckerName(checkers: AllPossibleCheckers[]) {
  return (
    ' (' +
    checkers
      .map((checker) => {
        if (
          checker instanceof DoRule ||
          checker instanceof DoRole ||
          typeof checker === 'string'
        ) {
          return checker.toString();
        }
        const id = Math.floor(Math.random() * 100);
        (checker as any ).id = id;
        return `{function ${id}}`;
      })
      .join(', ') +
    ')'
  );
}
