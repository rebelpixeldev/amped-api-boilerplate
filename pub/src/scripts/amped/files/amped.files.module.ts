import { MaterialModule } from '@angular/material';
import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { HttpModule }         from '@angular/http';

import { AmpedFileUploadDisplay } from './amped.files.upload.display';

const exportDeclarations : Array<any> = [
  AmpedFileUploadDisplay
];

console.log(exportDeclarations);

@NgModule({
  imports         : [ CommonModule, HttpModule, MaterialModule.forRoot() ],
  declarations    : exportDeclarations,
  exports         : exportDeclarations,
  providers       : [  ],
  entryComponents : [  ]
})
export class AmpedFilesModule {}
