import {Component, OnInit, Output, Input, EventEmitter} from '@angular/core';

import {AmpedFilesService} from './amped.files.service';

import {AmpedSocketService} from '../socket/amped.socket.service';

@Component({
  moduleId: module.id,
  selector: 'amp-media-library',
  template: `
      <md-card-title>
        <amp-upload-btn (onUpload)="onFileUpload($event)"></amp-upload-btn>
        <span class="fill-remaining-space"></span>
        <pagination-controls (pageChange)="page = $event" #controls></pagination-controls>
      </md-card-title>
      
      <md-card-content>
        <md-grid-list class="uploads-file-list" cols="{{cols}}" gutterSize="{{gutter}}">
          <md-grid-tile *ngFor="let file of files | paginate: { itemsPerPage: perpage,
                                                                  currentPage: page}">
          
            <img (click)="selectFile(file)" src="{{file.source_url}}" alt="">
          </md-grid-tile>
        </md-grid-list>
        
      </md-card-content>
      `
})
export class MediaLibraryComponent implements OnInit {

  @Input() cols : number = 6;
  @Input() gutter : number = 10;

  @Input() perpage  : number = 18;
  @Input() page     : number = 1;

  @Output() onFileSelect: EventEmitter<any> = new EventEmitter();

  private files: Array<any> = []; // @TODO need to type to a files interface

  constructor(private filesService: AmpedFilesService, private socketService: AmpedSocketService) {
  }

  ngOnInit() {
    this.filesService.getFiles()
      .then((resp) => this.files = resp);
  }

  uploadFile() {

  }

  selectFile(file: any) { // @TODO add interface as type
    console.log(file);
    this.onFileSelect.emit(file);
  }

  onFileUpload( file: any ) {
    console.log('UPLOAD', file);
    this.page = 1;
    this.files = [...file, ...this.files];
  }

  onPageChange(page : any){
    console.log('PAGE CHANGE', page);
    this.page = page;
  }

}
