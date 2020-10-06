import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { DoGlobalRulesService } from '../service/do-global-rules.service';
import { Observable } from 'rxjs';

@Injectable()
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
