import { doCreateRole, DoRoleType } from '@do/ngx-rbac';
import {
  canEditSelfPermission,
canSeeUserListPermission,
canEditOtherPermission,
canDeletePermission,
canSeeDeletedUserPermission,
canRestorePermission,
} from './permissions';

export enum Roles {
  authorized = '[ROLES] AUTHORIZED',
  moderator = '[ROLES] MODERATOR',
  restorator = '[ROLES] RESTORATOR',
}

// Initialize common role for authorized
export const authorizedRole: DoRoleType = doCreateRole(Roles.authorized);
authorizedRole.addPermissionsOf(canEditSelfPermission);
authorizedRole.addPermissionsOf(canSeeUserListPermission);
// Initialize the most privileged role for the moderator
export const moderatorRole: DoRoleType = doCreateRole(Roles.moderator);
// Add all permissions that have a user with the authorized user role to the moderator
moderatorRole.addPermissionsOf(authorizedRole);
moderatorRole.addPermissionsOf(canEditOtherPermission);
moderatorRole.addPermissionsOf(canDeletePermission);
// Initialize the restorator role
export const restoratorRole: DoRoleType = doCreateRole(Roles.restorator);
restoratorRole.addPermissionsOf(authorizedRole);
restoratorRole.addPermissionsOf(canSeeDeletedUserPermission);
restoratorRole.addPermissionsOf(canRestorePermission);
