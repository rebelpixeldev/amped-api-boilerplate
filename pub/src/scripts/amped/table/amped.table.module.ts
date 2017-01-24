import { MaterialModule }     from '@angular/material';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AmpedCommonModule } from '../common/amped.common.module';
import { AmpedAlertModule } from '../alerts/amped.alerts.module';
import { AmpedChatModule } from '../chat/amped.chat.module';

import { AmpedTable, AmpedTableCell, tableFilter } from './amped.table.component';
import {
  JSONCell,
  ImageCell,
  TextCell,
  DateCell} from "./amped.table.cells";

import {Ng2PaginationModule} from "ng2-pagination";
import {MomentModule}     from "angular2-moment";

const exportDeclarations : Array<any> = [
  AmpedTable, AmpedTableCell, tableFilter, JSONCell, ImageCell, TextCell, DateCell
];

@NgModule({
  imports         : [ MaterialModule.forRoot(), AmpedCommonModule, Ng2PaginationModule, FormsModule, BrowserModule, AmpedAlertModule, MomentModule, AmpedChatModule ],
  declarations    : exportDeclarations,
  exports         : exportDeclarations,
  providers       : [ ],
  entryComponents : [
    JSONCell, TextCell, ImageCell, DateCell
  ]
})

export class AmpedTableModule {}
