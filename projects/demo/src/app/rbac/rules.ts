import { doCreateRuleSet, doNot } from '@do/ngx-rbac';
import { Roles } from './roles';


// The rules, that will be used in the App
export const enum rules {
  isUnauthorized = '[RULES] IS_UNAUTHORIZED', // check is user is unauthorized
  isAuthorized = '[RULES] IS_AUTHORIZED',     // check is user is authorized
  isModerator = '[RULES] IS_MODERATOR',       // check is user is moderator
}

// Define the conditions by the witch the rules will be checks
export const ruleSet = doCreateRuleSet({
  [rules.isUnauthorized]: [
    doNot(Roles.authorized),
    doNot(Roles.moderator)
],                                                                  // The Rule only for users with unauthorized Role
  [rules.isAuthorized]: [Roles.authorized, doNot(Roles.moderator)], // The Rule only for users with authorized Role
  [rules.isModerator]: [Roles.moderator]                            // The Rule only for users with moderator Role
})
