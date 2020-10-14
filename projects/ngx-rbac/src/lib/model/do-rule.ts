import {
  AllPossibleCheckers,
  DoCheckerFunction,
} from '../type/do-checker-function';
import { doAnd, doOr } from '../helper/logic-operator';
import { DoRuleType } from '../type/do-rule-type';
import { DoStringDictionary } from '../type/do-dictionary';
import { DefaultRuleOptions, DoRuleOptions } from '../type/do-rule-options';
import { DoRole } from './do-role';
import { DoDebugType } from '../type/do-debug-type';

export class DoRule implements DoRuleType, DoDebugType {
  public options: DoRuleOptions;
  public check: DoCheckerFunction;
  public name: string;
  public childRules: DoStringDictionary<DoRuleType> = {};

  static checkerFactory(
    checkers: AllPossibleCheckers[],
    options: DoRuleOptions
  ): DoRuleType {
    const elseCheckers: Array<DoRuleType | DoCheckerFunction | string> = [];
    const roleCheckers: string[] = [];
    checkers.forEach((checker) => {
      if (checker instanceof DoRole) {
        roleCheckers.push(checker.name);
      } else {
        elseCheckers.push(checker as DoRuleType | DoCheckerFunction | string);
      }
    });
    const chainCheckers = doAnd(
      [doOr(roleCheckers, options), doAnd(elseCheckers, options)],
      options
    );

    return chainCheckers;
  }

  public get traceNames(): string[] {
    const tracedNames = Object.values(this.childRules)?.reduce(
      (acc, childRule) => [...acc, ...childRule.traceNames],
      []
    );
    return [this.name, ...(tracedNames || ['dumb-checker'])];
  }

  public assignChildRules(childRule: DoRuleType): void {
    // todo use only in debug mode
    this.childRules[childRule.name] = childRule;
  }

  constructor(
    checker: DoCheckerFunction | DoRuleType,
    name: string = 'no-name rule',
    options: DoRuleOptions = DefaultRuleOptions
  ) {
    this.name = name || 'no-name-rule-model';
    if (checker instanceof DoRule) {
      this.check = checker.check;
      this.assignChildRules(checker);
    } else {
      this.check = checker as DoCheckerFunction;
    }
    this.options = { ...DefaultRuleOptions, ...options };
  }

  setName(name: string): void {
    this.name = name;
  }

  toString(): string {
    return this.name;
  }
}

export function doCreatRule(
  name: string,
  args: AllPossibleCheckers | AllPossibleCheckers[],
  options?: DoRuleOptions
): DoStringDictionary<DoRule> {
  if (!Array.isArray(args)) {
    args = [args];
  }
  return {
    [name]: new DoRule(
      DoRule.checkerFactory(args, options || DefaultRuleOptions),
      name,
      options
    ),
  };
}

export function doSimpleRule(
  name: string,
  options?: DoRuleOptions
): DoStringDictionary<DoRule> {
  return doCreatRule(name, () => true, options);
}

export function doCreatRuleSet<
  T extends {
    [key: string]: AllPossibleCheckers[];
  }
>(args: T, options?: DoRuleOptions): DoStringDictionary<DoRule> {
  return Object.entries(args).reduce(
    (acc, [name, checker]) => ({
      ...acc,
      ...doCreatRule(name, checker, options),
    }),
    {} as any
  );
}

export function doExtendRule(
  name: string,
  args: AllPossibleCheckers[]
): DoStringDictionary<DoRule> {
  return doCreatRule(name, [name, ...args]);
}

export function creatStringRule(checkerName: string): DoRuleType {
  const parentRule = new DoRule((args, [userRoles, rulesSnapshot]) => {
    if (!rulesSnapshot[checkerName]) {
      throw Error('No rule for ' + checkerName);
    }
    parentRule.assignChildRules(rulesSnapshot[checkerName]);
    return rulesSnapshot[checkerName].check(args, [userRoles, rulesSnapshot]);
  }, `look up for ${checkerName}`);
  return parentRule;
}
