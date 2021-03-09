import { DoStringDictionary } from '../type/do-dictionary';
import { DoRolePermissionType } from '../type/do-role-permission-type';
import { DoRule } from './do-rule';
import { DoRuleType } from '../type/do-rule-type';

export class DoRolePermission implements DoRolePermissionType {
  get canNames(): string[] {
    return this._canNames;
  }
  get can(): DoStringDictionary<DoRuleType> {
    return this._can;
  }
  private _can: DoStringDictionary<DoRuleType>;
  private _canNames: string[];
  protected _canSelf: DoStringDictionary<DoRuleType>;
  protected _canNamesSelf: string[];
  public name: string;
  constructor(name: string) {
    this._canSelf = { [name]: new DoRule(() => true, name) };
    this._canNamesSelf = [name];
    this.name = name;
  }
}
