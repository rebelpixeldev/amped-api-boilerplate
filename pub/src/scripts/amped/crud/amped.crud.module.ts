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
import { AmpedCrudAddnew } from './amped.crud.addnew';
import { AmpedService } from '../common/amped.common.service';

@NgModule({
  imports         : [ CommonModule, FormsModule, ReactiveFormsModule, HttpModule, AmpedCommonModule, MaterialModule.forRoot() ],
  declarations    : [ AmpedCrudFormComponent, AmpedCrudTableComponent, AmpedCrudAddnew ],
  exports         : [ AmpedCrudFormComponent, AmpedCrudTableComponent, AmpedCrudAddnew ],
  providers       : [ AmpedFormsService, AmpedService ],
  entryComponents : [  ]
})
export class AmpedCrudModule {}
