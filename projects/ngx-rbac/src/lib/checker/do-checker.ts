import { checkerFunction } from '../type/checker-function';
import { DoCheckerType } from '../type/do-checker-type';

export class DoChecker implements DoCheckerType {
  constructor(public check: checkerFunction, public name: string = 'no-name-checker') {}

  setName(name: string): void {
    this.name = name;
  }
}

export function creatChecker(
  name: string,
  checker: checkerFunction
): DoCheckerType {
  return new DoChecker(checker, name);
}
