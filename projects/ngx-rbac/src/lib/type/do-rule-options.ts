export enum DoSuppressErrors {
  allErrors,
  warnings,
  none
}

export interface DoRuleOptions {
  suppressErrors: DoSuppressErrors;
}

export const DefaultOptions: DoRuleOptions =  { suppressErrors: DoSuppressErrors.none };
