import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { DoGlobalRulesService } from '../service/do-global-rules.service';

@Injectable({ providedIn: 'root' })
export class DoCanGuard implements CanActivate {
  constructor(private guardRulesService: DoGlobalRulesService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return (route.data.rules as string[]).every((ruleName) => {
      return this.guardRulesService.can(ruleName);
    });
  }
}
