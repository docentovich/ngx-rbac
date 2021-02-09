import { DoRoleType } from '../type/do-role-type';
import { DoRolePermissionType } from '../type/do-role-permission-type';
import { DoRuleType } from '../type/do-rule-type';
import { DoRolePermission } from './do-role-permission';
import { DoStringDictionary } from '../type/do-dictionary';
import { DoRule } from './do-rule';
import { DoDebugType } from '../type/do-debug-type';

export class DoRole extends DoRolePermission implements DoRoleType, DoDebugType {
  private _childes: DoRolePermissionType[] = [];
  private _assignedRules: DoStringDictionary<DoRuleType> = {};

  get can(): DoStringDictionary<DoRuleType> {
    return this._childes.reduce(
      (acc: DoStringDictionary<DoRuleType>, children) => ({
        ...acc,
        ...this._canSelf,
        ...children.can,
        ...this._assignedRules
      }),
      {}
    );
  }
  get canNames(): string[] {
    return this._childes.reduce(
      (acc: string[], children) => [
        ...acc,
        ...this._canNamesSelf,
        ...children.canNames,
      ],
      []
    );
  }

  addPermissionsOf(child: DoRolePermissionType) {
    this._childes.push(child);
  }

  addRule(rule: DoRuleType | DoStringDictionary<DoRuleType>) {
    let _rule = rule;
    if (rule instanceof DoRule) {
      _rule = { [rule.name]: rule };
    }

    Object.values(_rule).forEach((r) => {
      this._assignedRules[r.name] = r;
      this._canNamesSelf.push(r.name);
    });
  }

  toString() {
    return this.name;
  }
}

export function doCreateRole(name: string): DoRoleType {
  return new DoRole(name);
}
