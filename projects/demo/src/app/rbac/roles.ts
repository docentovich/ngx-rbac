import { doCreateRole, DoRoleType } from '@doce/ngx-rbac';
import * as permissions from './permissions';

export enum Roles {
  authorized = '[ROLES] AUTHORIZED',
  moderator = '[ROLES] MODERATOR',
  restorator = '[ROLES] RESTORATOR',
}

// Initialize common role for authorized
export const authorizedRole: DoRoleType = doCreateRole(Roles.authorized);
authorizedRole.addPermissionsOf(permissions.canEditSelfPermission);
authorizedRole.addPermissionsOf(permissions.canSeeUserListPermission);
authorizedRole.addPermissionsOf(permissions.canLogout);
// Initialize the most privileged role for the moderator
export const moderatorRole: DoRoleType = doCreateRole(Roles.moderator);
// Add all permissions that have a user with the authorized user role to the moderator
moderatorRole.addPermissionsOf(authorizedRole);
moderatorRole.addPermissionsOf(permissions.canEditOtherPermission);
moderatorRole.addPermissionsOf(permissions.canDeletePermission);
// Initialize the restorator role
export const restoratorRole: DoRoleType = doCreateRole(Roles.restorator);
restoratorRole.addPermissionsOf(authorizedRole);
restoratorRole.addPermissionsOf(permissions.canSeeDeletedUserPermission);
restoratorRole.addPermissionsOf(permissions.canRestorePermission);
