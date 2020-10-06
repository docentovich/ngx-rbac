import { SimpleChange } from '@angular/core';

export type TypedSimpleChanges<T> = {
  [prop in keyof T]: TypedSimpleChange<T[prop]>;
};

export declare class TypedSimpleChange<T> extends SimpleChange {
  previousValue: T;
  currentValue: T;
  constructor(previousValue: T, currentValue: T);
}
