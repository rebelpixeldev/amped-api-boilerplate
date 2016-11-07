import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { HttpModule }         from '@angular/http';
import {
  FormsModule,
  ReactiveFormsModule }       from '@angular/forms';

import { AmpedCrudFormComponent } from './amped.forms.crudform.component';
import { AmpedCrudTableComponent } from './amped.forms.crudtable.component';
import { AmpedFormComponent } from './amped.forms.form.component';
import { AmpedFormsService }  from './amped.forms.service';

import { AmpedCommonModule } from '../common/amped.common.module';


@NgModule({
  imports:      [ CommonModule, FormsModule, ReactiveFormsModule, HttpModule, AmpedCommonModule ],
  declarations: [ AmpedFormComponent, AmpedCrudFormComponent, AmpedCrudTableComponent ],
  exports:      [ AmpedFormComponent, AmpedCrudFormComponent, AmpedCrudTableComponent ],
  providers:    [ AmpedFormsService ]
})
export class AmpedFormsModule { }
