import { NgModule } from '@angular/core';
import { DoProvideRulesComponent } from './component/do-provide-rules.component';
import { DoCanPipe } from './pipe/do-can.pipe';

@NgModule({
  declarations: [DoProvideRulesComponent, DoCanPipe],
  exports: [DoCanPipe, DoProvideRulesComponent],
})
export class DoNgxRbacModule {}
