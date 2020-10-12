export enum DoAbsentRuleBehavior {
  allErrors,
  warnings,
  fails,
  ignore,
}

export interface DoRuleOptions {
  absentRuleBehavior?: DoAbsentRuleBehavior;
  groupName?: string;
}

export const DefaultRuleOptions: DoRuleOptions = {
  absentRuleBehavior: DoAbsentRuleBehavior.fails,
  groupName: 'no-group',
};
