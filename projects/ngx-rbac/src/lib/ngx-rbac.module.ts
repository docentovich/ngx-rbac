import { NgModule } from '@angular/core';
import { DoProvideRulesComponent } from './component/do-provide-rules.component';
import { DoCanPipe } from './pipe/do-can.pipe';
import { DoCanGuard } from './guard/do-can.guard';
import { DoGlobalRulesService } from './service/do-global-rules.service';

@NgModule({
  declarations: [DoProvideRulesComponent, DoCanPipe],
  providers: [DoCanGuard, DoGlobalRulesService],
  exports: [DoCanPipe, DoProvideRulesComponent],
})
export class NgxRbacModule {}
