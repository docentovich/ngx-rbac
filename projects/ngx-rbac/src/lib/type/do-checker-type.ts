import { CheckerFunction } from './checker-function';

export interface DoCheckerType {
  check: CheckerFunction;
  name: string;

  setName(name: string): void;
  toString(): string;
}

