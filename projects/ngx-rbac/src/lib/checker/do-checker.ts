import { checkerFunction } from '../type/checker-function';
import { DoCheckerType } from '@do/ngx-rbac';

export class DoChecker {
  constructor(public check: checkerFunction, public name: string = 'no-name') {
  }
}

export function creatChecker(
  name: string,
  checker: checkerFunction
): DoCheckerType {
  return new DoChecker(checker, name);
}
