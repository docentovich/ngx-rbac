export enum DoSuppressErrors {
  allErrors,
  warnings,
  none,
}

export interface DoRuleOptions {
  suppressErrors?: DoSuppressErrors;
  groupName?: string;
}

export const DefaultOptions: DoRuleOptions = {
  suppressErrors: DoSuppressErrors.none,
  groupName: 'no-group',
};
