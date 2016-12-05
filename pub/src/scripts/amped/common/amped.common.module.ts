import { MaterialModule } from '@angular/material';
import {NgModule, Component}       from '@angular/core';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { BrowserModule }  from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { TruncatePipe } from './pipes/amped.common.truncate';
import { AmpedFilterPipe } from './pipes/amped.common.filter';
import { AmpedFormatPipe } from './pipes/amped.common.format';

import { AmpedTable, AmpedTableCell } from './amped.common.table.component';
import {JSONCell, ImageCell, TextCell} from "./amped.common.table.cells";
import { AmpedSpinner } from './amped.common.spinner.component';

// import { AmpedAuthService } from '../auth/amped.auth.service';

import { AmpedService } from './amped.common.service';
import {AmpedAlertModule} from "../alerts/amped.alerts.module";

const exportDeclarations : Array<any> = [
  TruncatePipe,
  AmpedFilterPipe,
  AmpedFormatPipe,
  AmpedTable,
  AmpedTableCell,
  AmpedSpinner
];

const entryComponents : Array<any> = [
  JSONCell, TextCell, ImageCell, AmpedSpinner
];

console.log(exportDeclarations.concat(entryComponents));

@NgModule({
  imports       : [BrowserModule, FormsModule, ReactiveFormsModule, HttpModule, MaterialModule.forRoot(), AmpedAlertModule],
  declarations  : exportDeclarations.concat(entryComponents),
  exports       : exportDeclarations.concat(entryComponents),
  providers     : [ AmpedService ],
  entryComponents : entryComponents
})
export class AmpedCommonModule { }
