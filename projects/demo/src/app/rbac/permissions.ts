import { doCreatePermission } from "@doce/ngx-rbac";

export enum AppPermissions {
  canEditSelf = '[PERMISSIONS] CAN EDIT SELF',
  canEditOther = '[PERMISSIONS] CAN EDIT OTHER',
  canDelete = '[PERMISSIONS] CAN DELETE',
  canRestore = '[PERMISSIONS] CAN RESTORE',
  canSeeUserList = '[PERMISSIONS] CAN SEE USER LIST',
  canSeeDeletedUser = '[PERMISSIONS] CAN SEE DELETED USER',
  canLogout = '[PERMISSIONS] CAN LOGOUT',
  canLogin = '[PERMISSIONS] CAN LOGIN',
}

export const canEditSelfPermission =  doCreatePermission(AppPermissions.canEditSelf);
export const canSeeUserListPermission =  doCreatePermission(AppPermissions.canSeeUserList);
export const canEditOtherPermission =  doCreatePermission(AppPermissions.canEditOther);
export const canDeletePermission =  doCreatePermission(AppPermissions.canDelete);
export const canSeeDeletedUserPermission = doCreatePermission(AppPermissions.canSeeDeletedUser)
export const canRestorePermission =  doCreatePermission(AppPermissions.canRestore);
export const canLogout = doCreatePermission(AppPermissions.canLogout);
export const canLogin = doCreatePermission(AppPermissions.canLogin);
