import { NgModule } from '@angular/core';
import { DoProvideRulesComponent } from './component/do-provide-rules.component';
import { DoCanPipe } from './pipe/do-can.pipe';
import { DoDebugPipe } from './pipe/do-debug.pipe';

@NgModule({
  declarations: [DoProvideRulesComponent, DoCanPipe, DoDebugPipe],
  exports: [DoCanPipe, DoProvideRulesComponent, DoDebugPipe],
})
export class DoNgxRbacModule {}
