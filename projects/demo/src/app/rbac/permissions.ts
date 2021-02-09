import { doCreatePermission } from "@do/ngx-rbac";

export enum AppPermissions {
  canEditSelf = '[PERMISSIONS] CAN EDIT SELF',
  canEditOther = '[PERMISSIONS] CAN EDIT OTHER',
  canDelete = '[PERMISSIONS] CAN DELETE',
  canRestore = '[PERMISSIONS] CAN RESTORE',
  canSeeUserList = '[PERMISSIONS] CAN SEE USER LIST',
  canSeeDeletedUser = '[PERMISSIONS] CAN SEE DELETED USER',
}

export const canEditSelfPermission =  doCreatePermission(AppPermissions.canEditSelf);
export const canSeeUserListPermission =  doCreatePermission(AppPermissions.canSeeUserList);
export const canEditOtherPermission =  doCreatePermission(AppPermissions.canEditOther);
export const canDeletePermission =  doCreatePermission(AppPermissions.canDelete);
export const canSeeDeletedUserPermission = doCreatePermission(AppPermissions.canSeeDeletedUser)
export const canRestorePermission =  doCreatePermission(AppPermissions.canRestore);
