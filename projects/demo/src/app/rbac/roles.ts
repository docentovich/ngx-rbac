import { doCreateRole, DoRoleType } from '@do/ngx-rbac';

export enum Roles {
  authorized = '[ROLES] AUTHORIZED',
  moderator = '[ROLES] MODERATOR',
}

// Initialize common role for authorized
export const authorizedRole: DoRoleType = doCreateRole(Roles.authorized);
// Initialize the most privileged role for the moderator
export const moderatorRole: DoRoleType = doCreateRole(Roles.moderator);
// Add all permissions that have a user with the authorized user role to the moderator
moderatorRole.addPermissionsOf(authorizedRole);
