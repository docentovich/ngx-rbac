export type NamedDictionary<C, T> = {
  [key in keyof C]: T;
};

export interface StringDictionary<T> {
  [key: string]: T;
}

