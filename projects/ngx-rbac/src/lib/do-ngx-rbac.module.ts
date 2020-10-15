import { NgModule } from '@angular/core';
import { DoProvideRulesComponent } from './component/do-provide-rules.component';
import { DoCanPipe } from './pipe/do-can.pipe';
import { DoDebugPipe } from './pipe/do-debug.pipe';
import { DoDebugComponent } from './component/do-debug.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    DoProvideRulesComponent,
    DoCanPipe,
    DoDebugPipe,
    DoDebugComponent
  ],
  exports: [DoCanPipe, DoProvideRulesComponent, DoDebugPipe, DoDebugComponent],
  imports: [
    CommonModule
  ]
})
export class DoNgxRbacModule {}
