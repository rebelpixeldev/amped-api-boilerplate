import { MaterialModule }     from '@angular/material';
import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';


import { AmpedService } from '../common/amped.common.service';
import { AmpedCommonModule } from '../common/amped.common.module';
import { AmpedFilesModule } from '../files/amped.files.module';
import { AmpedFormComponent } from './amped.form.component';

const exportDeclarations : Array<any> = [
  AmpedFormComponent,
];

@NgModule({
  imports         : [ CommonModule, FormsModule, ReactiveFormsModule, MaterialModule.forRoot(), AmpedCommonModule, AmpedFilesModule ],
  declarations    : [ AmpedFormComponent ],
  exports         : [ AmpedFormComponent ],
  providers       : [ AmpedService ],
  entryComponents : [  ]
})
export class AmpedFormsModule {}
