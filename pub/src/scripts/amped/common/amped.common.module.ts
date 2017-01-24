import { MaterialModule } from '@angular/material';
import {NgModule, Component}       from '@angular/core';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { BrowserModule }  from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { TruncatePipe } from './pipes/amped.common.truncate';
import { AmpedFilterPipe } from './pipes/amped.common.filter';
import { AmpedFormatPipe } from './pipes/amped.common.format';

import { AmpedSpinner } from './amped.common.spinner.component';
import { AsyncButtonComponent } from './amped.common.async.button';


import { AmpedService }   from './amped.common.service';
import {AmpedAlertModule} from "../alerts/amped.alerts.module";
import {MomentModule}     from "angular2-moment";
import {Ng2PaginationModule} from "ng2-pagination";

// @TODO had issues when using the angular compiler using variables for this. Figure out why
// const exportDeclarations : Array<any> = [
//   TruncatePipe,
//   AmpedFilterPipe,
//   AmpedFormatPipe,
//   AmpedTable,
//   AmpedTableCell,
//   AmpedSpinner
// ];
//
// const entryComponents : Array<any> = [
//   JSONCell, TextCell, ImageCell, AmpedSpinner
// ];
//
// const
//   declarations = exportDeclarations.concat(entryComponents),
//   exports = exportDeclarations.concat(entryComponents);

@NgModule({
  imports       : [BrowserModule, FormsModule, ReactiveFormsModule, HttpModule, AmpedAlertModule, MaterialModule.forRoot(), MomentModule],
  declarations  : [
    TruncatePipe,
    AmpedFilterPipe,
    AmpedFormatPipe,
    AmpedSpinner, AmpedSpinner, AsyncButtonComponent
  ],
  exports       : [
    TruncatePipe,
    AmpedFilterPipe,
    AmpedFormatPipe,
    AmpedSpinner, AmpedSpinner, AsyncButtonComponent
  ],
  providers       : [ AmpedService ],
  entryComponents : [
    AmpedSpinner
  ]
})
export class AmpedCommonModule { }
