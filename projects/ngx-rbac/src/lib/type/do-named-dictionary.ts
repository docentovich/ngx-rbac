export type DoNamedDictionary<C, T> = {
  [key in keyof C]: T;
};

export interface DoStringDictionary<T> {
  [key: string]: T;
}

