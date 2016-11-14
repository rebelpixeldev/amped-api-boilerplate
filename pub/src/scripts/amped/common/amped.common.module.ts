import { NgModule }       from '@angular/core';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { BrowserModule }  from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { TruncatePipe } from './pipes/amped.common.truncate';
import { SlugtotitlePipe } from './pipes/amped.common.slugtotitle';
import { AmpedFilterPipe } from './pipes/amped.common.filter';

import { AmpedTableComponent } from './amped.common.table.component';
import { AmpedFormComponent } from './amped.common.form.component';

// import { AmpedAuthService } from '../auth/amped.auth.service';

import { AmpedService } from './amped.common.service';

@NgModule({
  imports       : [BrowserModule, FormsModule, ReactiveFormsModule, HttpModule],
  declarations  : [TruncatePipe, SlugtotitlePipe, AmpedFilterPipe, AmpedTableComponent, AmpedFormComponent],
  exports       : [TruncatePipe, SlugtotitlePipe, AmpedFilterPipe, AmpedTableComponent, AmpedFormComponent],
  providers     : [ AmpedService ]
})
export class AmpedCommonModule { }
