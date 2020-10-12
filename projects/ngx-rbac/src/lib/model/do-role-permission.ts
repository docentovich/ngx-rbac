import { DoStringDictionary } from '@do/ngx-rbac';
import { DoRolePermissionType } from '../type/do-role-permission-type';
import { DoRule } from './do-rule';
import { DoRuleType } from '../type/do-rule-type';

export class DoRolePermission implements DoRolePermissionType {
  public can: DoStringDictionary<DoRuleType>;
  public name: string;
  public canNames: string[];
  constructor(name: string) {
    this.can = { [name]: new DoRule(() => true, name) };
    this.canNames = [name];
    this.name = name;
  }
}
