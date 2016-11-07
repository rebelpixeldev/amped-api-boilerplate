import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';

import { TruncatePipe } from './pipes/amped.common.truncate';
import { AmpedTableComponent } from './amped.common.table.component';

@NgModule({
  imports       : [BrowserModule],
  declarations  : [TruncatePipe, AmpedTableComponent],
  exports       : [TruncatePipe, AmpedTableComponent],
  providers     : []
})
export class AmpedCommonModule { }
