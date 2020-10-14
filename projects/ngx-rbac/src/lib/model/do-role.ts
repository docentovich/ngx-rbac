import { DoRoleType } from '../type/do-role-type';
import { DoRolePermissionType } from '../type/do-role-permission-type';
import { DoRuleType } from '../type/do-rule-type';
import { DoRolePermission } from './do-role-permission';
import { DoStringDictionary } from '../type/do-dictionary';
import { DoRule } from './do-rule';
import { DoDebugType } from '../type/do-debug-type';

export class DoRole extends DoRolePermission implements DoRoleType, DoDebugType {
  _childes: DoRolePermissionType[] = [];

  get can(): DoStringDictionary<DoRuleType> {
    return this._childes.reduce(
      (acc: DoStringDictionary<DoRuleType>, children) => ({
        ...this._canSelf,
        ...children.can,
      }),
      {}
    );
  }
  get canNames(): string[] {
    return this._childes.reduce(
      (acc: string[], children) => [
        ...this._canNamesSelf,
        ...children.canNames,
      ],
      []
    );
  }

  addChild(child: DoRolePermissionType) {
    this._childes.push(child);
  }

  addRule(rule: DoRuleType | DoStringDictionary<DoRuleType>) {
    if (rule instanceof DoRule) {
      this.can[rule.name] = rule;
      return;
    }

    Object.values(rule).forEach((_rule) => (this.can[_rule.name] = _rule));
  }

  toString() {
    return this.name;
  }
}

export function doCreatRole(name: string): DoRoleType {
  return new DoRole(name);
}
