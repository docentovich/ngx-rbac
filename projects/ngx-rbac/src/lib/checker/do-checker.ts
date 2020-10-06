import { CheckerFunction } from '../type/checker-function';
import { DoCheckerType } from '../type/do-checker-type';

export class DoChecker implements DoCheckerType {
  constructor(
    public check: CheckerFunction,
    public name: string = 'no-name-checker'
  ) {}

  setName(name: string): void {
    this.name = name;
  }

  toString(): string {
    return this.name;
  }
}

export function creatChecker(
  name: string,
  checker: CheckerFunction
): DoCheckerType {
  return new DoChecker(checker, name);
}

export function creatStringChecker(checkerName: string): DoCheckerType {
  return creatChecker('string-checker', (args, [userRoles, rulesSnapshot]) => {
    if (!rulesSnapshot[checkerName]) {
      throw Error('No rule for ' + checkerName);
    }
    return rulesSnapshot[checkerName].check(args, [userRoles, rulesSnapshot]);
  });
}
