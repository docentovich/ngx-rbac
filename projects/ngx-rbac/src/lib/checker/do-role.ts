import { DoChecker } from './do-checker';
import { DoRoleType } from '../type/do-role-type';
import { Dependency } from '../type/dependency';

export class DoRole extends DoChecker {
  public canRoles: string[];
  constructor(name: string, public inheritedRole?: DoRoleType) {
    super(
      (args: any, dependency: Dependency) => this.isParentOrCurrent(dependency),
      name
    );
    this.canRoles = [name].concat(this.inheritedRole?.canRoles || []);
  }

  private isParentOrCurrent([userRoles]: Dependency): boolean {
    return userRoles?.some((r) => {
      return r.canRoles.includes(this.name);
    });
  }
}

export function creatRole(
  name: string,
  inheritedRole?: DoRoleType
): DoRoleType {
  return new DoRole(name, inheritedRole);
}
