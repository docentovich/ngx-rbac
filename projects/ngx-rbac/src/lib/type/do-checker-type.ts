import { DoCheckerFunction } from './do-checker-function';

export interface DoCheckerType {
  check: DoCheckerFunction;
  name: string;

  setName(name: string): void;
  toString(): string;
}

