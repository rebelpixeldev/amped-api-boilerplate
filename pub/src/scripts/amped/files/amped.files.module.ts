import { MaterialModule }     from '@angular/material';
import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { HttpModule }         from '@angular/http';
import { FormsModule }        from '@angular/forms';

import {Ng2PaginationModule} from 'ng2-pagination';

import { AmpedFileUploadDisplay } from './amped.files.upload.display';
import { MediaLibraryComponent }  from './amped.files.media.library';
import { UploadBtnComponent }     from './amped.files.upload.button';
import { AmpedFilesService }      from './amped.files.service';
import { FilesDialogDirective, FileLibraryDialog }      from './amped.files.dialog';

import { AmpedService } from '../common/amped.common.service';

const exportDeclarations : Array<any> = [
  AmpedFileUploadDisplay,
  MediaLibraryComponent,
  UploadBtnComponent,
  FilesDialogDirective,
  FileLibraryDialog
];

@NgModule({
  imports         : [ CommonModule, HttpModule, FormsModule, MaterialModule.forRoot(), Ng2PaginationModule ],
  declarations    : exportDeclarations,
  exports         : exportDeclarations,
  providers       : [ AmpedService, AmpedFilesService ],
  entryComponents : [ FileLibraryDialog ]
})
export class AmpedFilesModule {}
