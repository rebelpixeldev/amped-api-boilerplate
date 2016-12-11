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

import { FilesLibraryPage } from './pages/amped.files.page.library';

import { AmpedService } from '../common/amped.common.service';
import { AmpedCommonModule } from '../common/amped.common.module';
import {AmpedAlertModule} from "../alerts/amped.alerts.module";

const exportDeclarations : Array<any> = [
  AmpedFileUploadDisplay,
  MediaLibraryComponent,
  UploadBtnComponent,
  FilesDialogDirective,
  FileLibraryDialog,
  
  FilesLibraryPage
];

@NgModule({
  imports         : [ CommonModule, HttpModule, FormsModule, MaterialModule.forRoot(), Ng2PaginationModule, AmpedCommonModule, AmpedAlertModule ],
  declarations    : exportDeclarations,
  exports         : exportDeclarations,
  providers       : [ AmpedService, AmpedFilesService ],
  entryComponents : [ FileLibraryDialog ]
})
export class AmpedFilesModule {}
