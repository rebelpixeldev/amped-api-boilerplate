import {Component, OnInit, Output, EventEmitter} from '@angular/core';

import { AmpedFilesService } from './amped.files.service';

@Component({
    moduleId: module.id,
    selector: 'amp-media-library',
    template : `
      <md-card-title>
        <amp-upload-btn></amp-upload-btn>
      </md-card-title>
      <md-card-content>
        <md-grid-list cols="8" gutterSize="10px">
          <md-grid-tile *ngFor="let file of files; let i=index">
            <img (click)="selectFile(file)" src="{{file.source_url}}" alt="">
          </md-grid-tile>
        </md-grid-list>
      </md-card-content>
      `
})
export class MediaLibraryComponent implements OnInit {
  
  @Output() onFileSelect : EventEmitter<any> = new EventEmitter();
  
  private files : Array<any> = []; // @TODO need to type to a files interface
  
    constructor(private filesService : AmpedFilesService) { }

    ngOnInit() {
      this.filesService.getFiles()
        .then((resp) => this.files = resp);
    }
    
    uploadFile(){
      
    }
  
  selectFile(file : any){ // @TODO add interface as type
    console.log(file);
    this.onFileSelect.emit([file]);
  }
    
}
