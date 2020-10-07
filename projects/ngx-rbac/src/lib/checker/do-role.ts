import { DoChecker } from './do-checker';
import { DoRoleType } from '../type/do-role-type';
import { Dependency } from '../type/dependency';

export class DoRole extends DoChecker implements DoRoleType {
  public canRoles: string[];
  public inheritedRole: DoRoleType[];
  constructor(name: string, inheritedRole: DoRoleType | DoRoleType[] = []) {
    super(
      (args: any, dependency: Dependency) => this.isParentOrCurrent(dependency),
      name
    );
    this.inheritedRole = Array.isArray(inheritedRole)
      ? inheritedRole
      : [inheritedRole];
    this.canRoles = [
      name,
      ...new Set(
        this.inheritedRole?.reduce(
          (canRoles, role) => [...canRoles, ...role.canRoles],
          []
        )
      ),
    ];
  }

  private isParentOrCurrent([userRoles]: Dependency): boolean {
    return userRoles?.some((r) => {
      return r.canRoles.includes(this.name);
    });
  }
}

export function doCreatRole(
  name: string,
  inheritedRole?: DoRoleType | DoRoleType[]
): DoRoleType {
  return new DoRole(name, inheritedRole);
}
