import { doCreateRuleSet, doNot } from '@doce/ngx-rbac';
import { AppRoles } from './roles';


// The rules, that will be used in the App
export enum AppRules {
  isUnauthorized = '[RULES] IS_UNAUTHORIZED', // check is user is unauthorized
  isAuthorized = '[RULES] IS_AUTHORIZED',     // check is user is authorized
  isModerator = '[RULES] IS_MODERATOR',       // check is user is moderator
  isRestorator = '[RULES] IS_RESTORATOR',       // check is user is restorator
}

// Define the conditions by the witch the rules will be checks
export const ruleSet = doCreateRuleSet({
  [AppRules.isUnauthorized]: [
    doNot(AppRoles.authorized),
    doNot(AppRoles.moderator),
    doNot(AppRoles.restorator),
  ], // The Rule only for users with unauthorized Role
  [AppRules.isAuthorized]: [
    AppRoles.authorized,
    doNot(AppRoles.moderator),
    doNot(AppRoles.restorator),
  ], // The Rule only for users with authorized Role
  [AppRules.isModerator]: [AppRoles.moderator], // The Rule only for users with moderator Role
  [AppRules.isRestorator]: [AppRoles.restorator], // The Rule only for users with restorator Role
});
