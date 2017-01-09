import { MaterialModule } from '@angular/material';
import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { HttpModule }         from '@angular/http';
import {
  FormsModule,
  ReactiveFormsModule }       from '@angular/forms';

import { AmpedCrudFormComponent } from './amped.crud.form.component';
import { AmpedCrudTableComponent } from './amped.crud.table.component';
import { AmpedFormsService }  from './amped.crud.service';

import { AmpedCommonModule } from '../common/amped.common.module';
import { AmpedFilesModule } from '../files/amped.files.module';
import { AmpedFormsModule } from '../form/amped.form.module';
import { AmpedCrudAddnew } from './amped.crud.addnew';
import { AmpedService } from '../common/amped.common.service';

import { CreateCrudDialogDirective, CrudCreateDialog } from './dialogs/amped.crud.create.dialog';

@NgModule({
  imports         : [ CommonModule, FormsModule, ReactiveFormsModule, HttpModule, AmpedCommonModule, AmpedFilesModule, AmpedFormsModule, MaterialModule.forRoot() ],
  declarations    : [ AmpedCrudFormComponent, AmpedCrudTableComponent, AmpedCrudAddnew, CreateCrudDialogDirective, CrudCreateDialog ],
  exports         : [ AmpedCrudFormComponent, AmpedCrudTableComponent, AmpedCrudAddnew, CreateCrudDialogDirective ],
  providers       : [ AmpedFormsService, AmpedService ],
  entryComponents : [ CrudCreateDialog ]
})
export class AmpedCrudModule {}
